import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { FundingOpportunity, Sector } from '@/types'
import { mockFunding } from '@/data/mockData'

export interface FundingFilters {
  search?: string
  sectors?: Sector[]
}

export async function getFundingOpportunities(filters: FundingFilters = {}): Promise<FundingOpportunity[]> {
  if (!isSupabaseConfigured) {
    return filterLocally(mockFunding, filters)
  }

  let query = supabase
    .from('funding_opportunities')
    .select('*')
    .eq('status', 'open')
    .order('closing_date', { ascending: true })

  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,organisation.ilike.%${filters.search}%`)
  }
  if (filters.sectors && filters.sectors.length > 0) {
    query = query.in('sector', filters.sectors)
  }

  const { data, error } = await query
  if (error || !data || data.length === 0) {
    return filterLocally(mockFunding, filters)
  }
  return data as unknown as FundingOpportunity[]
}

export async function getFeaturedFunding(limit = 3): Promise<FundingOpportunity[]> {
  const all = await getFundingOpportunities()
  return all.filter((f) => f.featured).slice(0, limit)
}

function filterLocally(list: FundingOpportunity[], filters: FundingFilters) {
  let result = list
  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(
      (f) => f.title.toLowerCase().includes(q) || f.organisation.toLowerCase().includes(q),
    )
  }
  if (filters.sectors && filters.sectors.length > 0) {
    result = result.filter((f) => filters.sectors!.includes(f.sector))
  }
  return result
}
