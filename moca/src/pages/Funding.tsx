import { useEffect, useState } from 'react'
import { Search, SlidersHorizontal, Inbox } from 'lucide-react'
import { getFundingOpportunities } from '@/services/fundingService'
import { formatZAR, formatDate, daysUntil, sectorAccentClass } from '@/lib/utils'
import type { FundingOpportunity, Sector } from '@/types'
import { Skeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'

const allSectors: Sector[] = [
  'Agriculture',
  'Technology',
  'Construction',
  'Manufacturing',
  'Tourism',
  'Creative Industries',
  'Youth',
  'Women Owned Businesses',
]

export default function Funding() {
  const [opportunities, setOpportunities] = useState<FundingOpportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedSectors, setSelectedSectors] = useState<Sector[]>([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    setLoading(true)
    const timeout = setTimeout(() => {
      getFundingOpportunities({ search, sectors: selectedSectors }).then((data) => {
        setOpportunities(data)
        setLoading(false)
      })
    }, 250)
    return () => clearTimeout(timeout)
  }, [search, selectedSectors])

  function toggleSector(sector: Sector) {
    setSelectedSectors((prev) =>
      prev.includes(sector) ? prev.filter((s) => s !== sector) : [...prev, sector],
    )
  }

  return (
    <div className="container-page py-16">
      <div className="mb-10 max-w-2xl">
        <span className="eyebrow">Funding marketplace</span>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Find funding built for your business.</h1>
        <p className="mt-4 text-white/60">
          Grants, blended finance and equity-free support from South Africa's leading DFIs, banks and
          accelerators — filtered to match your sector.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by fund or organisation..."
            className="input-field pl-11"
          />
        </div>
        <button
          onClick={() => setShowFilters((s) => !s)}
          className="btn-secondary sm:w-auto"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters {selectedSectors.length > 0 && `(${selectedSectors.length})`}
        </button>
      </div>

      {showFilters && (
        <div className="mb-10 flex flex-wrap gap-2 border-b border-white/10 pb-8">
          {allSectors.map((sector) => (
            <button
              key={sector}
              onClick={() => toggleSector(sector)}
              className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                selectedSectors.includes(sector)
                  ? 'border-moca-green bg-moca-green/15 text-moca-green'
                  : 'border-white/15 text-white/60 hover:border-white/30'
              }`}
            >
              {sector}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : opportunities.length === 0 ? (
        <EmptyState
          icon={<Inbox className="h-10 w-10" />}
          title="No matching funds right now"
          description="Try clearing your filters or search for a different sector or organisation."
          action={
            <button
              onClick={() => {
                setSearch('')
                setSelectedSectors([])
              }}
              className="btn-secondary"
            >
              Clear filters
            </button>
          }
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {opportunities.map((f) => {
            const days = daysUntil(f.closing_date)
            return (
              <div key={f.id} className="card-surface relative flex flex-col overflow-hidden p-6 transition-transform hover:-translate-y-1">
                <span className={`absolute inset-x-0 top-0 h-0.5 ${sectorAccentClass(f.sector)}`} />
                <div className="flex items-start justify-between gap-3">
                  <Badge>{f.sector}</Badge>
                  {days <= 14 && days >= 0 && (
                    <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-medium text-gold">
                      Closing soon
                    </span>
                  )}
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold leading-snug">{f.title}</h3>
                <p className="mt-1 text-sm text-white/50">{f.organisation}</p>
                <p className="mt-3 flex-1 text-sm text-white/60">{f.description}</p>
                <p className="mt-4 text-xs text-white/40">
                  <span className="font-semibold text-white/60">Eligibility: </span>
                  {f.eligibility}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                  <div>
                    <p className="font-mono text-sm text-gold">
                      {f.amount_max > 0 ? formatZAR(f.amount_max) : 'Non-financial'}
                    </p>
                    <p className="text-xs text-white/40">Closes {formatDate(f.closing_date)}</p>
                  </div>
                  <a
                    href={f.application_url ?? '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary text-xs"
                  >
                    Apply
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
