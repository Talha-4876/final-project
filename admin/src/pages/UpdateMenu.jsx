// frontend/src/pages/UpdateMenu.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import upload_image from "../assets/upload1.jpeg";
import { backendUrl } from "../config";
import { useParams, useNavigate } from "react-router-dom";

const UpdateMenu = () => {
  const { id } = useParams(); // product ID from URL
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState(""); // current image
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [pricePkr, setPricePkr] = useState(0);
  const [category, setCategory] = useState("Fast Food");
  const [loading, setLoading] = useState(false);

  const categories = [
    "Fast Food",
    "Desi Food",
    "Nashta",
    "Lunch",
    "Dinner",
    "Cold Drinks",
    "Coffee",
  ];

  // ✅ Fetch existing product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/product/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success && res.data.product) {
          const p = res.data.product;
          setName(p.name);
          setDescription(p.description || "");
          setPrice(p.price);
          setCategory(p.category);
          setExistingImage(p.image);
          // convert USD → PKR
          const rateRes = await axios.get("https://open.er-api.com/v6/latest/USD");
          const rate = rateRes.data?.rates?.PKR || 280;
          setPricePkr(Math.round(p.price * rate));
        } else {
          toast.error("Failed to load product");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch product data");
      }
    };
    if (id) fetchProduct();
  }, [id, token]);

  // ✅ Convert USD → PKR live on price change
  const handlePriceChange = async (e) => {
    const usdPrice = Number(e.target.value);
    setPrice(usdPrice);

    try {
      const res = await axios.get("https://open.er-api.com/v6/latest/USD");
      const rate = res.data?.rates?.PKR || 280;
      setPricePkr(Math.round(usdPrice * rate));
    } catch (err) {
      setPricePkr(Math.round(usdPrice * 280));
    }
  };

  // ✅ Update product
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return toast.error("You must be logged in as admin!");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", parseFloat(price));
      formData.append("category", category);
      if (image) formData.append("image", image);

      const res = await axios.put(`${backendUrl}/api/product/update/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success(`Product updated successfully! PKR ≈ ${pricePkr}`);
        navigate("/admin/list"); // redirect to list
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-6 sm:p-8 space-y-5"
      >
        <h2 className="text-xl sm:text-2xl font-semibold text-center text-orange-500">
          Update Menu Item
        </h2>

        {/* Image Upload */}
        <div className="flex flex-col items-center">
          <p className="text-gray-600 font-medium mb-2">Upload Image</p>
          <label htmlFor="image" className="cursor-pointer">
            <img
              src={image ? URL.createObjectURL(image) : existingImage || upload_image}
              alt="upload"
              className="w-32 h-32 sm:w-36 sm:h-36 object-cover rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-400 transition"
            />
          </label>
          <input
            type="file"
            id="image"
            hidden
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        {/* Product Name */}
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        />

        {/* Description */}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg w-full resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
          rows="3"
        />

        {/* Category + Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <div className="flex flex-col">
            <input
              type="number"
              placeholder="Price (USD)"
              value={price}
              onChange={handlePriceChange}
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
            <span className="text-gray-500 mt-1 text-sm">
              Approx Price in PKR: {pricePkr}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 transition text-white py-3 rounded-lg w-full font-medium"
        >
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default UpdateMenu;