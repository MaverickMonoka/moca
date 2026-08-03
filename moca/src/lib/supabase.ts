import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// MOCA runs against Supabase in production. If env vars are missing (e.g. local
// preview without a project wired up yet) we fail loudly in the console rather
// than silently breaking every page, but we still export a client so imports
// don't crash the build.
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[MOCA] Missing Supabase env vars. Copy .env.example to .env and add your project credentials.',
  )
}

export const supabase = createClient<Database>(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder-anon-key',
)

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)
