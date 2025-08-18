const express = require("express");
const { chatWithAI } = require("../Controller/chatController");

const router = express.Router();

// POST /api/chat
router.post("/", chatWithAI);

module.exports = router;
