import { useState } from "react";
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

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "👋 Hi! I’m your NutriPlan Assistant. Ask me anything!",
      sender: "AI",
      suggestions: [],
    },
  ]);

  const location = useLocation();
  const currentPage = location.pathname;

  const handleSend = async (message) => {
    setMessages((prev) => [...prev, { message, sender: "user" }]);

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
          message: "⚠️ Error connecting to AI.",
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
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <Paper
              elevation={16}
              className="w-96 h-[500px] flex flex-col rounded-3xl overflow-hidden border border-gray-300"
              style={{
                background: "linear-gradient(135deg, #f0f4f8, #d9e2ec)",
              }}
            >
              {/* Header */}
              <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
                <span className="font-bold text-lg flex items-center gap-2">
                  <AutoAwesomeIcon /> NutriPlan Assistant
                </span>
                <IconButton
                  size="small"
                  onClick={() => setOpen(false)}
                  color="inherit"
                >
                  <CloseIcon />
                </IconButton>
              </div>

              {/* Chat */}
              <MainContainer>
                <ChatContainer>
                  <MessageList className="px-2">
                    {messages.map((m, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
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
                            background:
                              m.sender === "AI" ? "#fff3e0" : "#d0f0fd",
                            color: "#333",
                          }}
                        />
                        {m.suggestions && m.suggestions.length > 0 && (
                          <div className="flex flex-wrap gap-2 p-2">
                            {m.suggestions.map((sugg, idx) => (
                              <motion.button
                                key={idx}
                                onClick={() => handleSuggestionClick(sugg)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full hover:bg-purple-200 flex items-center gap-1"
                              >
                                <AutoAwesomeIcon fontSize="small" />
                                {sugg}
                              </motion.button>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </MessageList>
                  <MessageInput
                    placeholder="Type your question..."
                    onSend={handleSend}
                  />
                </ChatContainer>
              </MainContainer>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <IconButton
          onClick={() => setOpen(!open)}
          style={{
            background: "linear-gradient(45deg, #6a11cb, #2575fc)",
            color: "#fff",
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          }}
          size="large"
        >
          {open ? <CloseIcon /> : <ChatIcon />}
        </IconButton>
      </motion.div>
    </div>
  );
}
