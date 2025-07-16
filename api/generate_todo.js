const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { todoText } = req.body;

  try {
    const descRes = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `Write a casual two-sentence (under 10 words) sarcastic description of this task: "${todoText}". Be pacive agressive and make it sound like you doubt I'll ever do anything in the list.`,
        },
      ],
      max_tokens: 60,
    });

    const description = descRes?.data?.choices?.[0]?.message?.content?.trim() || 'No description generated.';

    let imageUrl = '';
    try {
      const imgRes = await openai.createImage({
        prompt: todoText,
        n: 1,
        size: "256x256",
      });
      imageUrl = imgRes?.data?.data?.[0]?.url || '';
    } catch (imgErr) {
      console.error('Image generation failed:', imgErr?.response?.data || imgErr.message || imgErr);
    }

    res.status(200).json({ description, imageUrl });
  } catch (error) {
    console.error('OpenAI API error:', error?.response?.data || error.message || error);
    res.status(500).json({ error: 'AI generation failed' });
  }
};
