import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import Groq from "groq-sdk";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Initialize Groq with your API key
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ✅ Root route
app.get("/", (req, res) => {
  res.send("✅ SehatAI backend is live and reachable!");
});

// ✅ Chat endpoint
app.post("/chat", async (req, res) => {
  const { messages, language } = req.body;

  try {
    let systemPrompt = "";
    if (language === "ur") {
      systemPrompt =
        "Respond only in Urdu in a friendly, motivational tone.";
    } else {
      systemPrompt =
        "Respond only in English in a motivational and supportive tone.";
    }

    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    });

    const reply = completion.choices?.[0]?.message?.content || "No response received.";
    res.json({ reply });
  } catch (error) {
    console.error("❌ Chat error:", error);
    res.json({
      reply: "⚠️ SehatAI is temporarily offline. Please try again later.",
    });
  }
});

// ✅ Generate meal plan endpoint
app.post("/generate-meal-plan", async (req, res) => {
  const { goal, language } = req.body;

  const prompt =
    language === "ur"
      ? `ایک صحت مند روزانہ کھانے کا منصوبہ بنائیں جس میں ${goal} شامل ہو۔ ناشتہ، دوپہر اور رات کے کھانے کی تفصیلات شامل کریں۔`
      : `Create a healthy daily meal plan for ${goal}. Include breakfast, lunch, and dinner details.`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [{ role: "system", content: prompt }],
    });

    const plan = completion.choices?.[0]?.message?.content || "No plan generated.";
    res.json({ plan });
  } catch (error) {
    console.error("Meal Plan Error:", error);
    res.status(500).json({
      plan: "Error generating meal plan.",
      error: error.message,
    });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 SehatAI backend running on port ${PORT}`));
