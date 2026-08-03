import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export async function subscribeToNewsletter(email: string): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured) {
    return { error: null } // fail open in demo mode so the UI can show success
  }
  const { error } = await supabase.from('newsletter_subscribers').insert({ email })
  if (error && !error.message.includes('duplicate')) {
    return { error: error.message }
  }
  return { error: null }
}
