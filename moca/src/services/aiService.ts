import type { AIMatchInput, AIMatchResult } from '@/types'
import { mockFunding } from '@/data/mockData'

/**
 * Calls the Netlify serverless function that wraps the OpenAI API.
 * The API key never touches the client — see netlify/functions/ai-match.ts.
 */
export async function getAIFundingMatch(input: AIMatchInput): Promise<AIMatchResult> {
  try {
    const res = await fetch('/.netlify/functions/ai-match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    if (!res.ok) throw new Error(`AI match request failed: ${res.status}`)
    return (await res.json()) as AIMatchResult
  } catch (err) {
    console.warn('[MOCA] AI match function unavailable, using local heuristic match.', err)
    return localHeuristicMatch(input)
  }
}

// Fallback used in local dev before the Netlify function / OpenAI key is configured.
function localHeuristicMatch(input: AIMatchInput): AIMatchResult {
  const matches = mockFunding
    .filter((f) => f.sector === input.industry || f.sector === 'Youth')
    .slice(0, 3)
    .map((f) => ({
      organisation: f.organisation,
      title: f.title,
      fitReason: `Matches your ${input.industry} sector and ${input.businessStage.toLowerCase()} stage business.`,
      amountRange: f.amount_max > 0 ? `R${f.amount_min.toLocaleString()} – R${f.amount_max.toLocaleString()}` : 'Non-financial support',
    }))

  return {
    matches,
    requiredDocuments: [
      'Certified ID copy of business owner(s)',
      'CIPC company registration (CoR14.3)',
      'B-BBEE certificate or affidavit',
      'Latest 6 months bank statements',
      'Business plan or funding proposal',
      'Tax clearance certificate (SARS)',
    ],
    recommendations: [
      `Complete your business profile to raise your MOCA Score above the ${input.businessStage} benchmark.`,
      'Add 6 months of financial statements — this is the single biggest factor funders check first.',
      'Register on CIDB or relevant sector body if your industry requires it for funding eligibility.',
    ],
  }
}
