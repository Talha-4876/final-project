import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../config";
import { toast } from "react-hot-toast";
import { Trash2, PlusCircle } from "lucide-react";

const AddTable = () => {
  const [form, setForm] = useState({ tableNumber: "", seats: "", label: "" });
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchTables = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/tables/all`);
      if (res.data.success) setTables(res.data.tables);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchTables(); }, []);

  const handleAdd = async () => {
    if (!form.tableNumber || !form.seats) return toast.error("Fill required fields");
    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/tables/add`, {
        tableNumber: Number(form.tableNumber),
        seats: Number(form.seats),
        label: form.label,
      });
      if (res.data.success) {
        toast.success("Table added!");
        setForm({ tableNumber: "", seats: "", label: "" });
        fetchTables();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Failed to add table");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`${backendUrl}/api/tables/delete/${id}`);
      toast.success("Deleted");
      fetchTables();
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const seatColor = (seats) => {
    if (seats <= 2) return { bg: "#eff6ff", color: "#1d4ed8" };
    if (seats <= 4) return { bg: "#f0fdf4", color: "#15803d" };
    if (seats <= 6) return { bg: "#fff7ed", color: "#c2410c" };
    return { bg: "#fdf4ff", color: "#7e22ce" };
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7f4", padding: "2rem", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .tbl-input {
          width: 100%;
          padding: 10px 13px;
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
        .tbl-input:focus { border-color: #aaa; }
        .tbl-input::placeholder { color: #ccc; }

        .field-label {
          display: block;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: #aaa;
          margin-bottom: 6px;
        }

        .add-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 10px 20px;
          border-radius: 10px;
          border: none;
          background: #1a1a1a;
          color: #fff;
          font-size: 13.5px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.15s;
        }
        .add-btn:hover:not(:disabled) { background: #333; transform: translateY(-1px); }
        .add-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        .del-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid #fecdd3;
          background: #fff1f2;
          color: #be123c;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .del-btn:hover { background: #ffe4e6; transform: translateY(-1px); }
        .del-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .table-card {
          background: #fff;
          border: 1.5px solid #ede9e3;
          border-radius: 14px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          transition: box-shadow 0.15s;
        }
        .table-card:hover { border-color: #d9d6d0; }

        .table-num-badge {
          width: 42px;
          height: 42px;
          border-radius: 11px;
          background: #1a1a1a;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Mono', monospace;
          flex-shrink: 0;
        }

        .seat-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 10px;
          border-radius: 99px;
          font-size: 11.5px;
          font-weight: 500;
        }

        .label-chip {
          display: inline-block;
          padding: 2px 9px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 500;
          background: #fff7ed;
          color: #c2410c;
          margin-left: 6px;
        }

        .stats-card {
          background: #fff;
          border: 1.5px solid #ede9e3;
          border-radius: 12px;
          padding: 14px 18px;
        }

        .divider { border: none; border-top: 1.5px solid #f0ede8; margin: 0; }

        .tables-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
      `}</style>

      {/* PAGE HEADER */}
      <div style={{ marginBottom: "2rem" }}>
        <p style={{ margin: 0, fontSize: "22px", fontWeight: 600, color: "#1a1a1a", letterSpacing: "-0.03em" }}>Manage Tables</p>
        <p style={{ margin: "3px 0 0", fontSize: "13px", color: "#aaa" }}>Add, label, and remove restaurant tables</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", maxWidth: "860px" }}>

        {/* LEFT — ADD FORM + STATS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* STATS ROW */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div className="stats-card">
              <p style={{ margin: 0, fontSize: "11px", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "#aaa" }}>Total Tables</p>
              <p style={{ margin: "4px 0 0", fontSize: "24px", fontWeight: 600, color: "#1a1a1a", fontFamily: "'DM Mono', monospace", letterSpacing: "-0.04em" }}>{tables.length}</p>
            </div>
            <div className="stats-card">
              <p style={{ margin: 0, fontSize: "11px", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "#aaa" }}>Total Seats</p>
              <p style={{ margin: "4px 0 0", fontSize: "24px", fontWeight: 600, color: "#1a1a1a", fontFamily: "'DM Mono', monospace", letterSpacing: "-0.04em" }}>
                {tables.reduce((acc, t) => acc + (Number(t.seats) || 0), 0)}
              </p>
            </div>
          </div>

          {/* ADD FORM */}
          <div style={{ background: "#fff", border: "1.5px solid #ede9e3", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#1a1a1a" }}>Add New Table</p>
              <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#bbb" }}>Fill in the details below</p>
            </div>

            <hr className="divider" />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label className="field-label">Table No. *</label>
                <input
                  type="number"
                  className="tbl-input"
                  placeholder="e.g. 1"
                  value={form.tableNumber}
                  onChange={(e) => setForm({ ...form, tableNumber: e.target.value })}
                />
              </div>
              <div>
                <label className="field-label">Seats *</label>
                <input
                  type="number"
                  className="tbl-input"
                  placeholder="e.g. 4"
                  value={form.seats}
                  onChange={(e) => setForm({ ...form, seats: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="field-label">Label <span style={{ color: "#ccc", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
              <input
                type="text"
                className="tbl-input"
                placeholder="e.g. VIP, Window, Rooftop..."
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
              />
            </div>

            <button className="add-btn" onClick={handleAdd} disabled={loading}>
              <PlusCircle size={15} />
              {loading ? "Adding table..." : "Add Table"}
            </button>
          </div>
        </div>

        {/* RIGHT — TABLES LIST */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#1a1a1a" }}>All Tables</p>
            {tables.length > 0 && (
              <span style={{ fontSize: "11.5px", color: "#bbb" }}>{tables.length} total</span>
            )}
          </div>

          <div className="tables-grid">
            {tables.length === 0 ? (
              <div style={{ background: "#fff", border: "1.5px solid #ede9e3", borderRadius: "14px", padding: "40px 20px", textAlign: "center" }}>
                <p style={{ fontSize: "28px", opacity: 0.25, margin: "0 0 8px" }}>🪑</p>
                <p style={{ margin: 0, fontSize: "13px", fontWeight: 500, color: "#bbb" }}>No tables added yet</p>
                <p style={{ margin: "3px 0 0", fontSize: "11.5px", color: "#ccc" }}>Add your first table on the left</p>
              </div>
            ) : tables.map((t) => {
              const sc = seatColor(t.seats);
              return (
                <div key={t._id} className="table-card">
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
                    <div className="table-num-badge">{t.tableNumber}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "2px" }}>
                        <p style={{ margin: 0, fontSize: "13.5px", fontWeight: 600, color: "#1a1a1a" }}>Table {t.tableNumber}</p>
                        {t.label && <span className="label-chip">{t.label}</span>}
                      </div>
                      <div style={{ marginTop: "5px" }}>
                        <span className="seat-badge" style={{ background: sc.bg, color: sc.color }}>
                          <span style={{ display: "inline-block", width: "5px", height: "5px", borderRadius: "50%", background: sc.color }}></span>
                          {t.seats} seats
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    className="del-btn"
                    onClick={() => handleDelete(t._id)}
                    disabled={deletingId === t._id}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTable;