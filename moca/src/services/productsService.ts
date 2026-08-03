import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Product, ProductCategory } from '@/types'
import { mockProducts } from '@/data/mockData'

export interface ProductFilters {
  search?: string
  categories?: ProductCategory[]
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  if (!isSupabaseConfigured) {
    return filterLocally(mockProducts, filters)
  }

  let query = supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,business_name.ilike.%${filters.search}%`)
  }
  if (filters.categories && filters.categories.length > 0) {
    query = query.in('category', filters.categories)
  }

  const { data, error } = await query
  if (error || !data || data.length === 0) {
    return filterLocally(mockProducts, filters)
  }
  return data as unknown as Product[]
}

export async function getMyProducts(userId: string): Promise<Product[]> {
  if (!isSupabaseConfigured) {
    return mockProducts.filter((p) => p.user_id === userId)
  }
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error || !data) return []
  return data as unknown as Product[]
}

export interface NewProductInput {
  seller_name: string
  seller_phone: string
  business_name?: string
  title: string
  description: string
  category: ProductCategory
  price: number
  unit: string
  stock_quantity?: number | null
  location: string
}

export async function createProduct(userId: string, input: NewProductInput) {
  if (!isSupabaseConfigured) {
    return { error: 'Supabase is not configured yet.' }
  }
  const { error } = await supabase.from('products').insert({
    user_id: userId,
    status: 'active',
    ...input,
  })
  return { error: error?.message ?? null }
}

export async function updateProductStatus(productId: string, status: Product['status']) {
  if (!isSupabaseConfigured) {
    return { error: 'Supabase is not configured yet.' }
  }
  const { error } = await supabase.from('products').update({ status }).eq('id', productId)
  return { error: error?.message ?? null }
}

export async function deleteProduct(productId: string) {
  if (!isSupabaseConfigured) {
    return { error: 'Supabase is not configured yet.' }
  }
  const { error } = await supabase.from('products').delete().eq('id', productId)
  return { error: error?.message ?? null }
}

function filterLocally(list: Product[], filters: ProductFilters) {
  let result = list
  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.business_name ?? '').toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    )
  }
  if (filters.categories && filters.categories.length > 0) {
    result = result.filter((p) => filters.categories!.includes(p.category))
  }
  return result
}
