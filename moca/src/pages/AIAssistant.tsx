import type { FormEvent } from 'react'
import { useState } from 'react'
import { Sparkles, FileCheck, Lightbulb, Loader2 } from 'lucide-react'
import { getAIFundingMatch } from '@/services/aiService'
import type { AIMatchInput, AIMatchResult, BusinessStage, Sector } from '@/types'

const sectors: Sector[] = [
  'Agriculture', 'Technology', 'Construction', 'Manufacturing',
  'Tourism', 'Creative Industries', 'Youth', 'Women Owned Businesses',
]
const stages: BusinessStage[] = ['Idea', 'Startup', 'Early Growth', 'Established', 'Scaling']

export default function AIAssistant() {
  const [form, setForm] = useState<AIMatchInput>({
    businessType: '',
    industry: 'Technology',
    location: '',
    fundingRequirement: 250000,
    businessStage: 'Startup',
  })
  const [result, setResult] = useState<AIMatchResult | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await getAIFundingMatch(form)
    setResult(res)
    setLoading(false)
  }

  return (
    <div className="container-page py-16">
      <div className="mb-10 max-w-2xl">
        <span className="eyebrow">MOCA AI Assistant</span>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Your funding match, in seconds.</h1>
        <p className="mt-4 text-white/60">
          Tell us about your business and MOCA's AI Advisor will surface relevant funding, the
          documents you'll need, and what to fix before you apply.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <form onSubmit={handleSubmit} className="card-surface flex flex-col gap-4 p-6 lg:col-span-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/60">Business type</label>
            <input
              required
              value={form.businessType}
              onChange={(e) => setForm({ ...form, businessType: e.target.value })}
              placeholder="e.g. Poultry farm, civil contractor, app startup"
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/60">Industry</label>
            <select
              value={form.industry}
              onChange={(e) => setForm({ ...form, industry: e.target.value as Sector })}
              className="input-field"
            >
              {sectors.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/60">Location</label>
            <input
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. Sekhukhune, Limpopo"
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/60">
              Funding requirement: R{form.fundingRequirement.toLocaleString()}
            </label>
            <input
              type="range"
              min={0}
              max={5000000}
              step={50000}
              value={form.fundingRequirement}
              onChange={(e) => setForm({ ...form, fundingRequirement: Number(e.target.value) })}
              className="w-full accent-moca-green"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/60">Business stage</label>
            <select
              value={form.businessStage}
              onChange={(e) => setForm({ ...form, businessStage: e.target.value as BusinessStage })}
              className="input-field"
            >
              {stages.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={loading} className="btn-gold mt-2 w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? 'Matching...' : 'Get My Matches'}
          </button>
        </form>

        <div className="lg:col-span-3">
          {!result && !loading && (
            <div className="card-surface flex h-full flex-col items-center justify-center p-16 text-center">
              <Sparkles className="h-8 w-8 text-white/20" />
              <p className="mt-4 text-sm text-white/40">
                Fill in your business details to see AI-matched funding.
              </p>
            </div>
          )}

          {loading && (
            <div className="card-surface flex h-full flex-col items-center justify-center p-16 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-moca-green" />
              <p className="mt-4 text-sm text-white/40">MOCA AI is analysing your business...</p>
            </div>
          )}

          {result && !loading && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <Sparkles className="h-4 w-4 text-gold" /> Funding matches
                </h2>
                <div className="flex flex-col gap-3">
                  {result.matches.map((m, i) => (
                    <div key={i} className="card-surface p-5">
                      <div className="flex items-start justify-between">
                        <h3 className="font-display font-semibold">{m.title}</h3>
                        <span className="font-mono text-xs text-gold">{m.amountRange}</span>
                      </div>
                      <p className="mt-1 text-sm text-white/50">{m.organisation}</p>
                      <p className="mt-2 text-sm text-white/60">{m.fitReason}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-surface p-5">
                <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <FileCheck className="h-4 w-4 text-moca-green" /> Required documents
                </h2>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {result.requiredDocuments.map((doc, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-moca-green" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card-surface p-5">
                <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <Lightbulb className="h-4 w-4 text-gold" /> Recommendations
                </h2>
                <ul className="flex flex-col gap-2">
                  {result.recommendations.map((r, i) => (
                    <li key={i} className="text-sm text-white/60">
                      {i + 1}. {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
