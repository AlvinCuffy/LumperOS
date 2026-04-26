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
            text: `This screenshot is from the CLS (Canada Lumping Service) app showing one completed lumper job. Read each labeled row carefully.

THE SCREEN HAS THESE ROWS IN THIS EXACT ORDER:
1. Large title at top → company name
2. "Address" row → address
3. "Supervisor" row → IGNORE
4. "Time" row → job date. Read ONLY this row for the date. Format: YYYY-MM-DD. Example: "2026-04-14, 9:00 PM" → "2026-04-14"
5. "Container" row → container ID (e.g. OERU4009514, MNBU3640031). Copy it exactly, letter by letter.
6. "Lumper" row → IGNORE
7. "Pay" row → shows a pay code (like 0-1699 or 1700-1849) then the dollar amount on the next line. Extract ONLY the dollar amount. Example: "$60.00" → 60.00
8. "Completed" row → ⚠️ IGNORE COMPLETELY. Do NOT use any number, date, or time from this row. The time shown here (e.g. "3:23 AM") is NOT the job date.
9. Grey notes box below → piece count and conditions. First number = pieces. Condition words = additives. Dimension patterns like 7x10 or 8x12 = IGNORE.

NOTES BOX EXAMPLES:
"1800 interlock 7x10" → pieces: 1800, additives: ["Interlock"]  (7x10 is dimensions, ignore)
"1160 INTERLOCKED" → pieces: 1160, additives: ["Interlock"]
"1800 (10) INTERLOCK LABELS" → pieces: 1800, additives: ["Interlock", "Labels Out"]
"320 MIXED HEAVY" → pieces: 320, additives: ["Mixed", "Heavy"]

CONDITION → ADDITIVE: interlock/interlocked→Interlock, mixed→Mixed, heavy→Heavy, high cube→High-Cube, tipped→Tipped, labels/labels out→Labels Out

Return ONLY a raw JSON object, no markdown, no backticks, nothing else:
{"company":"string or null","containerId":"string or null","date":"YYYY-MM-DD or null","pieces":number or null,"basePay":number or null,"multiplier":null,"address":"string or null","additives":["only values from: ${ADDITIVES.join(', ')}"]}`,
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
