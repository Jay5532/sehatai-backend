import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ SehatAI backend is live and reachable!");
});

// POST /chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const { messages, language } = req.body;

    // simple debug to confirm it’s receiving
    console.log("🧠 Incoming chat:", messages, language);

    // send a dummy reply for now (you can plug Groq/OpenAI later)
    res.json({
      reply: `SehatAI says hello! You said: "${messages[0].content}"`,
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
