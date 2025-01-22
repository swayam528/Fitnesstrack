const path = require("path");
const express = require("express");
const router = express.Router();

// Serve React frontend
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./FitnessTracker/backend/routes/diet.js"));
});

module.exports = router;
