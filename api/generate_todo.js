const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { todoText } = req.body;

  try {
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: `Write a sarcastic 2-sentence description (10 words max each) of the task: "${todoText}". Act like you don't believe I'll ever do it. If the list item is updated, update the image as well.`,
        },
      ],
      max_tokens: 60,
    });

    const imageResponse = await openai.images.generate({
      prompt: todoText,
      n: 1,
      size: "256x256",
    });

    res.status(200).json({
      description: chatResponse.choices[0].message.content.trim(),
      imageUrl: imageResponse.data[0].url,
    });
  } catch (error) {
    console.error("OpenAI API Error:", error?.response?.data || error.message || error);
    res.status(500).json({ error: "AI generation failed" });
  }
};
