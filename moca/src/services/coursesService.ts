import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Course } from '@/types'
import { mockCourses } from '@/data/mockData'

export async function getCourses(): Promise<Course[]> {
  if (!isSupabaseConfigured) return mockCourses
  const { data, error } = await supabase.from('courses').select('*').order('title')
  if (error || !data || data.length === 0) return mockCourses
  return data as unknown as Course[]
}
