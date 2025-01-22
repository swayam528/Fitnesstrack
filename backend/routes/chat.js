const express = require("express");
const { startChat } = require("../controllers/chatController");

const router = express.Router();

// Define the route for the chatbot
router.post("/chat", startChat);

module.exports = router;
