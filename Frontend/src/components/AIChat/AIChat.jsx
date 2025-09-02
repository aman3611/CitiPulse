import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Loader2, MessageSquareText, X } from "lucide-react";

const defaultSuggestions = [
  "What is Citipulse?",
  "How do I report an issue?",
  "Can I track my complaint?",
  "Who reviews submitted complaints?",
  "How can I edit my profile?",
];

const AIChat = () => {
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Typing effect function
  const typeMessage = async (text, tempId) => {
    let current = "";
    for (let i = 0; i < text.length; i++) {
      current += text[i];
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...m, content: current } : m))
      );
      await new Promise((r) => setTimeout(r, 15)); // adjust speed here
    }
  };

  const handleSend = async (customMessage = null) => {
    const userText = customMessage || msg;
    if (!userText.trim()) return;

    const userMessage = { sender: "user", content: userText };
    setMessages((prev) => [...prev, userMessage]);
    setMsg("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_CITIPULSE_BACKEND_URL}/api/ask`,
        {
          message: userText,
        }
      );

      const aiText = res.data.reply;
      const tempId = Date.now();
      setMessages((prev) => [
        ...prev,
        { sender: "ai", content: "", id: tempId },
      ]);

      await typeMessage(aiText, tempId);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", content: "⚠️ Something went wrong." },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {!show ? (
        <button
          onClick={() => setShow(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all"
          title="Ask CitiPulse AI"
        >
          <MessageSquareText size={24} />
        </button>
      ) : (
        <div className="w-[350px] sm:w-[400px] h-[80vh] bg-white border border-gray-200 shadow-2xl rounded-xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-700">
              Ask CitiPulse AI
            </h2>
            <button
              onClick={() => setShow(false)}
              className="text-gray-500 hover:text-red-500"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-sm text-gray-600 space-y-2">
                <p className="mb-2 font-medium text-gray-700">Try asking:</p>
                {defaultSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(suggestion)}
                    className="block text-left w-full px-3 py-2 bg-white rounded-md shadow-sm border border-gray-200 hover:bg-gray-100 text-gray-800 text-sm transition"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`max-w-[85%] p-2 text-sm rounded-md whitespace-pre-wrap ${
                  m.sender === "user"
                    ? "ml-auto bg-blue-100 text-gray-900"
                    : "mr-auto bg-gray-200 text-gray-800"
                }`}
              >
                {m.content}
              </div>
            ))}

            {loading && (
              <div className="text-sm text-gray-500 animate-pulse">
                AI is typing...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-gray-200 bg-white">
            <textarea
              rows={2}
              placeholder="Type your CitiPulse question..."
              className="w-full border border-gray-300 p-2 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-1.5 text-sm font-medium rounded-md transition-all flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Sending...
                </>
              ) : (
                "Send"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChat;
