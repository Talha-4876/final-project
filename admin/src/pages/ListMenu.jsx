// frontend/src/pages/ListMenu.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MdDeleteForever } from "react-icons/md";
import { backendUrl } from "../config";
import { useNavigate } from "react-router-dom"; // ✅ Added for navigation

const ListMenu = () => {
  const [list, setList] = useState([]);
  const token = localStorage.getItem("adminToken");
  const navigate = useNavigate(); // ✅ hook

  const fetchList = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/product/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setList(res.data.products);
      else toast.error(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch products");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await axios.delete(`${backendUrl}/api/product/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        toast.success("Product deleted successfully");
        fetchList();
      } else toast.error(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete product");
    }
  };

  useEffect(() => { if (token) fetchList(); }, [token]);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-extrabold mb-6">
        <span className="text-gray-800">🍔 Menu </span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500 animate-pulse">List</span>
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full rounded-xl shadow-lg border divide-y divide-black/20">
          <thead className="bg-gradient-to-r from-orange-400 to-pink-400 text-white">
            <tr>
              {["Image", "Name", "Category", "Price", "Actions"].map((h, i) => (
                <th key={i} className="py-3 px-4 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-black/20">
            {list.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">No items found</td>
              </tr>
            ) : list.map((item) => (
              <tr key={item._id} className="hover:bg-orange-50 transition transform hover:scale-[1.01]">
                <td className="py-2 px-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg shadow" />
                </td>
                <td className="py-2 px-4 font-medium">{item.name}</td>
                <td className="py-2 px-4">{item.category}</td>
                <td className="py-2 px-4 font-semibold text-orange-500">PKR {Math.round(item.price)}</td>
                <td className="py-2 px-4 flex gap-2 justify-center items-center">
                  {/* ✅ Delete button */}
                  <MdDeleteForever
                    onClick={() => deleteProduct(item._id)}
                    className="text-red-500 cursor-pointer hover:text-red-700 text-2xl"
                  />

                  {/* ✅ Edit button */}
                  <button
                    onClick={() => navigate(`/admin/update/${item._id}`)}
                    className="px-3 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm transition"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListMenu;