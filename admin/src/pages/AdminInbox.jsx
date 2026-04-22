import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const AdminInbox = () => {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  // 📩 FETCH MESSAGES
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

  // 📖 OPEN MESSAGE
  const openMessage = async (msg) => {
    setSelected(msg);

    try {
      if (!msg.isRead) {
        await axios.put(
          `http://localhost:3200/api/contact/${msg._id}/read`
        );
        fetchMessages();
      }
    } catch (err) {
      toast.error("Failed to mark as read");
    }
  };

  // 🗑 DELETE MESSAGE
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

  // 📧 SEND REPLY
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
        toast.success("Email sent successfully 📧");
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

  return (
    <div className="flex h-screen bg-gray-100">

      <Toaster />

      {/* 📌 SIDEBAR */}
      <div className="w-20 md:w-64 bg-white shadow-xl p-3">
        <h2 className="text-xl font-bold mb-4 hidden md:block">
          📩 Inbox
        </h2>

        <div className="relative">
          <button className="w-full p-3 bg-blue-500 text-white rounded-xl">
            Messages
          </button>

          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      {/* 📩 MESSAGE LIST */}
      <div className="w-1/3 bg-white border-r overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg._id}
            onClick={() => openMessage(msg)}
            className={`p-4 cursor-pointer border-b hover:bg-gray-100 transition ${
              msg.isRead ? "bg-white" : "bg-yellow-50 font-semibold"
            }`}
          >
            <h4 className="font-semibold">{msg.name}</h4>
            <p className="text-sm text-gray-500">{msg.email}</p>
            <p className="text-xs text-gray-400 truncate">
              {msg.message}
            </p>
          </div>
        ))}
      </div>

      {/* 📖 MESSAGE VIEW */}
      <div className="flex-1 p-6">
        {selected ? (
          <>
            <h2 className="text-2xl font-bold">{selected.name}</h2>
            <p className="text-gray-500">{selected.email}</p>

            <div className="mt-4 p-4 bg-gray-100 rounded-xl">
              {selected.message}
            </div>

            {/* 🗑 DELETE */}
            <button
              onClick={() => deleteMsg(selected._id)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>

            {/* ✍️ REPLY BOX */}
            <div className="mt-6">
              <textarea
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
                placeholder="Write reply like Gmail..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />

              <button
                onClick={sendReply}
                disabled={loading}
                className={`mt-3 px-5 py-2 rounded text-white ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {loading ? "Sending..." : "Send Reply 📧"}
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-400">Select a message 📩</p>
        )}
      </div>
    </div>
  );
};

export default AdminInbox;