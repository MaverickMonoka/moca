import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  Search,
  FileText,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  Wheat,
  Building2,
  Palette,
  Mail,
  CheckCircle2,
} from 'lucide-react'
import { getFeaturedFunding } from '@/services/fundingService'
import { getArticles } from '@/services/articlesService'
import { subscribeToNewsletter } from '@/services/newsletterService'
import { formatZAR, formatDate, daysUntil, sectorAccentClass } from '@/lib/utils'
import type { FundingOpportunity, Article } from '@/types'
import { Skeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/Badge'
import { Reveal } from '@/components/common/Reveal'
import { GrowthLine } from '@/components/common/GrowthLine'
import { FundingTicker } from '@/components/common/FundingTicker'

const steps = [
  {
    label: 'Profile',
    title: 'Build your business profile',
    description: 'Tell us about your business, sector, stage and funding needs. It takes under 5 minutes.',
    icon: FileText,
  },
  {
    label: 'Match',
    title: 'Get matched by MOCA AI',
    description: 'Our AI Advisor scores your readiness and matches you to relevant funding and grants.',
    icon: Sparkles,
  },
  {
    label: 'Apply',
    title: 'Apply with confidence',
    description: 'Track applications, get document checklists, and follow up funders in one place.',
    icon: TrendingUp,
  },
  {
    label: 'Grow',
    title: 'Grow with the Academy',
    description: 'Courses, tender support and a community of founders to keep you moving forward.',
    icon: ShieldCheck,
  },
]

const sectors = [
  { name: 'Agriculture', icon: Wheat },
  { name: 'Construction', icon: Building2 },
  { name: 'Creative Industries', icon: Palette },
  { name: 'Technology', icon: Sparkles },
]

const successStories = [
  {
    name: 'Kagiso Fresh Produce',
    founder: 'Palesa Sekhukhune',
    sector: 'Agriculture',
    result: 'R1.2M in funding secured, output tripled in 8 months.',
  },
  {
    name: 'Monoka Meat Market',
    founder: 'Thabo Monoka',
    sector: 'Retail',
    result: 'From one till to three branches with POS automation.',
  },
  {
    name: 'Tshipi Safetywear',
    founder: 'Naledi Tshipi',
    sector: 'Manufacturing',
    result: 'First tender win after Funding Readiness course.',
  },
]

export default function Landing() {
  const [featured, setFeatured] = useState<FundingOpportunity[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [subState, setSubState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  useEffect(() => {
    Promise.all([getFeaturedFunding(3), getArticles()]).then(([f, a]) => {
      setFeatured(f)
      setArticles(a.slice(0, 3))
      setLoading(false)
    })
  }, [])

  async function handleSubscribe(e: FormEvent) {
    e.preventDefault()
    if (!email) return
    setSubState('loading')
    const { error } = await subscribeToNewsletter(email)
    setSubState(error ? 'error' : 'success')
  }

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10">
        <GrowthLine />
        <div className="container-page relative flex flex-col items-center py-24 text-center lg:py-32">
          <span className="eyebrow mb-6 animate-fade-up">Mobicom Opportunity &amp; Capital Access</span>
          <h1 className="animate-fade-up text-6xl font-bold leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl" style={{ animationDelay: '80ms' }}>
            MOCA
          </h1>
          <h2
            className="mt-6 animate-fade-up text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl"
            style={{ animationDelay: '160ms' }}
          >
            <span className="text-moca-green">BUILD.</span>{' '}
            <span className="text-white">FUND.</span>{' '}
            <span className="text-gold">GROW.</span>
          </h2>
          <p className="mt-6 max-w-xl animate-fade-up text-lg text-white/60" style={{ animationDelay: '220ms' }}>
            Africa's intelligent platform for entrepreneurs — matching youth, SMMEs, farmers and startups
            with real funding, business knowledge and growth tools.
          </p>
          <div className="mt-10 flex animate-fade-up flex-col gap-3 sm:flex-row" style={{ animationDelay: '300ms' }}>
            <Link to="/funding" className="btn-primary">
              Find Funding <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link to="/signup" className="btn-secondary">
              Start Your Business
            </Link>
            <Link to="/signup" className="btn-gold">
              Join Investors
            </Link>
          </div>

          <div
            className="mt-20 flex animate-fade-up items-baseline gap-x-10 gap-y-4 border-t border-white/10 pt-8 font-mono text-xs uppercase tracking-wider text-white/40 sm:gap-x-14"
            style={{ animationDelay: '380ms' }}
          >
            <span>
              <span className="mr-2 font-display text-2xl font-bold normal-case tracking-normal text-white">R280M+</span>
              tracked
            </span>
            <span>
              <span className="mr-2 font-display text-2xl font-bold normal-case tracking-normal text-white">1,400+</span>
              matched
            </span>
            <span>
              <span className="mr-2 font-display text-2xl font-bold normal-case tracking-normal text-white">60+</span>
              partners
            </span>
          </div>
        </div>

        <FundingTicker />
      </section>

      {/* HOW MOCA WORKS */}
      <section className="container-page py-24">
        <Reveal>
          <div className="mb-14 max-w-2xl">
            <span className="eyebrow">How it works</span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">From idea to funded, guided by AI.</h2>
          </div>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.label} delay={i * 80}>
              <div className="card-surface h-full p-6">
                <div className="flex items-center justify-between">
                  <step.icon className="h-6 w-6 text-moca-green" />
                  <span className="font-mono text-xs text-white/30">Step {i + 1} of {steps.length}</span>
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-white/50">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SECTOR STRIP */}
      <section className="border-y border-white/10 bg-charcoal-light py-14">
        <div className="container-page">
          <p className="eyebrow mb-8">Built for every sector</p>
          <div className="grid grid-cols-2 divide-white/10 sm:grid-cols-4 sm:divide-x">
            {sectors.map((s) => (
              <div key={s.name} className="flex items-center gap-3 px-0 py-3 text-white/70 sm:px-6 first:sm:pl-0">
                <s.icon className="h-5 w-5 text-gold" />
                <span className="text-sm font-medium">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST FUNDING */}
      <section className="container-page py-24">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">Funding marketplace</span>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Latest funding opportunities</h2>
            </div>
            <Link to="/funding" className="flex items-center gap-1 text-sm font-semibold text-moca-green hover:text-moca-green-light">
              View all opportunities <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-64" />)
            : featured.map((f) => (
                <div key={f.id} className="card-surface group relative flex flex-col overflow-hidden p-6 transition-transform hover:-translate-y-1">
                  <span className={`absolute inset-x-0 top-0 h-0.5 ${sectorAccentClass(f.sector)}`} />
                  <div className="flex items-start justify-between gap-3">
                    <Badge>{f.sector}</Badge>
                    <span className="text-xs text-white/40">{daysUntil(f.closing_date)}d left</span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold leading-snug">{f.title}</h3>
                  <p className="mt-1 text-sm text-white/50">{f.organisation}</p>
                  <p className="mt-3 text-sm text-white/60 line-clamp-2">{f.description}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="font-mono text-sm text-gold">
                      {f.amount_max > 0 ? formatZAR(f.amount_max) : 'Non-financial'}
                    </span>
                    <Link to="/funding" className="text-sm font-semibold text-moca-green hover:text-moca-green-light">
                      Apply →
                    </Link>
                  </div>
                </div>
              ))}
        </div>
      </section>

      {/* SUCCESS STORIES */}
      <section className="border-y border-white/10 bg-charcoal-light py-24">
        <div className="container-page">
          <Reveal>
            <span className="eyebrow">Success stories</span>
            <h2 className="mt-3 max-w-xl text-3xl font-bold sm:text-4xl">
              Real founders, funded and growing.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {successStories.map((s, i) => (
              <Reveal key={s.name} delay={i * 80}>
              <div className="card-surface h-full p-6 transition-transform hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-moca-gradient font-display font-bold">
                  {s.name.charAt(0)}
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{s.name}</h3>
                <p className="text-sm text-white/50">{s.founder} · {s.sector}</p>
                <p className="mt-4 text-sm text-white/70">{s.result}</p>
              </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* LEARNING CENTRE */}
      <section className="container-page py-24">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">Learning centre</span>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Sharpen your skills, then apply.</h2>
            </div>
            <Link to="/academy" className="flex items-center gap-1 text-sm font-semibold text-moca-green hover:text-moca-green-light">
              Browse the Academy <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48" />)
            : articles.map((a) => (
                <Link key={a.id} to={`/insights/${a.slug}`} className="card-surface block p-6 transition-transform hover:-translate-y-1">
                  <Badge>{a.category}</Badge>
                  <h3 className="mt-4 font-display text-lg font-semibold leading-snug">{a.title}</h3>
                  <p className="mt-2 text-sm text-white/50 line-clamp-2">{a.excerpt}</p>
                  <p className="mt-4 text-xs text-white/40">{formatDate(a.published_at)} · {a.read_minutes} min read</p>
                </Link>
              ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="container-page pb-24">
        <Reveal>
        <div className="card-surface flex flex-col items-center gap-6 p-10 text-center sm:p-16">
          <Mail className="h-8 w-8 text-gold" />
          <h2 className="max-w-md text-2xl font-bold sm:text-3xl">
            Get funding alerts before everyone else.
          </h2>
          <p className="max-w-sm text-sm text-white/50">
            Weekly digest of new funds, deadlines and grants relevant to your sector.
          </p>
          {subState === 'success' ? (
            <div className="flex items-center gap-2 text-moca-green">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-medium">You're subscribed. Welcome to MOCA.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@business.co.za"
                className="input-field"
              />
              <button type="submit" disabled={subState === 'loading'} className="btn-primary shrink-0">
                <Search className="h-4 w-4" /> Subscribe
              </button>
            </form>
          )}
          {subState === 'error' && (
            <p className="text-xs text-red-400">Something went wrong — please try again.</p>
          )}
        </div>
        </Reveal>
      </section>
    </div>
  )
}
