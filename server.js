require('dotenv').config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) return res.status(400).json({ error: "No message" });

  try {
    // UPDATED: Using the Gemini 3 Flash model (Current 2026 Standard)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`;
    
    const response = await axios.post(url, {
      contents: [{
        parts: [{ text: message }]
      }]
    });

    const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    res.json({ reply: aiResponse || "AI returned an empty response." });

  } catch (err) {
    console.error("--- API Error ---");
    // Detailed error logging to see exactly why it fails
    console.error(JSON.stringify(err.response?.data || err.message, null, 2));
    
    res.status(500).json({ 
      error: "API Error",
      details: err.response?.data?.error?.message || "Model path error"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));