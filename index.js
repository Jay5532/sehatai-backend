import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ SehatAI backend is live and reachable!");
});

app.post("/chat", async (req, res) => {
  try {
    const { messages, language } = req.body;

    console.log("🧠 Received from frontend:", messages, language);

    // Temporary dummy reply for testing
    res.json({
      reply: `SehatAI says hello! You said: "${messages?.[0]?.content || "nothing"}"`,
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      reply: "⚠️ SehatAI is temporarily offline. Please try again in a few moments.",
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
