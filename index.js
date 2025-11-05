import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Groq } from "groq-sdk";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Initialize Groq with your API key from environment variables
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ✅ Root route just to check if backend is live
app.get("/", (req, res) => {
  res.send("✅ SehatAI backend is live and reachable!");
});

// ✅ Chat endpoint
app.post("/chat", async (req, res) => {
  const { messages, language } = req.body;

  try {
    // Language-based system prompt
    let systemPrompt = "";

    if (language === "ur") {
      systemPrompt =
        "Respond only in Urdu. Use natural, conversational Urdu like a friendly personal trainer, not overly formal language.";
    } else {
      systemPrompt =
        "Respond only in English in a motivational and supportive tone, like a bilingual fitness coach.";
    }

    // Send request to Groq
    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    });

    const reply = completion.choices[0]?.message?.content || "⚠️ No response received.";
    res.json({ reply });
  } catch (error) {
    console.error("❌ Chat error:", error);
    res.json({
      reply: "⚠️ SehatAI is temporarily offline. Please try again in a few moments.",
    });
  }
});
app.post("/generate-meal-plan", async (req, res) => {
  const { goal, language } = req.body;

  const prompt =
    language === "ur"
      ? `اردو میں ${goal} کے لیے ایک روزانہ کھانے کا پلان بنائیں۔ اس میں ناشتہ، دوپہر کا کھانا، اور رات کا کھانا شامل ہو۔`
      : `Create a healthy daily meal plan for ${goal}. Include breakfast, lunch, and dinner with short calorie info.`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [{ role: "system", content: prompt }],
    });

    const plan = completion.choices[0]?.message?.content || "No plan generated.";
    res.json({ plan });
  } catch (error) {
    console.error("Meal Plan Error:", error);
    res.status(500).json({ plan: "Error generating meal plan." });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 SehatAI backend running on port ${PORT}`);
});
