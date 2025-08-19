import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { IconButton, Paper } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SendIcon from "@mui/icons-material/Send";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([
    {
      message: "👋 Hi! I'm your NutriPlan Assistant. How can I help you today?",
      sender: "AI",
      suggestions: [
        "Suggest a healthy breakfast",
        "How to track calories?",
        "Create a meal plan",
      ],
    },
  ]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const location = useLocation();
  const currentPage = location.pathname;

  // Auto-scroll to bottom of messages and focus input
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [messages, open]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const message = inputValue.trim();
    const newMessage = { message, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            context: currentPage,
            messages: [...messages, newMessage], // Send full conversation history
          }),
        }
      );

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          message: data.reply,
          sender: "AI",
          suggestions: data.suggestions || [],
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          message:
            "⚠️ Sorry, I'm having trouble connecting. Please try again later.",
          sender: "AI",
          suggestions: [],
        },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setTimeout(() => {
      handleSend();
    }, 100);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
          >
            <Paper
              elevation={16}
              className="w-[400px] h-[500px] flex flex-col rounded-2xl overflow-hidden border-0 shadow-2xl"
              style={{
                background: "linear-gradient(135deg, #f9fafb, #f3f4f6)",
              }}
            >
              {/* Header */}
              <div className="flex justify-between items-center px-5 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-1.5 rounded-full">
                    <AutoAwesomeIcon
                      className="text-indigo-600"
                      fontSize="medium"
                    />
                  </div>
                  <span className="font-bold text-lg">NutriPlan Assistant</span>
                </div>
                <IconButton
                  size="small"
                  onClick={() => setOpen(false)}
                  className="text-white hover:bg-white/10"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>

              {/* Custom Chat Container */}
              <div className="flex flex-col flex-1 overflow-hidden">
                {/* Message List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                  {messages.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`max-w-[85%] ${
                        m.sender === "user" ? "ml-auto" : "mr-auto"
                      }`}
                    >
                      {/* Message Bubble */}
                      <div
                        className={`px-4 py-3 rounded-2xl ${
                          m.sender === "user"
                            ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-none"
                            : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                        } shadow-sm`}
                      >
                        {m.message}
                      </div>

                      {/* Suggestions */}
                      {m.suggestions && m.suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {m.suggestions.map((sugg, idx) => (
                            <motion.button
                              key={idx}
                              onClick={() => handleSuggestionClick(sugg)}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.98 }}
                              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm px-3 py-1.5 rounded-full hover:shadow-md transition-all flex items-center gap-1"
                            >
                              <AutoAwesomeIcon fontSize="small" />
                              {sugg}
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area - Custom and Visible */}
                <div className="border-t border-gray-200 bg-white p-3">
                  <div className="flex items-center gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about nutrition, diets, or meal plans..."
                      className="flex-1 bg-gray-100 rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                    <IconButton
                      size="small"
                      onClick={handleSend}
                      disabled={!inputValue.trim()}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-md"
                      style={{ minWidth: "40px", minHeight: "40px" }}
                    >
                      <SendIcon fontSize="small" />
                    </IconButton>
                  </div>
                </div>
              </div>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button 
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="shadow-lg rounded-full"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 50,
        }}
      >
        <IconButton
          onClick={() => {
            setOpen(!open);
            if (!open) {
              setTimeout(() => inputRef.current?.focus(), 300);
            }
          }}
          style={{
            background: "linear-gradient(45deg, #6366f1, #8b5cf6)",
            color: "#fff",
            boxShadow: "0 4px 20px rgba(99, 102, 241, 0.4)",
          }}
          size="large"
        >
          {open ? <CloseIcon /> : <ChatIcon />}
        </IconButton>
      </motion.div>
      
      */}

      {/* Floating button - Only show when chat is closed */}
      {!open && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="shadow-lg rounded-full"
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 50,
          }}
        >
          <IconButton
            onClick={() => {
              setOpen(true);
              setTimeout(() => inputRef.current?.focus(), 300);
            }}
            style={{
              background: "linear-gradient(45deg, #6366f1, #8b5cf6)",
              color: "#fff",
              boxShadow: "0 4px 20px rgba(99, 102, 241, 0.4)",
            }}
            size="large"
          >
            <ChatIcon />
          </IconButton>
        </motion.div>
      )}
      {/* Custom styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c7d2fe;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
