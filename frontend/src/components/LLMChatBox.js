import React, { useState } from "react";
import axios from "axios";

export default function LLMChatBox() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message to list
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:5000/chat/ask", {
        question: input,
        language: "English",
      });

      // ✅ Make sure we only store the reply as plain text
      const replyText =
        typeof res.data.reply === "string"
          ? res.data.reply
          : JSON.stringify(res.data.reply);

      setMessages((prev) => [...prev, { sender: "bot", text: replyText }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error connecting to the server." },
      ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Messages Box */}
      <div className="h-96 overflow-y-auto bg-gray-50 p-4 rounded-lg border border-gray-300 mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${
              msg.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block px-3 py-2 rounded-lg ${
                msg.sender === "user"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
        {loading && (
          <div className="text-gray-500 italic text-left">Thinking...</div>
        )}
      </div>

      {/* Input Box */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border border-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Ask something..."
        />
        <button
          onClick={handleSend}
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
