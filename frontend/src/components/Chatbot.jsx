// frontend/src/components/Chatbot.jsx
import React, { useState, useRef, useEffect } from "react";
import { FaTimes, FaComment, FaPaperPlane, FaSmile, FaPaperclip, FaMicrophone } from "react-icons/fa";
import Picker from "emoji-picker-react";
import { createPortal } from "react-dom";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Hello! I'm your restaurant assistant 🤖", sender: "bot" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);

  const messagesEndRef = useRef(null);
  const chatWindowRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Handle sending a message
  const handleSend = async () => {
    const messageText = typeof input === "string" ? input.trim() : "";

    if (!messageText && !attachedFile) return;

    let userMessageText = messageText;
    if (attachedFile) userMessageText += ` [File: ${attachedFile.name}]`;

    const userMessage = { text: userMessageText, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setAttachedFile(null);
    setLoading(true);
    setShowEmojiPicker(false);

    try {
      // Format messages for backend
      const chatMessages = [...messages, userMessage].map((m) => ({
        role: m.sender === "bot" ? "assistant" : "user",
        content: m.text,
      }));

      const formData = new FormData();
      formData.append("messages", JSON.stringify(chatMessages));
      if (attachedFile) formData.append("file", attachedFile);

      const response = await fetch("http://localhost:3200/api/chat", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [...prev, { text: data.message, sender: "bot" }]);
      } else {
        setMessages((prev) => [...prev, { text: "Oops! Something went wrong.", sender: "bot" }]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { text: "Oops! Something went wrong.", sender: "bot" }]);
    } finally {
      setLoading(false);
    }
  };

  // Emoji click handler
  const handleEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
  };

  // File input handler
  const handleFileChange = (e) => {
    setAttachedFile(e.target.files[0]);
  };

  // Voice recognition start
  const startVoice = () => {
    if (!("webkitSpeechRecognition" in window)) return alert("Speech Recognition not supported");

    if (!recognitionRef.current) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        setInput(event.results[0][0].transcript);
      };

      recognitionRef.current.onend = () => {
        recognitionRef.current = null; // reset recognition
      };
    }

    try {
      recognitionRef.current.start();
    } catch (err) {
      console.warn("Voice recognition already started");
    }
  };

  return (
    <div>
      {/* Floating Chat button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: "fixed",
            bottom: "25px",
            right: "25px",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: "#4caf50",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            zIndex: 1000,
          }}
        >
          <FaComment />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div
          ref={chatWindowRef}
          style={{
            position: "fixed",
            bottom: "25px",
            right: "25px",
            width: "350px",
            maxHeight: "500px",
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            fontFamily: "Arial, sans-serif",
            zIndex: 1000,
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "#4caf50",
              color: "#fff",
              padding: "12px 15px",
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Restaurant Bot</span>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: "none", border: "none", color: "#fff", fontSize: "18px", cursor: "pointer" }}
            >
              <FaTimes />
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
              backgroundColor: "#f9f9f9",
            }}
          >
            {messages.map((msg, i) => (
              <div key={i} style={{ textAlign: msg.sender === "bot" ? "left" : "right", margin: "6px 0" }}>
                <span
                  style={{
                    display: "inline-block",
                    backgroundColor: msg.sender === "bot" ? "#ececec" : "#4caf50",
                    color: msg.sender === "bot" ? "#000" : "#fff",
                    padding: "8px 14px",
                    borderRadius: "20px",
                    maxWidth: "80%",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            {loading && <p style={{ color: "#888", marginTop: "5px" }}>Bot is typing...</p>}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{ borderTop: "1px solid #ddd", padding: "8px", display: "flex", alignItems: "center", gap: "5px" }}>
            <button
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer" }}
            >
              <FaSmile />
            </button>

            {/* Emoji Picker Portal */}
            {showEmojiPicker &&
              createPortal(
                <div
                  style={{
                    position: "fixed",
                    bottom: "80px",
                    right: "25px",
                    zIndex: 2000,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  }}
                >
                  <Picker onEmojiClick={handleEmojiClick} />
                </div>,
                document.body
              )}

            {/* File Upload */}
            <label htmlFor="fileUpload" style={{ fontSize: "20px", cursor: "pointer" }}>
              <FaPaperclip />
            </label>
            <input type="file" id="fileUpload" onChange={handleFileChange} style={{ display: "none" }} />

            {/* Text Input */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              style={{
                flex: 1,
                border: "1px solid #ccc",
                borderRadius: "20px",
                padding: "8px 12px",
                outline: "none",
              }}
            />

            {/* Voice Button */}
            <button
              onClick={startVoice}
              style={{
                backgroundColor: "#4caf50",
                border: "none",
                color: "#fff",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                marginRight: "5px",
              }}
            >
              <FaMicrophone />
            </button>

            {/* Send Button */}
            <button
              onClick={handleSend}
              style={{
                backgroundColor: "#4caf50",
                border: "none",
                color: "#fff",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;