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
            text: `This is a screenshot from the CLS (Canada Lumping Service) lumper dispatch app. Extract job details using these exact rules:

FIELD MAPPING:
- "Time" → date (extract YYYY-MM-DD only, e.g. "2026-04-14, 9:00 PM" → "2026-04-14")
- "Container" → containerId (e.g. "OERU4009514")
- "Pay" → shows a code like "1700-1849" then "$60.00" on the next line — basePay is the dollar amount ONLY (60.00)
- "Address" → address
- Ignore: Supervisor, Lumper, Completed

NOTES BOX (the grey box below Pay/Completed):
- Format is: PIECES CONDITION DIMENSIONS
- Example: "1800 interlock 7x10"
  → pieces = 1800 (the first number)
  → additives = ["Interlock"] (the condition word)
  → "7x10" is pallet stack dimensions — IGNORE IT, it is NOT a multiplier
- More examples:
  "1160 interlocked" → pieces: 1160, additives: ["Interlock"]
  "1800 (10) INTERLOCK LABELS" → pieces: 1800, additives: ["Interlock","Labels Out"]
  "320 MIXED HEAVY" → pieces: 320, additives: ["Mixed","Heavy"]
- Numbers in parentheses like (10) = sub-counts, ignore for piece total
- Dimension patterns like 7x10, 8x12, 6x8 = pallet dimensions, ignore completely

CONDITION → ADDITIVE MAPPING:
interlock/interlocked → Interlock
mixed → Mixed
heavy → Heavy
high cube/high-cube → High-Cube
tipped → Tipped
labels/labels out → Labels Out

Return ONLY a raw JSON object, no markdown, no backticks:
{"company":"string or null","containerId":"string or null","date":"YYYY-MM-DD or null","pieces":number or null,"basePay":number or null,"multiplier":"only if explicitly shown as e.g. 1.5x, otherwise null","address":"string or null","additives":["only from: ${ADDITIVES.join(', ')}"]}`,
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
