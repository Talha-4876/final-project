import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import upload_image from "../assets/upload1.jpeg";
import { backendUrl } from "../config";

const AddMenu = () => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(""); // PKR directly
  const [category, setCategory] = useState("Fast Food");
  const [loading, setLoading] = useState(false);

  const categories = ["Fast Food","Desi Food","Nashta","Lunch","Dinner","Cold Drinks","Coffee"];
  const token = localStorage.getItem("adminToken");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return toast.error("You must be logged in as admin!");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", parseFloat(price)); // PKR
      formData.append("category", category);
      if (image) formData.append("image", image);

      const res = await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Product added successfully!");
        setName(""); setDescription(""); setPrice(""); setCategory("Fast Food"); setImage(null);
      } else toast.error(res.data.message);
    } catch (err) {
      console.error("Add product error:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 py-10">
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-6 sm:p-8 space-y-5">
        <h2 className="text-xl sm:text-2xl font-semibold text-center text-orange-500">Add New Menu Item</h2>

        {/* Image Upload */}
        <div className="flex flex-col items-center">
          <p className="text-gray-600 font-medium mb-2">Upload Image</p>
          <label htmlFor="image" className="cursor-pointer">
            <img src={image ? URL.createObjectURL(image) : upload_image} alt="upload" className="w-32 h-32 sm:w-36 sm:h-36 object-cover rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-400 transition"/>
          </label>
          <input type="file" id="image" hidden accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        </div>

        {/* Product Name */}
        <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} required
          className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-400"/>

        {/* Description */}
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg w-full resize-none focus:outline-none focus:ring-2 focus:ring-orange-400" rows="3"/>

        {/* Category + Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <input type="number" placeholder="Price (PKR)" value={price} onChange={(e) => setPrice(e.target.value)} required
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"/>
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 transition text-white py-3 rounded-lg w-full font-medium">
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddMenu;