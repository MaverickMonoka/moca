import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getArticleBySlug } from '@/services/articlesService'
import { formatDate } from '@/lib/utils'
import type { Article } from '@/types'
import { Skeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'

export default function ArticlePage() {
  const { slug } = useParams()
  const [article, setArticle] = useState<Article | null | undefined>(undefined)

  useEffect(() => {
    if (!slug) return
    getArticleBySlug(slug).then(setArticle)
  }, [slug])

  if (article === undefined) {
    return (
      <div className="container-page max-w-3xl py-16">
        <Skeleton className="h-8 w-32 mb-8" />
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (article === null) {
    return (
      <div className="container-page py-16">
        <EmptyState title="Article not found" description="This article may have been moved or unpublished." />
      </div>
    )
  }

  return (
    <div className="container-page max-w-3xl py-16">
      <Link to="/insights" className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to Insights
      </Link>
      <Badge>{article.category}</Badge>
      <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">{article.title}</h1>
      <p className="mt-4 text-sm text-white/40">
        {article.author} · {formatDate(article.published_at)} · {article.read_minutes} min read
      </p>
      <div className="my-10 flex h-64 items-center justify-center rounded-2xl bg-gradient-to-br from-moca-green/20 to-charcoal-lighter">
        <span className="font-display text-4xl font-bold text-white/10">MOCA</span>
      </div>
      <p className="text-lg text-white/70">{article.excerpt}</p>
      <div className="prose prose-invert mt-6 max-w-none text-white/60">
        <p>
          {article.content ||
            'Full article content will populate here from the CMS. This preview is running on MOCA\u2019s demo dataset — connect Supabase and publish via the Admin panel to replace this placeholder with real reporting.'}
        </p>
      </div>
    </div>
  )
}
