import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { IconButton, Paper } from "@mui/material";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { motion, AnimatePresence } from "framer-motion";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SendIcon from "@mui/icons-material/Send";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
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
  const location = useLocation();
  const currentPage = location.pathname;

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (message) => {
    const newMessage = { message, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, context: currentPage }),
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

  const handleSuggestionClick = (suggestion) => {
    handleSend(suggestion);
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

              {/* Chat */}
              <MainContainer className="bg-transparent">
                <ChatContainer className="bg-transparent">
                  <MessageList
                    className="px-4 py-2 custom-scrollbar"
                    autoScrollToBottom
                  >
                    {messages.map((m, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Message
                          model={{
                            message: m.message,
                            sender: m.sender,
                            direction:
                              m.sender === "user" ? "outgoing" : "incoming",
                            position: "single",
                            type: "text",
                          }}
                          className={
                            m.sender === "AI"
                              ? "cs-message-incoming"
                              : "cs-message-outgoing"
                          }
                        />
                        {m.suggestions && m.suggestions.length > 0 && (
                          <div className="flex flex-wrap gap-2 p-2 pb-4">
                            {m.suggestions.map((sugg, idx) => (
                              <motion.button
                                key={idx}
                                onClick={() => handleSuggestionClick(sugg)}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm px-3 py-2 rounded-full hover:shadow-md transition-all flex items-center gap-1"
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
                  </MessageList>
                  <div className="cs-message-input-container">
                    <MessageInput
                      placeholder="Ask about nutrition, diets, or meal plans..."
                      onSend={handleSend}
                      attachButton={false}
                      sendButton={false}
                      className="custom-message-input"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <IconButton
                        size="small"
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-md"
                      >
                        <SendIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </div>
                </ChatContainer>
              </MainContainer>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button - fixed position */}
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
          onClick={() => setOpen(!open)}
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

      {/* Custom styles */}
      <style jsx>{`
        .cs-message-input-container {
          border-top: 1px solid #e5e7eb !important;
          background: white !important;
          padding: 12px 16px !important;
        }

        .cs-message-input__content-editor {
          background: white !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 20px !important;
          padding: 10px 16px !important;
          padding-right: 40px !important;
          min-height: 44px !important;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .cs-message-input__content-editor[data-placeholder]:empty:before {
          color: #6b7280 !important;
          font-size: 0.9rem;
        }

        .cs-message-outgoing .cs-message__content {
          background: linear-gradient(45deg, #6366f1, #8b5cf6) !important;
          color: white !important;
          border-radius: 18px 4px 18px 18px !important;
        }

        .cs-message-incoming .cs-message__content {
          background: white !important;
          color: #374151 !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 4px 18px 18px 18px !important;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

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
