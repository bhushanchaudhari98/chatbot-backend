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
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    
    const response = await axios.post(url, {
      contents: [
        {
          parts: [{ text: message }]
        }
      ]
    });

    const aiResponse =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    res.json({ reply: aiResponse || "AI returned an empty response." });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "API Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
