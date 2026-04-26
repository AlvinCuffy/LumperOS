import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { fileBase64, mediaType } = req.body ?? {};
  if (!fileBase64 || !mediaType) {
    return res.status(400).json({ error: 'Missing fileBase64 or mediaType' });
  }

  const fileBlock = mediaType === 'application/pdf'
    ? { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: fileBase64 } }
    : { type: 'image',    source: { type: 'base64', media_type: mediaType,          data: fileBase64 } };

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: [
          fileBlock,
          {
            type: 'text',
            text: `Parse this lumper pay stub and return ONLY a valid JSON object (no markdown, no code blocks):
{
  "payPeriod": "e.g. 'Apr 1–13, 2026' or null",
  "totalGross": number in dollars or null,
  "jobs": [
    {
      "date": "YYYY-MM-DD or null",
      "company": "string",
      "containerId": "string or null",
      "grossPay": number in dollars
    }
  ]
}
List every individual line item / container job you can find. If only a lump total is visible, return jobs as [].`,
          },
        ],
      }],
    });

    const text = message.content[0].text.trim();
    const parsed = JSON.parse(text.replace(/^```json?\s*/i, '').replace(/```\s*$/, ''));
    return res.status(200).json(parsed);
  } catch (err) {
    console.error('parse-paystub error:', err);
    return res.status(500).json({ error: err.message });
  }
}
