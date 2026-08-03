import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { CommunityPost } from '@/types'
import { mockCommunityPosts } from '@/data/mockData'

export async function getCommunityPosts(): Promise<CommunityPost[]> {
  if (!isSupabaseConfigured) return mockCommunityPosts
  const { data, error } = await supabase
    .from('community_posts')
    .select('*')
    .order('created_at', { ascending: false })
  if (error || !data || data.length === 0) return mockCommunityPosts
  return data as unknown as CommunityPost[]
}

export async function createCommunityPost(userId: string, title: string, body: string, tag: string) {
  if (!isSupabaseConfigured) {
    return { error: 'Supabase is not configured yet.' }
  }
  const { error } = await supabase.from('community_posts').insert({ user_id: userId, title, body, tag })
  return { error: error?.message ?? null }
}
