import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const { todoText } = req.body;

  try {
    const descRes = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `Write a casual two sentences (no more than 10 words long) description of the item but do it like you actually hate me and doubt I will do anything in the list: "${todoText}"`,
        },
      ],
      max_tokens: 60,
    });

    const imgRes = await openai.createImage({
      prompt: todoText,
      n: 1,
      size: "256x256",
    });

    res.status(200).json({
      description: descRes.data.choices[0].message.content.trim(),
      imageUrl: imgRes.data.data[0].url,
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'AI generation failed' });
  }
}
