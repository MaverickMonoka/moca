import { formatZAR } from '@/lib/utils'

interface TickerItem {
  org: string
  amount: number | null
  sector: string
}

const items: TickerItem[] = [
  { org: 'National Empowerment Fund', amount: 2000000, sector: 'Youth' },
  { org: 'Land Bank', amount: 5000000, sector: 'Agriculture' },
  { org: 'IDC', amount: 10000000, sector: 'Women Owned' },
  { org: 'CIDB & NHBRC', amount: 3000000, sector: 'Construction' },
  { org: 'Google for Startups', amount: null, sector: 'Technology' },
  { org: 'NYDA', amount: 500000, sector: 'Creative' },
]

/**
 * A live-market-style ticker of funding partners, reinforcing MOCA's
 * marketplace credibility (the DFI/bank-marketplace part of the brief)
 * the same way a stock ticker signals "real, moving capital" rather than
 * a static logo row.
 */
export function FundingTicker() {
  const doubled = [...items, ...items]
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-charcoal-light/60 py-3">
      <div className="flex w-max animate-ticker gap-10">
        {doubled.map((item, i) => (
          <div key={i} className="flex shrink-0 items-center gap-2 font-mono text-xs text-white/50">
            <span className="h-1.5 w-1.5 rounded-full bg-moca-green" />
            <span className="text-white/70">{item.org}</span>
            <span className="text-white/30">·</span>
            <span>{item.sector}</span>
            <span className="text-gold">
              {item.amount ? formatZAR(item.amount) : 'Non-financial'}
            </span>
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-charcoal to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-charcoal to-transparent" />
    </div>
  )
}
