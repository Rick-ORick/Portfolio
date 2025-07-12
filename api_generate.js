// This runs on Vercel serverless backend
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { todoText } = req.body;

  try {
    // Description generation
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: `Write a casual two sentences (no more than 10 words long) description of the item but do it like you actually hate me and doubt I will do anything in the list: "${todoText}"`,
        },
      ],
      max_tokens: 60,
    });

    const description = completion.data.choices[0].message.content.trim();

    // Image generation
    const imageRes = await openai.createImage({
      prompt: todoText,
      n: 1,
      size: "256x256",
    });

    const imageUrl = imageRes.data.data[0].url;

    return res.status(200).json({ description, imageUrl });
  } catch (error) {
    console.error("OpenAI Error:", error.response?.data || error.message);
    return res.status(500).json({ error: "OpenAI request failed" });
  }
};
