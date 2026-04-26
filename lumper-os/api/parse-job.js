import Anthropic from '@anthropic-ai/sdk';

const ADDITIVES = ['Heavy', 'Mixed', 'Interlock', 'High-Cube', 'Tipped', 'Same Day', 'Holiday', 'Labels Out'];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // Health check — visit /api/parse-job in browser to verify deployment + key
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'deployed',
      hasApiKey: !!process.env.ANTHROPIC_API_KEY,
    });
  }

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
            text: `This is a screenshot from the CLS (Canada Lumping Service) lumper dispatch app. Extract job details using these CLS-specific rules:

- "Time" field = the job date. Extract YYYY-MM-DD from it (e.g. "2026-04-15, 8:00 PM" → "2026-04-15")
- "Container" field = the container ID (e.g. MNBU9111781)
- "Pay" field shows as "CODE\\n$AMOUNT" — basePay is the dollar amount only (e.g. "$55.00" → 55.00)
- Pieces are written in a notes/description box as a number followed by condition words (e.g. "1160 interlocked" → pieces: 1160, additive: "Interlock")
- Common piece conditions that map to additives — interlocked→Interlock, mixed→Mixed, heavy→Heavy, high cube→High-Cube, tipped→Tipped, labels out→Labels Out
- "Address" field = job site address
- Ignore "Lumper", "Supervisor", "Completed" fields

Return ONLY a raw JSON object (no markdown, no backticks):
{"company":"string or null","containerId":"string or null","date":"YYYY-MM-DD or null","pieces":number or null,"basePay":number or null,"multiplier":"e.g. 1.5x or null","address":"string or null","additives":["only from: ${ADDITIVES.join(', ')}"]}`,
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
