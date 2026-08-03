import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Article, ArticleCategory } from '@/types'
import { mockArticles } from '@/data/mockData'

export async function getArticles(category?: ArticleCategory): Promise<Article[]> {
  if (!isSupabaseConfigured) {
    return category ? mockArticles.filter((a) => a.category === category) : mockArticles
  }

  let query = supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (category) query = query.eq('category', category)

  const { data, error } = await query
  if (error || !data || data.length === 0) {
    return category ? mockArticles.filter((a) => a.category === category) : mockArticles
  }
  return data as unknown as Article[]
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (!isSupabaseConfigured) {
    return mockArticles.find((a) => a.slug === slug) ?? null
  }
  const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).single()
  if (error || !data) return mockArticles.find((a) => a.slug === slug) ?? null
  return data as unknown as Article
}
