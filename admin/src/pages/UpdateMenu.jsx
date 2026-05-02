// frontend/src/pages/UpdateMenu.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import upload_image from "../assets/upload1.jpeg";
import { backendUrl } from "../config";
import { useParams, useNavigate } from "react-router-dom";

const UpdateMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [pricePkr, setPricePkr] = useState(0);
  const [category, setCategory] = useState("Fast Food");
  const [loading, setLoading] = useState(false);

  const categories = ["Fast Food","Desi Food","Nashta","Lunch","Dinner","Cold Drinks","Coffee"];

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
        navigate("/admin/list");
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
    <div style={{ minHeight: "100vh", background: "#f8f7f4", display: "flex", alignItems: "center", justifyContent: "center", padding: "2.5rem 1rem", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .upd-input, .upd-textarea, .upd-select {
          width: 100%;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1.5px solid #e2e0db;
          background: #fff;
          font-size: 13.5px;
          font-family: 'DM Sans', sans-serif;
          color: #1a1a1a;
          outline: none;
          transition: border 0.15s;
          box-sizing: border-box;
        }
        .upd-input:focus, .upd-textarea:focus, .upd-select:focus { border-color: #aaa; }
        .upd-input::placeholder, .upd-textarea::placeholder { color: #bbb; }
        .upd-textarea { resize: none; line-height: 1.6; }
        .upd-select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 36px;
        }

        .field-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 6px;
        }

        .upload-zone {
          width: 100%;
          border: 1.5px dashed #ddd;
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
          background: #fafaf9;
          gap: 8px;
          box-sizing: border-box;
        }
        .upload-zone:hover { border-color: #bbb; background: #f5f4f1; }

        .submit-btn {
          width: 100%;
          padding: 11px;
          border-radius: 10px;
          border: none;
          background: #1a1a1a;
          color: #fff;
          font-size: 14px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.15s;
          letter-spacing: 0.01em;
        }
        .submit-btn:hover:not(:disabled) { background: #333; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 12.5px;
          color: #999;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          padding: 0;
          margin-bottom: 1.25rem;
          transition: color 0.15s;
        }
        .back-btn:hover { color: #333; }

        .price-wrap { position: relative; }
        .price-prefix {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 12px;
          font-weight: 500;
          color: #aaa;
          font-family: 'DM Mono', monospace;
          pointer-events: none;
        }
        .price-input { padding-left: 46px !important; font-family: 'DM Mono', monospace !important; }

        .pkr-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-top: 7px;
          padding: 4px 10px;
          border-radius: 8px;
          background: #f5f4f1;
          font-size: 12px;
          font-family: 'DM Mono', monospace;
          color: #666;
          font-weight: 500;
        }
        .pkr-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #22c55e;
          display: inline-block;
        }
      `}</style>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          width: "100%",
          maxWidth: "480px",
          borderRadius: "20px",
          border: "1.5px solid #ede9e3",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}
      >
        {/* BACK */}
        <button type="button" className="back-btn" onClick={() => navigate("/admin/list")}>
          ← Back to list
        </button>

        {/* TITLE */}
        <div style={{ marginBottom: "0.25rem" }}>
          <p style={{ fontSize: "20px", fontWeight: 600, color: "#1a1a1a", letterSpacing: "-0.03em", margin: 0 }}>Update Menu Item</p>
          <p style={{ fontSize: "13px", color: "#aaa", margin: "3px 0 0" }}>Edit the details and save your changes</p>
        </div>

        {/* IMAGE UPLOAD */}
        <div>
          <label className="field-label">Item Image</label>
          <label htmlFor="image" className="upload-zone">
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                style={{ width: "90px", height: "90px", objectFit: "cover", borderRadius: "10px", border: "1px solid #ede9e3" }}
              />
            ) : existingImage ? (
              <>
                <img
                  src={existingImage}
                  alt="existing"
                  style={{ width: "90px", height: "90px", objectFit: "cover", borderRadius: "10px", border: "1px solid #ede9e3" }}
                />
                <p style={{ margin: 0, fontSize: "11.5px", color: "#bbb" }}>Click to change image</p>
              </>
            ) : (
              <>
                <img
                  src={upload_image}
                  alt="upload"
                  style={{ width: "52px", height: "52px", objectFit: "cover", borderRadius: "8px", opacity: 0.5 }}
                />
                <p style={{ margin: 0, fontSize: "12.5px", color: "#bbb", fontWeight: 500 }}>Click to upload image</p>
              </>
            )}
          </label>
          <input type="file" id="image" hidden accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        </div>

        {/* NAME */}
        <div>
          <label className="field-label">Product Name</label>
          <input
            type="text"
            className="upd-input"
            placeholder="e.g. Chicken Burger"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="field-label">Description</label>
          <textarea
            className="upd-textarea"
            placeholder="Brief description of the item..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
          />
        </div>

        {/* CATEGORY + PRICE */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div>
            <label className="field-label">Category</label>
            <select className="upd-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Price (USD)</label>
            <div className="price-wrap">
              <span className="price-prefix">$</span>
              <input
                type="number"
                className="upd-input price-input"
                placeholder="0.00"
                value={price}
                onChange={handlePriceChange}
                required
              />
            </div>
            {pricePkr > 0 && (
              <div className="pkr-badge">
                <span className="pkr-dot"></span>
                ≈ PKR {pricePkr.toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* DIVIDER */}
        <div style={{ borderTop: "1px solid #f0ede8" }} />

        {/* SUBMIT */}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Saving changes..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default UpdateMenu;