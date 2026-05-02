import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../config";

const AdminTable = () => {
  const [reservation, setReservation] = useState([]);
  const [filter, setFilter] = useState("all");

  const fetchReservation = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/reservations/all`);
      if (res.data.success) setReservation(res.data.reservations);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch reservations");
    }
  };

  useEffect(() => {
    fetchReservation();
  }, []);

  const filteredData = reservation.filter((r) => {
    if (filter === "paid") return r.isPaid;
    if (filter === "pending") return !r.isPaid;
    if (filter === "active") return r.status === "active";
    if (filter === "completed") return r.status === "completed";
    return true;
  });

  const markAsPaid = async (id) => {
    try {
      const res = await axios.put(`${backendUrl}/api/reservations/paid/${id}`);
      if (res.data.success) {
        toast.success("Marked as Paid");
        fetchReservation();
      }
    } catch (err) {
      toast.error("Failed");
    }
  };

  const markAsCompleted = async (id) => {
    try {
      const res = await axios.put(`${backendUrl}/api/reservations/complete/${id}`);
      if (res.data.success) {
        toast.success("Table free kar diya");
        fetchReservation();
      }
    } catch (err) {
      toast.error("Failed");
    }
  };

  const deleteRes = async (id) => {
    if (!window.confirm("Delete this reservation?")) return;
    try {
      const res = await axios.delete(
        `${backendUrl}/api/reservations/delete/${id}`
      );
      if (res.data.success) {
        toast.success("Deleted");
        fetchReservation();
      }
    } catch (err) {
      toast.error("Failed");
    }
  };

  const filters = ["all", "active", "completed", "paid", "pending"];

  const filterIcons = {
    all: "⊞",
    active: "●",
    completed: "✓",
    paid: "₨",
    pending: "◷",
  };

  const filterCount = (f) => {
    if (f === "all") return reservation.length;
    if (f === "paid") return reservation.filter((r) => r.isPaid).length;
    if (f === "pending") return reservation.filter((r) => !r.isPaid).length;
    if (f === "active") return reservation.filter((r) => r.status === "active").length;
    if (f === "completed") return reservation.filter((r) => r.status === "completed").length;
    return 0;
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "#f8f7f4" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .admin-filter-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 16px;
          border-radius: 99px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border: 1.5px solid transparent;
          transition: all 0.18s ease;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.01em;
        }
        .admin-filter-btn:hover { transform: translateY(-1px); }
        .admin-filter-btn.active {
          background: #1a1a1a;
          color: #fff;
          border-color: #1a1a1a;
        }
        .admin-filter-btn.inactive {
          background: #fff;
          color: #555;
          border-color: #e2e0db;
        }
        .admin-filter-btn.inactive:hover {
          border-color: #bbb;
          color: #222;
        }
        .filter-count {
          background: #f0ede8;
          color: #888;
          border-radius: 99px;
          padding: 1px 7px;
          font-size: 11px;
          font-weight: 600;
        }
        .admin-filter-btn.active .filter-count {
          background: rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.85);
        }

        .res-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13.5px;
        }
        .res-table thead th {
          padding: 13px 16px;
          text-align: left;
          font-weight: 600;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #999;
          background: #f8f7f4;
          border-bottom: 1.5px solid #ede9e3;
        }
        .res-table tbody tr {
          border-bottom: 1px solid #f0ede8;
          transition: background 0.12s;
        }
        .res-table tbody tr:hover { background: #faf9f7; }
        .res-table tbody td { padding: 14px 16px; vertical-align: middle; }

        .user-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f4a261, #e76f51);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          flex-shrink: 0;
          letter-spacing: -0.02em;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 10px;
          border-radius: 99px;
          font-size: 11.5px;
          font-weight: 500;
          letter-spacing: 0.01em;
        }
        .badge-paid { background: #dcfce7; color: #15803d; }
        .badge-pending { background: #fff7ed; color: #c2410c; }
        .badge-active { background: #eff6ff; color: #1d4ed8; }
        .badge-completed { background: #f3f4f6; color: #6b7280; }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          display: inline-block;
        }
        .dot-paid { background: #22c55e; }
        .dot-pending { background: #f97316; }
        .dot-active { background: #3b82f6; }
        .dot-completed { background: #9ca3af; }

        .action-btn {
          padding: 5px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.15s;
          font-family: 'DM Sans', sans-serif;
          width: 100%;
          text-align: center;
        }
        .action-btn:hover { transform: translateY(-1px); }
        .btn-pay { background: #f0fdf4; color: #166534; border-color: #bbf7d0; }
        .btn-pay:hover { background: #dcfce7; }
        .btn-complete { background: #eff6ff; color: #1e40af; border-color: #bfdbfe; }
        .btn-complete:hover { background: #dbeafe; }
        .btn-delete { background: #fff1f2; color: #be123c; border-color: #fecdd3; }
        .btn-delete:hover { background: #ffe4e6; }

        .amount-cell {
          font-family: 'DM Mono', monospace;
          font-size: 13.5px;
          font-weight: 500;
          color: #1a1a1a;
        }

        .table-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: #1a1a1a;
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 3px;
        }

        .empty-state {
          padding: 60px 20px;
          text-align: center;
          color: #aaa;
        }
        .empty-icon {
          font-size: 36px;
          margin-bottom: 10px;
          opacity: 0.4;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }
        .section-title {
          font-size: 22px;
          font-weight: 600;
          color: #1a1a1a;
          letter-spacing: -0.03em;
        }
        .section-sub {
          font-size: 13px;
          color: #999;
          margin-top: 2px;
        }
        .refresh-btn {
          padding: 8px 14px;
          border-radius: 10px;
          border: 1.5px solid #e2e0db;
          background: #fff;
          color: #555;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.15s;
        }
        .refresh-btn:hover { border-color: #bbb; color: #222; }
      `}</style>

      {/* HEADER */}
      <div className="section-header">
        <div>
          <h1 className="section-title">Reservations</h1>
          <p className="section-sub">{reservation.length} total bookings</p>
        </div>
        <button className="refresh-btn" onClick={fetchReservation}>
          ↻ Refresh
        </button>
      </div>

      {/* FILTERS */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "1.5rem" }}>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`admin-filter-btn ${filter === f ? "active" : "inactive"}`}
          >
            <span>{filterIcons[f]}</span>
            <span style={{ textTransform: "capitalize" }}>{f}</span>
            <span className="filter-count">{filterCount(f)}</span>
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div style={{
        background: "#fff",
        borderRadius: "16px",
        border: "1.5px solid #ede9e3",
        overflow: "hidden",
        overflowX: "auto",
      }}>
        <table className="res-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Booking</th>
              <th>Table</th>
              <th>Payment</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((r) => {
              const initials = r.user?.name
                ? r.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
                : "?";

              return (
                <tr key={r._id}>
                  {/* USER */}
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div className="user-avatar">{initials}</div>
                      <div>
                        <p style={{ fontWeight: 600, color: "#1a1a1a", margin: 0, fontSize: "13.5px" }}>{r.user?.name}</p>
                        <p style={{ color: "#999", margin: "2px 0 0", fontSize: "11.5px" }}>{r.user?.email}</p>
                        {r.user?.phone && (
                          <p style={{ color: "#bbb", margin: "1px 0 0", fontSize: "11px" }}>{r.user?.phone}</p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* BOOKING DATE/TIME */}
                  <td>
                    <p style={{ fontWeight: 500, color: "#1a1a1a", margin: 0 }}>{r.table?.date}</p>
                    <p style={{ color: "#999", margin: "3px 0 0", fontSize: "12px" }}>{r.table?.time}</p>
                  </td>

                  {/* TABLE INFO */}
                  <td>
                    <div className="table-number">{r.table?.tableNumber}</div>
                    <p style={{ color: "#888", margin: "3px 0 0", fontSize: "12px" }}>{r.table?.seats} seats</p>
                    {r.table?.label && (
                      <span style={{
                        fontSize: "11px",
                        color: "#e76f51",
                        fontWeight: 500,
                        background: "#fff4f0",
                        padding: "2px 7px",
                        borderRadius: "99px",
                        display: "inline-block",
                        marginTop: "3px",
                      }}>{r.table.label}</span>
                    )}
                  </td>

                  {/* PAYMENT METHOD */}
                  <td>
                    <span style={{
                      background: "#f5f4f1",
                      color: "#555",
                      padding: "4px 10px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: 500,
                      textTransform: "capitalize",
                    }}>{r.paymentMethod}</span>
                  </td>

                  {/* AMOUNT */}
                  <td className="amount-cell">Rs. {r.totalAmount}</td>

                  {/* STATUS */}
                  <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      <span className={`badge ${r.isPaid ? "badge-paid" : "badge-pending"}`}>
                        <span className={`dot ${r.isPaid ? "dot-paid" : "dot-pending"}`}></span>
                        {r.isPaid ? "Paid" : "Pending"}
                      </span>
                      <span className={`badge ${r.status === "completed" ? "badge-completed" : "badge-active"}`}>
                        <span className={`dot ${r.status === "completed" ? "dot-completed" : "dot-active"}`}></span>
                        {r.status === "completed" ? "Completed" : "Active"}
                      </span>
                    </div>
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px", minWidth: "100px" }}>
                      {!r.isPaid && (
                        <button className="action-btn btn-pay" onClick={() => markAsPaid(r._id)}>
                          ✓ Mark Paid
                        </button>
                      )}
                      {r.status === "active" && (
                        <button className="action-btn btn-complete" onClick={() => markAsCompleted(r._id)}>
                          ◎ Complete
                        </button>
                      )}
                      <button className="action-btn btn-delete" onClick={() => deleteRes(r._id)}>
                        ✕ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {filteredData.length === 0 && (
              <tr>
                <td colSpan="7">
                  <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <p style={{ margin: 0, fontWeight: 500, color: "#888" }}>No reservations found</p>
                    <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#bbb" }}>Try a different filter</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTable;