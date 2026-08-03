import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, FileText, TrendingUp, User, ArrowUpRight, Inbox, Store, Plus } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { getFeaturedFunding } from '@/services/fundingService'
import { getMyProducts } from '@/services/productsService'
import { formatZAR, daysUntil, sectorAccentClass } from '@/lib/utils'
import type { FundingOpportunity, Product } from '@/types'
import { Skeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'

// Demo application/profile state — replace with live queries against
// business_profiles / applications once the user has completed their profile.
const mockApplications = [
  { id: '1', title: 'uMSOBOMVU Youth Enterprise Fund', status: 'under_review' as const },
  { id: '2', title: 'Agri-Enterprise Development Fund', status: 'submitted' as const },
]

const statusLabel: Record<string, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'text-white/50' },
  submitted: { label: 'Submitted', color: 'text-gold' },
  under_review: { label: 'Under Review', color: 'text-moca-green' },
  shortlisted: { label: 'Shortlisted', color: 'text-moca-green' },
  declined: { label: 'Declined', color: 'text-red-400' },
  funded: { label: 'Funded', color: 'text-moca-green' },
}

export default function Dashboard() {
  const { user } = useAuth()
  const [recommended, setRecommended] = useState<FundingOpportunity[]>([])
  const [myProducts, setMyProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const mocaScore = 68 // placeholder until business_profiles is populated for this user

  useEffect(() => {
    getFeaturedFunding(3).then((data) => {
      setRecommended(data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (user) getMyProducts(user.id).then(setMyProducts)
  }, [user])

  const firstName = user?.user_metadata?.full_name?.split(' ')?.[0] ?? user?.email?.split('@')[0] ?? 'there'

  return (
    <div className="container-page py-16">
      <div className="mb-10">
        <span className="eyebrow">Dashboard</span>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Welcome, {firstName}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* MOCA Score */}
        <div className="card-surface p-6">
          <div className="flex items-center justify-between">
            <span className="eyebrow">MOCA Score</span>
            <TrendingUp className="h-4 w-4 text-moca-green" />
          </div>
          <div className="mt-6 flex items-end gap-3">
            <span className="font-display text-5xl font-bold">{mocaScore}</span>
            <span className="mb-1 text-sm text-white/40">/ 100</span>
          </div>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-moca-gradient" style={{ width: `${mocaScore}%` }} />
          </div>
          <p className="mt-4 text-xs text-white/50">
            Complete your business profile and upload financials to raise your score.
          </p>
          <Link to="/dashboard" className="btn-secondary mt-5 w-full text-xs">
            <User className="h-3.5 w-3.5" /> Complete Business Profile
          </Link>
        </div>

        {/* AI Advisor */}
        <div className="card-surface flex flex-col p-6">
          <div className="flex items-center justify-between">
            <span className="eyebrow">AI Advisor</span>
            <Sparkles className="h-4 w-4 text-gold" />
          </div>
          <p className="mt-6 flex-1 text-sm text-white/60">
            Get instant funding matches, a document checklist, and recommendations tailored to your
            business stage.
          </p>
          <Link to="/ai-assistant" className="btn-gold mt-5 w-full text-xs">
            Ask MOCA AI <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Applications */}
        <div className="card-surface p-6">
          <div className="flex items-center justify-between">
            <span className="eyebrow">Applications</span>
            <FileText className="h-4 w-4 text-moca-green" />
          </div>
          <div className="mt-5 flex flex-col gap-3">
            {mockApplications.map((app) => (
              <div key={app.id} className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0 last:pb-0">
                <span className="text-sm text-white/70 line-clamp-1">{app.title}</span>
                <span className={`text-xs font-medium ${statusLabel[app.status].color}`}>
                  {statusLabel[app.status].label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* My Products */}
        <div className="card-surface flex flex-col p-6">
          <div className="flex items-center justify-between">
            <span className="eyebrow">My Products</span>
            <Store className="h-4 w-4 text-moca-green" />
          </div>
          <div className="mt-5 flex-1">
            {myProducts.length === 0 ? (
              <p className="text-sm text-white/50">
                Nothing listed yet. Sell products or services directly to buyers on the Marketplace.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {myProducts.slice(0, 3).map((p) => (
                  <div key={p.id} className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0 last:pb-0">
                    <span className="text-sm text-white/70 line-clamp-1">{p.title}</span>
                    <span className="text-xs font-medium text-gold">{formatZAR(p.price)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Link to="/marketplace" className="btn-secondary mt-5 w-full text-xs">
            <Plus className="h-3.5 w-3.5" /> {myProducts.length === 0 ? 'List a Product' : 'Manage Listings'}
          </Link>
        </div>
      </div>

      {/* Recommended Funding */}
      <div className="mt-14">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold">Recommended for you</h2>
          <Link to="/funding" className="text-sm font-semibold text-moca-green hover:text-moca-green-light">
            View all →
          </Link>
        </div>
        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-52" />
            ))}
          </div>
        ) : recommended.length === 0 ? (
          <EmptyState
            icon={<Inbox className="h-10 w-10" />}
            title="No recommendations yet"
            description="Complete your business profile so MOCA AI can start matching you to funds."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {recommended.map((f) => (
              <div key={f.id} className="card-surface relative overflow-hidden p-6 transition-transform hover:-translate-y-1">
                <span className={`absolute inset-x-0 top-0 h-0.5 ${sectorAccentClass(f.sector)}`} />
                <Badge>{f.sector}</Badge>
                <h3 className="mt-4 font-display text-base font-semibold leading-snug">{f.title}</h3>
                <p className="mt-1 text-sm text-white/50">{f.organisation}</p>
                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="font-mono text-sm text-gold">
                    {f.amount_max > 0 ? formatZAR(f.amount_max) : 'Non-financial'}
                  </span>
                  <span className="text-xs text-white/40">{daysUntil(f.closing_date)}d left</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
