import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import Groq from "groq-sdk";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const port = 5000;

// Initialize both clients
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
app.get("/", (req, res) => {
  res.send("✅ SehatAI backend is live and reachable!");
});


app.post("/chat", async (req, res) => {
  try {
    const { messages, language } = req.body;

    // Try OpenAI first
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are SehatAI, a bilingual (Urdu & English) AI fitness coach.
            Respond naturally in ${language === "ur" ? "Urdu" : "English"}.
            Be friendly, motivational, and provide expert guidance.`,
          },
          ...messages,
        ],
      });

      return res.json({ reply: completion.choices[0].message.content });
    } catch (openaiError) {
      console.warn("⚠️ OpenAI failed, switching to Groq:", openaiError.message);

      // Use Groq fallback
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are SehatAI, a bilingual (Urdu & English) AI fitness coach.
            Respond naturally in ${language === "ur" ? "Urdu" : "English"}.
            Be friendly, motivational, and provide expert guidance.`,
          },
          ...messages,
        ],
      });

      return res.json({ reply: completion.choices[0].message.content });
    }
  } catch (error) {
    console.error("🚨 SehatAI backend error:", error);
    res.status(500).json({
      reply:
        "⚠️ SehatAI is temporarily offline. Please try again in a few moments.",
    });
  }
});

app.listen(port, () =>
  console.log(`✅ SehatAI backend running on port ${port}`)
);
