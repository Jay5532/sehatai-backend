import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: messages
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("Groq API error:", data.error);
      return res.status(500).json({ reply: "⚠️ SehatAI is temporarily offline. Please try again later." });
    }

    const reply = data.choices?.[0]?.message?.content || "⚠️ No response received from Groq.";
    res.json({ reply });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ reply: "⚠️ Internal server error. Please try again later." });
  }
});

app.get("/", (req, res) => {
  res.send("✅ SehatAI backend (Groq version) is live and running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`SehatAI backend running on port ${PORT}`));
