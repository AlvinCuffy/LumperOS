import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const ADDITIVES = ['Heavy', 'Mixed', 'Interlock', 'High-Cube', 'Tipped', 'Same Day', 'Holiday', 'Labels Out'];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { imageBase64, mediaType } = req.body ?? {};
  if (!imageBase64 || !mediaType) {
    return res.status(400).json({ error: 'Missing imageBase64 or mediaType' });
  }

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: imageBase64 },
          },
          {
            type: 'text',
            text: `Parse this lumper job dispatch screenshot and return ONLY a valid JSON object (no markdown, no code blocks):
{
  "company": "string or null",
  "containerId": "string like ZCLU9930419 or null",
  "pieces": number or null,
  "basePay": number in dollars or null,
  "multiplier": "string like '1.5x' or null",
  "address": "string or null",
  "additives": ["only values from: ${ADDITIVES.join(', ')}"]
}`,
          },
        ],
      }],
    });

    const text = message.content[0].text.trim();
    const parsed = JSON.parse(text.replace(/^```json?\s*/i, '').replace(/```\s*$/, ''));
    return res.status(200).json(parsed);
  } catch (err) {
    console.error('parse-job error:', err);
    return res.status(500).json({ error: err.message });
  }
}
