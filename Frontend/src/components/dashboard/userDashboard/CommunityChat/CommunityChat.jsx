import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../../Context/AuthContext";
import { toast } from "react-hot-toast";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_CITIPULSE_BACKEND_URL);

const CommunityChat = () => {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const chatEndRef = useRef(null);
  const { id } = useAuth();

  const fetchMessages = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_CITIPULSE_BACKEND_URL}/api/user/getMessage`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages(res.data.reverse());
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  useEffect(() => {
    fetchMessages();
    socket.on("receive_message", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const token = localStorage.getItem("token");
    if (!msg.trim()) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_CITIPULSE_BACKEND_URL}/api/user/sendMessage`,
        { msg },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const newMsg = res.data.data;
      socket.emit("send_message", newMsg);
      setMsg("");
    } catch (err) {
      toast.error("Failed to send message");
      console.error(err);
    }
  };

  return (
    <div className="max-w-[90%] mx-auto p-4 flex flex-col h-[80vh] rounded-lg shadow ">
      <h2 className="text-2xl font-bold mb-4 text-center">Community Chat</h2>

      <div className="flex-1 overflow-y-auto space-y-4 p-2">
        {messages.map((m, idx) => {
          const isOwnMessage = m.userId === id;

          return (
            <div
              key={idx}
              className={`flex gap-3 items-start ${
                isOwnMessage
                  ? "justify-start flex-row-reverse"
                  : "justify-start"
              }`}
            >
              <img
                src={
                  m.profilePic ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    m.user
                  )}&background=0D8ABC&color=fff`
                }
                alt="user"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div
                className={`px-4 py-2 rounded-lg max-w-[75%] ${
                  isOwnMessage ? " shadow text-right" : "shadow "
                }`}
              >
                {!isOwnMessage ? (
                  <div className="text-sm font-bold ">{m.user}</div>
                ) : (
                  <div className="text-sm font-bold">You</div>
                )}
                <div className="text-sm whitespace-pre-wrap">{m.msg}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(m.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      <div className="flex items-start gap-2 mt-4 border-t border-gray-700 pt-3">
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type a message... (Shift+Enter for new line)"
          className="flex-1 border p-2 rounded-lg outline-none resize-none h-10"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default CommunityChat;
