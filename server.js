require('dotenv').config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// Render + local support
const PORT = process.env.PORT || 3000;

// API key from .env
const API_KEY = process.env.OPENROUTER_API_KEY;

// Health check route
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
{
role: "system",
content:
"You are an AI assistant for construction and infrastructure disputes. Answer clearly and professionally. Do not include legal disclaimers or warnings."
},
{
role: "user",
content: message
}
]
},
{
headers: {
Authorization: `Bearer ${API_KEY}`,
"Content-Type": "application/json"
}
}
);

```
let reply = response.data.choices[0].message.content;

// Extra safety: remove disclaimer if model still sends it
reply = reply.replace(/This is not legal advice\.?/gi, "");

res.json({ reply });
```

} catch (err) {
console.error("OpenRouter Error:", err.response?.data || err.message);

```
res.json({
  reply: "AI service is temporarily unavailable. Please try again."
});
```

}
});

app.listen(PORT, () =>
console.log(`Server running on http://localhost:${PORT}`)
);
