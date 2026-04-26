import Anthropic from '@anthropic-ai/sdk';

const ADDITIVES = ['Heavy', 'Mixed', 'Interlock', 'High-Cube', 'Tipped', 'Same Day', 'Holiday', 'Labels Out'];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured on server' });
  }

  const { imageBase64, mediaType } = req.body ?? {};
  if (!imageBase64 || !mediaType) {
    return res.status(400).json({ error: 'Missing imageBase64 or mediaType' });
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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
            text: `Parse this lumper job dispatch screenshot. Return ONLY a raw JSON object (no markdown, no backticks, no explanation):
{"company":"string or null","containerId":"container ID string or null","pieces":number or null,"basePay":number in dollars or null,"multiplier":"e.g. 1.5x or null","address":"string or null","additives":["only from: ${ADDITIVES.join(', ')}"]}`,
          },
        ],
      }],
    });

    let text = message.content[0].text.trim();
    // Strip markdown code fences if present
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
    // Extract the first JSON object found
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return res.status(500).json({ error: `No JSON in Claude response: ${text.slice(0, 200)}` });

    const parsed = JSON.parse(match[0]);
    return res.status(200).json(parsed);
  } catch (err) {
    console.error('parse-job error:', err);
    return res.status(500).json({ error: err.message });
  }
}
