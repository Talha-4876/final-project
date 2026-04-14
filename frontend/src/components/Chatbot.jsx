import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  FaPaperPlane,
  FaMicrophone,
  FaComment,
  FaTimes,
  FaSmile,
} from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [open, setOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Correct common typos
  const correctVoiceText = (text) => {
    text = text.toLowerCase().trim();
    const corrections = {
      piza: "pizza",
      barger: "burger",
      coke: "coca-cola",
      surprise: "sprite",
    };
    Object.keys(corrections).forEach((key) => {
      if (text.includes(key)) text = text.replace(key, corrections[key]);
    });
    return text;
  };

  // Mic toggle
  const toggleListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Browser does not support voice input");

    if (!listening) {
      // Start listening
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setListening(true);
      recognition.onend = () => setListening(false);

      recognition.onresult = (event) => {
        const text = correctVoiceText(event.results[0][0].transcript);
        sendMessage(text);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } else {
      // Stop listening
      recognitionRef.current?.stop();
      setListening(false);
    }
  };

  // Send message to backend
  const sendMessage = async (text) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { type: "user", text }]);
    setInput("");
    setShowEmojiPicker(false);

    try {
      const { data } = await axios.post(`${BACKEND_URL}/api/chat`, {
        message: correctVoiceText(text),
      });

      setMessages((prev) => [...prev, { type: "bot", text: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "Server error..." },
      ]);
    }
  };

  const onEmojiClick = (emojiData) =>
    setInput((prev) => prev + emojiData.emoji);

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-xl hover:scale-110 transition z-50"
        >
          <FaComment size={22} />
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 right-5 w-96 h-[560px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50">
          {/* HEADER */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 flex justify-between items-center">
            <div>
              <h2 className="font-bold text-lg">BiteBoss Bot 🤖</h2>
              <p className="text-xs opacity-80">Ask about menu</p>
            </div>
            <FaTimes
              onClick={() => setOpen(false)}
              className="cursor-pointer hover:scale-110 transition"
            />
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm shadow ${
                    m.type === "user" ? "bg-purple-600 text-white" : "bg-white"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {listening && (
              <div className="text-center text-red-500 text-sm animate-pulse">
                🎤 Listening...
              </div>
            )}

            <div ref={messagesEndRef}></div>
          </div>

          {/* INPUT + CONTROLS */}
          <div className="border-t p-3 bg-white">
            {showEmojiPicker && (
              <div className="mb-2 max-h-40 overflow-auto">
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type message..."
                className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />

              <button
                onClick={() => setShowEmojiPicker((p) => !p)}
                className="p-2 bg-yellow-300 rounded-full"
              >
                <FaSmile />
              </button>

              <button
                onClick={() => sendMessage(input)}
                className="bg-purple-600 text-white p-2 rounded-full"
              >
                <FaPaperPlane />
              </button>

              {/* 🎤 MIC */}
              <button
                onClick={toggleListening}
                className={`p-2 rounded-full text-white ${
                  listening ? "bg-red-500" : "bg-purple-500"
                }`}
              >
                <FaMicrophone />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;