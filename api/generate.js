// api/generate.js (Vercel Serverless Function)
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { todoText } = req.body;

  if (!todoText || typeof todoText !== "string") {
    return res.status(400).json({ error: "Invalid or missing todoText" });
  }

  try {
    // Generate sarcastic description
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: `Write a casual two-sentence (10 words max) description of this item but do it like you hate me and doubt I will ever do it: "${todoText}"`,
        },
      ],
      max_tokens: 60,
    });

    const description = completion.choices[0].message.content.trim();

    // Generate image
    const imageRes = await openai.images.generate({
      prompt: todoText,
      n: 1,
      size: "256x256",
    });

    const imageUrl = imageRes.data[0].url;

    return res.status(200).json({ description, imageUrl });
  } catch (error) {
    console.error("OpenAI Error:", error.response?.data || error.message);
    return res.status(500).json({ error: "OpenAI request failed" });
  }
};
