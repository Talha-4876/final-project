import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const AdminInbox = () => {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    try {
      const res = await axios.get("http://localhost:3200/api/contact");
      setMessages(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load messages");
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = messages.filter((m) => !m.isRead).length;

  const openMessage = async (msg) => {
    setSelected(msg);
    try {
      if (!msg.isRead) {
        await axios.put(`http://localhost:3200/api/contact/${msg._id}/read`);
        fetchMessages();
      }
    } catch (err) {
      toast.error("Failed to mark as read");
    }
  };

  const deleteMsg = async (id) => {
    try {
      await axios.delete(`http://localhost:3200/api/contact/${id}`);
      toast.success("Message deleted");
      setSelected(null);
      fetchMessages();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const sendReply = async () => {
    if (!selected) return toast.error("Select a message first");
    if (!reply.trim()) return toast.error("Reply cannot be empty");
    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:3200/api/contact/${selected._id}/reply`,
        { replyMessage: reply }
      );
      if (res.data.success) {
        toast.success("Email sent successfully");
        setReply("");
      } else {
        toast.error("Failed to send reply");
      }
    } catch (err) {
      console.log(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "?";

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans', sans-serif", background: "#f8f7f4", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .msg-item {
          padding: 14px 16px;
          cursor: pointer;
          border-bottom: 1px solid #f0ede8;
          transition: background 0.12s;
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }
        .msg-item:hover { background: #faf9f7; }
        .msg-item.active { background: #f5f4f1; }
        .msg-item.unread { background: #fffbf5; }

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          color: #fff;
          flex-shrink: 0;
        }

        .reply-textarea {
          width: 100%;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1.5px solid #e2e0db;
          background: #fff;
          font-size: 13.5px;
          font-family: 'DM Sans', sans-serif;
          color: #1a1a1a;
          outline: none;
          resize: none;
          transition: border 0.15s;
          box-sizing: border-box;
          line-height: 1.6;
        }
        .reply-textarea:focus { border-color: #aaa; }
        .reply-textarea::placeholder { color: #bbb; }

        .send-btn {
          padding: 9px 20px;
          border-radius: 10px;
          border: none;
          background: #1a1a1a;
          color: #fff;
          font-size: 13px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.15s;
        }
        .send-btn:hover:not(:disabled) { background: #333; transform: translateY(-1px); }
        .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .del-btn {
          padding: 7px 16px;
          border-radius: 9px;
          border: 1px solid #fecdd3;
          background: #fff1f2;
          color: #be123c;
          font-size: 12.5px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.15s;
        }
        .del-btn:hover { background: #ffe4e6; transform: translateY(-1px); }

        .unread-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #f97316;
          flex-shrink: 0;
          margin-top: 6px;
        }

        .inbox-scrollbar { overflow-y: auto; }
        .inbox-scrollbar::-webkit-scrollbar { width: 4px; }
        .inbox-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .inbox-scrollbar::-webkit-scrollbar-thumb { background: #e2e0db; border-radius: 99px; }

        .badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 18px;
          height: 18px;
          border-radius: 99px;
          background: #f97316;
          color: #fff;
          font-size: 10px;
          font-weight: 600;
          padding: 0 5px;
        }
      `}</style>

      <Toaster position="top-right" toastOptions={{ style: { fontFamily: "'DM Sans', sans-serif", fontSize: "13px" } }} />

      {/* SIDEBAR */}
      <div style={{ width: "64px", background: "#1a1a1a", display: "flex", flexDirection: "column", alignItems: "center", padding: "1.5rem 0", gap: "8px", flexShrink: 0 }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#333", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
          <span style={{ fontSize: "16px" }}>✦</span>
        </div>
        <div style={{ position: "relative", width: "40px", height: "40px", borderRadius: "10px", background: "#2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <span style={{ fontSize: "16px" }}>✉</span>
          {unreadCount > 0 && (
            <span style={{ position: "absolute", top: "-4px", right: "-4px" }} className="badge">{unreadCount}</span>
          )}
        </div>
      </div>

      {/* MESSAGE LIST */}
      <div style={{ width: "300px", background: "#fff", borderRight: "1.5px solid #ede9e3", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        {/* List Header */}
        <div style={{ padding: "18px 16px 14px", borderBottom: "1.5px solid #f0ede8" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: "#1a1a1a", letterSpacing: "-0.02em" }}>Inbox</p>
            {unreadCount > 0 && (
              <span style={{ fontSize: "11px", background: "#fff7ed", color: "#c2410c", padding: "2px 8px", borderRadius: "99px", fontWeight: 500 }}>
                {unreadCount} unread
              </span>
            )}
          </div>
          <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#bbb" }}>{messages.length} messages</p>
        </div>

        {/* Messages */}
        <div className="inbox-scrollbar" style={{ flex: 1 }}>
          {messages.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center" }}>
              <p style={{ fontSize: "28px", opacity: 0.3, margin: "0 0 8px" }}>✉</p>
              <p style={{ margin: 0, fontSize: "13px", color: "#bbb" }}>No messages yet</p>
            </div>
          ) : messages.map((msg, i) => {
            const colors = ["#e76f51","#2a9d8f","#457b9d","#8338ec","#e63946"];
            const color = colors[i % colors.length];
            const isActive = selected?._id === msg._id;

            return (
              <div
                key={msg._id}
                onClick={() => openMessage(msg)}
                className={`msg-item ${isActive ? "active" : ""} ${!msg.isRead ? "unread" : ""}`}
              >
                <div className="avatar" style={{ background: color }}>{getInitials(msg.name)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}>
                    <p style={{ margin: 0, fontSize: "13px", fontWeight: msg.isRead ? 500 : 600, color: "#1a1a1a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{msg.name}</p>
                    <p style={{ margin: 0, fontSize: "10.5px", color: "#bbb", flexShrink: 0 }}>{formatTime(msg.createdAt)}</p>
                  </div>
                  <p style={{ margin: "2px 0 0", fontSize: "11.5px", color: "#999", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{msg.email}</p>
                  <p style={{ margin: "3px 0 0", fontSize: "12px", color: "#bbb", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{msg.message}</p>
                </div>
                {!msg.isRead && <div className="unread-dot" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* MESSAGE VIEW */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {selected ? (
          <>
            {/* View Header */}
            <div style={{ padding: "18px 24px", borderBottom: "1.5px solid #ede9e3", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div className="avatar" style={{ width: "40px", height: "40px", fontSize: "13px", background: "#e76f51" }}>{getInitials(selected.name)}</div>
                <div>
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#1a1a1a" }}>{selected.name}</p>
                  <p style={{ margin: "1px 0 0", fontSize: "12px", color: "#999" }}>{selected.email}</p>
                </div>
              </div>
              <button className="del-btn" onClick={() => deleteMsg(selected._id)}>✕ Delete</button>
            </div>

            {/* Message Body */}
            <div className="inbox-scrollbar" style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
              <div style={{
                background: "#fff",
                border: "1.5px solid #ede9e3",
                borderRadius: "14px",
                padding: "20px",
                maxWidth: "620px",
              }}>
                <p style={{ margin: "0 0 12px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "#bbb" }}>Message</p>
                <p style={{ margin: 0, fontSize: "14px", color: "#333", lineHeight: 1.75 }}>{selected.message}</p>
              </div>

              {/* Reply Box */}
              <div style={{ maxWidth: "620px", marginTop: "20px" }}>
                <div style={{
                  background: "#fff",
                  border: "1.5px solid #e2e0db",
                  borderRadius: "14px",
                  overflow: "hidden",
                }}>
                  <div style={{ padding: "10px 14px 0", borderBottom: "1px solid #f0ede8" }}>
                    <p style={{ margin: "0 0 8px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "#bbb" }}>
                      Reply to {selected.email}
                    </p>
                  </div>
                  <textarea
                    className="reply-textarea"
                    style={{ border: "none", borderRadius: 0, borderBottom: "1px solid #f0ede8" }}
                    placeholder="Write your reply here..."
                    rows="5"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                  />
                  <div style={{ padding: "10px 14px", display: "flex", justifyContent: "flex-end" }}>
                    <button className="send-btn" onClick={sendReply} disabled={loading}>
                      {loading ? "Sending..." : "Send Reply ↗"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <p style={{ fontSize: "40px", opacity: 0.2, margin: 0 }}>✉</p>
            <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: "#bbb" }}>Select a message to read</p>
            <p style={{ margin: 0, fontSize: "12px", color: "#ccc" }}>Choose from the inbox on the left</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInbox;