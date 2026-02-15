require('dotenv').config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// Render compatibility
const PORT = process.env.PORT || 3000;

const API_KEY = process.env.OPENROUTER_API_KEY;

// Health check route (important for Render)
app.get("/", (req, res) => {
  res.send("Chatbot backend is running");
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "No message provided" });
  }

  if (!API_KEY) {
    return res.status(500).json({ error: "API key missing" });
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "user", content: message }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });

  } catch (err) {
    console.error("OpenRouter Error:", err.response?.data || err.message);
    res.status(500).json({ error: "OpenRouter API Error" });
  }
});

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
