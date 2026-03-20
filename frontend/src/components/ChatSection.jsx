import React, { useState } from "react";
import { FaMicrophone, FaUtensils, FaClock, FaChair, FaPhone } from "react-icons/fa";

const ChatSection = () => {
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Assalam-o-Alaikum! Bite Boss madad ke liye yahan hai." }
  ]);

  const replyHandler = (type) => {
    let userText = "";
    let botReply = "";

    switch (type) {
      case "menu":
        userText = "Menu chahiye";
        botReply = "🍔 Burger, 🍕 Pizza, 🍟 Fries available hain.\nMenu home page par hai.";
        break;

      case "table":
        userText = "Table book karni hai";
        botReply = "🪑 Table booking ke liye 'Book Table' page open karein.";
        break;

      case "time":
        userText = "Timing kya hai";
        botReply = "⏰ Hum rozana 12 PM se 12 AM tak open hain.";
        break;

      case "contact":
        userText = "Contact chahiye";
        botReply = "📞 Contact details neeche Contact section me mojood hain.";
        break;

      default:
        return;
    }

    setMessages((prev) => [
      ...prev,
      { from: "user", text: userText },
      { from: "bot", text: botReply }
    ]);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-white">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT INFO / ACTION BUTTONS */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            🤝 Bite Boss Help Desk
          </h2>
          <p className="text-gray-600 mb-6">
            Button dabayein ya mic use karein — hum madad karenge.  
            Text likhne ki zaroorat nahi.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => replyHandler("menu")}
              className="flex items-center gap-3 bg-white shadow-md p-4 rounded-xl hover:scale-105 transition"
            >
              <FaUtensils className="text-orange-500 text-xl" />
              <span className="font-semibold">Menu</span>
            </button>

            <button
              onClick={() => replyHandler("table")}
              className="flex items-center gap-3 bg-white shadow-md p-4 rounded-xl hover:scale-105 transition"
            >
              <FaChair className="text-orange-500 text-xl" />
              <span className="font-semibold">Table</span>
            </button>

            <button
              onClick={() => replyHandler("time")}
              className="flex items-center gap-3 bg-white shadow-md p-4 rounded-xl hover:scale-105 transition"
            >
              <FaClock className="text-orange-500 text-xl" />
              <span className="font-semibold">Timing</span>
            </button>

            <button
              onClick={() => replyHandler("contact")}
              className="flex items-center gap-3 bg-white shadow-md p-4 rounded-xl hover:scale-105 transition"
            >
              <FaPhone className="text-orange-500 text-xl" />
              <span className="font-semibold">Contact</span>
            </button>
          </div>
        </div>

        {/* RIGHT CHAT BOX */}
        <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col h-[420px]">
          <div className="border-b pb-3 mb-3">
            <h3 className="font-bold text-orange-600">Live Help</h3>
            <p className="text-xs text-gray-500">Buttons ya voice use karein</p>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[80%] p-3 rounded-xl ${
                  msg.from === "user"
                    ? "bg-orange-500 text-white ml-auto"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* VOICE BUTTON */}
          <div className="pt-4 flex justify-center">
            <button className="bg-orange-500 text-white p-4 rounded-full shadow-lg">
              <FaMicrophone size={22} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ChatSection;
