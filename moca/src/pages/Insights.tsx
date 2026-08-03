import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Inbox } from 'lucide-react'
import { getArticles } from '@/services/articlesService'
import { formatDate } from '@/lib/utils'
import type { Article, ArticleCategory } from '@/types'
import { Skeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'

const categories: ArticleCategory[] = [
  'Funding News',
  'Business Growth',
  'AI & Technology',
  'Agriculture',
  'Construction',
  'SMME Advice',
]

export default function Insights() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState<ArticleCategory | 'All'>('All')

  useEffect(() => {
    setLoading(true)
    getArticles(active === 'All' ? undefined : active).then((data) => {
      setArticles(data)
      setLoading(false)
    })
  }, [active])

  return (
    <div className="container-page py-16">
      <div className="mb-10 max-w-2xl">
        <span className="eyebrow">MOCA Insights</span>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">News and knowledge for African founders.</h1>
        <p className="mt-4 text-white/60">
          Funding announcements, growth playbooks and AI tools — written for entrepreneurs, not investors.
        </p>
      </div>

      <div className="mb-10 flex flex-wrap gap-2 border-b border-white/10 pb-8">
        {(['All', ...categories] as const).map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
              active === c
                ? 'border-moca-green bg-moca-green/15 text-moca-green'
                : 'border-white/15 text-white/60 hover:border-white/30'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-72" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <EmptyState
          icon={<Inbox className="h-10 w-10" />}
          title="No articles in this category yet"
          description="Check back soon, or browse another category."
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <Link key={a.id} to={`/insights/${a.slug}`} className="card-surface flex flex-col overflow-hidden p-0">
              <div className="flex h-36 items-center justify-center bg-gradient-to-br from-moca-green/20 to-charcoal-lighter">
                <span className="font-display text-3xl font-bold text-white/10">MOCA</span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <Badge>{a.category}</Badge>
                <h3 className="mt-4 font-display text-lg font-semibold leading-snug">{a.title}</h3>
                <p className="mt-2 flex-1 text-sm text-white/50 line-clamp-2">{a.excerpt}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-white/40">
                  <span>{formatDate(a.published_at)}</span>
                  <span className="font-semibold text-moca-green">Read More →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
