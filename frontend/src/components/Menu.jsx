import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { backendUrl } from "../config";
import ProductCard from "./ProductCard";
import { CartContext } from "../context/CartContext";
import { SearchContext } from "../context/SearchContext";

const categories = [
  { id: 1, title: "All", slug: "all" },
  { id: 2, title: "Fast Food", slug: "fast food" },
  { id: 3, title: "Desi Food", slug: "desi food" },
  { id: 4, title: "Breakfast", slug: "breakfast" },
  { id: 5, title: "Lunch", slug: "lunch" },
  { id: 6, title: "Dinner", slug: "dinner" },
  { id: 7, title: "Coffee", slug: "coffee" },
  { id: 8, title: "Cold Drinks", slug: "cold drinks" },
  { id: 9, title: "Juices", slug: "juices" },
];

const Menu = () => {
  const { addToCart, removeFromCart, getQuantity } = useContext(CartContext);
  const { searchQuery } = useContext(SearchContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(280);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/product/list`);
        if (res.data.success) setProducts(res.data.products);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch live USD → PKR rate
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await axios.get("https://open.er-api.com/v6/latest/USD");
        if (res.data?.rates?.PKR) setExchangeRate(res.data.rates.PKR);
      } catch (err) {
        console.error("Failed to fetch exchange rate:", err);
      }
    };
    fetchRate();
  }, []);

  // Filter products by category & search
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === "all" ||
      p.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const visibleProducts = showAll ? filteredProducts : filteredProducts.slice(0, 8);

  if (loading)
    return <div className="text-center py-20 text-gray-500">Loading Menu...</div>;

  return (
    <section className="py-12 px-6 bg-gray-50 scroll-mt-24" id="menu">
  {/* Category Buttons */}
<div className="flex flex-wrap gap-4 justify-center mb-8">
  {categories.map((cat) => (
    <button
      key={cat.id}
      onClick={() => {
        setSelectedCategory(cat.slug);
        setShowAll(false); // reset "View More"
      }}
      className={`
        relative
        w-24 h-24 flex items-center justify-center
        rounded-full
        font-semibold text-sm
        transition-all duration-300
        shadow-md
        ${
          selectedCategory === cat.slug
            ? "bg-orange-400 text-white scale-110 shadow-lg"
            : "bg-gray-100 text-gray-700 hover:bg-orange-400 hover:text-white hover:scale-105  cursor-pointer"
        }
      `}
    >
      {cat.title}
    </button>
  ))}
</div>
      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {visibleProducts.map((item) => (
            <ProductCard
              key={item._id}
              product={item}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              getQuantity={getQuantity}
              exchangeRate={exchangeRate}
            />
          ))}
        </div>
      )}

      {/* View More Button */}
      {!showAll && filteredProducts.length > 8 && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setShowAll(true)}
            className="px-8 py-3  bg-orange-500 hover:bg-orange-600 text-white rounded-full font-medium transition"
          >
            View More
          </button>
        </div>
      )}
    </section>
  );
};

export default Menu;