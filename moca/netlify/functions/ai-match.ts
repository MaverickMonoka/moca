import type { Handler } from '@netlify/functions'

// Keeps the OpenAI key server-side. The client calls /.netlify/functions/ai-match
// and never sees OPENAI_API_KEY.
export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'OPENAI_API_KEY is not configured on the server.' }),
    }
  }

  try {
    const input = JSON.parse(event.body ?? '{}')
    const { businessType, industry, location, fundingRequirement, businessStage } = input

    const prompt = `You are MOCA's funding-matching engine for African entrepreneurs.
Business type: ${businessType}
Industry: ${industry}
Location: ${location}
Funding requirement: R${fundingRequirement}
Business stage: ${businessStage}

Return ONLY valid JSON (no markdown, no commentary) matching exactly this shape:
{
  "matches": [{ "organisation": string, "title": string, "fitReason": string, "amountRange": string }],
  "requiredDocuments": string[],
  "recommendations": string[]
}
Give 3 funding matches realistic for a South African / African SMME in this sector and stage,
6 required documents, and 3 specific, actionable business improvement recommendations.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      return { statusCode: 502, body: JSON.stringify({ error: `OpenAI error: ${errText}` }) }
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content ?? '{}'

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: content,
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
    }
  }
}
