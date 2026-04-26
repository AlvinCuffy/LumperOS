import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

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

  const { fileBase64, mediaType } = req.body ?? {};
  if (!fileBase64 || !mediaType) {
    return res.status(400).json({ error: 'Missing fileBase64 or mediaType' });
  }

  const fileBlock = mediaType === 'application/pdf'
    ? { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: fileBase64 } }
    : { type: 'image',    source: { type: 'base64', media_type: mediaType,          data: fileBase64 } };

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: [
          fileBlock,
          {
            type: 'text',
            text: `Parse this lumper pay stub and return ONLY a raw JSON object (no markdown, no backticks):
{"payPeriod":"e.g. 'Apr 1–13, 2026' or null","totalGross":number or null,"jobs":[{"date":"YYYY-MM-DD or null","company":"string","containerId":"string or null","grossPay":number}]}
List every individual line item / container job. If only a lump total is visible, return jobs as [].`,
          },
        ],
      }],
    });

    let text = message.content[0].text.trim();
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return res.status(500).json({ error: `No JSON in Claude response: ${text.slice(0, 200)}` });

    const parsed = JSON.parse(match[0]);
    return res.status(200).json(parsed);
  } catch (err) {
    console.error('parse-paystub error:', err);
    return res.status(500).json({ error: err.message });
  }
}
