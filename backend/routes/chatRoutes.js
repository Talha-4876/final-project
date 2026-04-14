import express from "express";
import axios from "axios";
import Product from "../models/Product.js";

const router = express.Router();

// Learned words mapping
const learnedWords = {
  surprise: "sprite",
  "coca cola": "coca-cola",
  coke: "coca-cola",
  dew: "dew",
};

// Normalize text (case-insensitive, remove extra spaces, map learned words)
const normalizeText = (text) => {
  text = text.toLowerCase().trim();
  for (let key in learnedWords) {
    const regex = new RegExp(key, "gi");
    text = text.replace(regex, learnedWords[key]);
  }
  text = text.replace(/\s+/g, " ");
  return text;
};

// Detect language (simple heuristic)
const detectLanguage = (text) => {
  const enWords = ["price", "cost", "rate", "menu", "kitni", "total", "best", "recommend", "top"];
  return enWords.some((w) => text.toLowerCase().includes(w)) ? "en" : "ur";
};

// Safe AI fallback
const getAIResponse = async (prompt) => {
  try {
    if (!process.env.GEMINI_API_KEY) return null;
    const res = await axios.post(
      "https://api.lms.ai/v1/generate",
      { prompt, max_output_tokens: 100 },
      { headers: { Authorization: `Bearer ${process.env.GEMINI_API_KEY}` } }
    );
    return res.data.output_text;
  } catch (err) {
    console.log("AI failed ❌", err.message);
    return null;
  }
};

// Parse quantities and products from message
const parseOrder = (msg, products) => {
  const order = [];
  const parts = msg.split(/or|,/gi); // split by 'or' or ','

  for (let part of parts) {
    const match = part.match(/(\d+)?\s*(.+)/); // optional number + product
    if (!match) continue;

    let qty = parseInt(match[1]) || 1; // default 1 if not specified
    let name = normalizeText(match[2].trim());

    const product = products.find(
      (p) => normalizeText(p.name) === name && p.available
    );

    if (product) order.push({ product, qty });
  }

  return order;
};

// Flexible top item keywords
const topItemKeywords = ["best", "top", "recommend", "zayada sale", "sab se zayada"];

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.json({ reply: "Message required" });

    const msg = normalizeText(message);
    const lang = detectLanguage(msg);
    const products = await Product.find();

    // 1️⃣ Check for quantity-based order total
    const orderItems = parseOrder(msg, products);
    if (orderItems.length > 0) {
      let reply = "🧾 Order Details:\n";
      let total = 0;

      for (let item of orderItems) {
        const price = item.product.price * item.qty;
        reply += `${item.qty} x ${item.product.name} = Rs.${price}\n`;
        total += price;
      }

      reply += `\n💰 Total: Rs.${total}`;
      return res.json({ reply });
    }

    // 2️⃣ Check for BEST / TOP item request (any phrasing)
    if (topItemKeywords.some((k) => msg.includes(k))) {
      const available = products.filter((p) => p.available);
      if (available.length === 0) return res.json({ reply: "No item available right now." });

      // For example, top item by price
      const best = available.sort((a, b) => b.price - a.price)[0];
      return res.json({ reply: `🔥 Best item: ${best.name} (Rs.${best.price})` });
    }

    // 3️⃣ CATEGORY MENU request
    const categoryKeywords = ["pizza", "burger", "drink"];
    const clickedCategory = categoryKeywords.find((c) => msg.includes(c));
    if (clickedCategory) {
      const items = products.filter((p) =>
        normalizeText(p.name).includes(clickedCategory)
      );
      if (items.length === 0) return res.json({ reply: `No ${clickedCategory} available.` });

      const list = items.map((i) => `• ${i.name} - Rs.${i.price}`).join("\n");
      return res.json({ reply: `📋 ${clickedCategory.toUpperCase()} MENU:\n\n${list}` });
    }

    // 4️⃣ GENERAL MENU request
    const menuKeywords = ["menu", "items", "kya kya hai", "kya hai", "list"];
    if (menuKeywords.some((k) => msg.includes(k))) {
      const availableProducts = products.filter((p) => p.available);
      if (availableProducts.length === 0)
        return res.json({
          reply: lang === "en"
            ? "No items are available right now."
            : "Filhal koi item available nahi hai.",
        });

      const categories = { "🍕 Pizza": [], "🍔 Burgers": [], "🥤 Drinks": [], "🍽️ Other": [] };
      availableProducts.forEach((p) => {
        const name = normalizeText(p.name);
        if (name.includes("pizza")) categories["🍕 Pizza"].push(p);
        else if (name.includes("burger")) categories["🍔 Burgers"].push(p);
        else if (name.includes("cola") || name.includes("sprite") || name.includes("drink") || name.includes("dew"))
          categories["🥤 Drinks"].push(p);
        else categories["🍽️ Other"].push(p);
      });

      let menuText = lang === "en" ? "📋 Our Menu:\n\n" : "📋 Bite Boss Menu:\n\n";
      for (let category in categories) {
        if (categories[category].length > 0) {
          menuText += `${category}\n`;
          categories[category].forEach((item) => {
            menuText += `• ${item.name} - Rs.${item.price}\n`;
          });
          menuText += "\n";
        }
      }

      return res.json({ reply: menuText });
    }

    // 5️⃣ Check for single product price / availability
    let foundItem = products.find((p) => msg.includes(normalizeText(p.name)));
    if (!foundItem) {
      for (let key in learnedWords) {
        if (msg.includes(key)) {
          const name = learnedWords[key];
          foundItem = products.find((p) => normalizeText(p.name) === name);
          if (foundItem) break;
        }
      }
    }

    if (foundItem) {
      return res.json({
        reply: foundItem.available
          ? `${foundItem.name} available hai aur price Rs.${foundItem.price} hai`
          : `${foundItem.name} abhi available nahi hai.`,
      });
    }

    // 6️⃣ Fallback AI / Suggestions
    const availableProducts = products.filter((p) => p.available);
    const suggestions = availableProducts.map((p) => p.name).slice(0, 5).join(", ");
    const friendlyReply =
      lang === "en"
        ? `Sorry, this item is not available. You can try: ${suggestions}`
        : `Maaf kijiye, ye item available nahi hai. Aap yeh try kar sakte hain: ${suggestions}`;

    const aiReply = await getAIResponse(msg);
    return res.json({ reply: aiReply ? `${friendlyReply}\n${aiReply}` : friendlyReply });
  } catch (err) {
    console.error(err);
    return res.json({ reply: "Server error, please try again" });
  }
});

export default router;