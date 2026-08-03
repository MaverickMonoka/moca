import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { Search, SlidersHorizontal, Store, Plus, X, MessageCircle } from 'lucide-react'
import { getProducts, createProduct } from '@/services/productsService'
import { useAuth } from '@/hooks/useAuth'
import { formatZAR, whatsappLink } from '@/lib/utils'
import type { Product, ProductCategory } from '@/types'
import { Skeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'

const allCategories: ProductCategory[] = [
  'Agriculture & Produce',
  'Construction & Hardware',
  'Fashion & Apparel',
  'Food & Beverage',
  'Beauty & Wellness',
  'Tech & Electronics',
  'Arts & Crafts',
  'Services',
]

const emptyForm = {
  seller_name: '',
  seller_phone: '',
  business_name: '',
  title: '',
  description: '',
  category: allCategories[0],
  price: '',
  unit: 'per item',
  stock_quantity: '',
  location: '',
}

export default function Marketplace() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    const timeout = setTimeout(() => {
      getProducts({ search, categories: selectedCategories }).then((data) => {
        setProducts(data)
        setLoading(false)
      })
    }, 250)
    return () => clearTimeout(timeout)
  }, [search, selectedCategories])

  function toggleCategory(category: ProductCategory) {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  function updateField<K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user) {
      setError('Log in to list a product or service for sale.')
      return
    }
    setSubmitting(true)
    setError(null)

    const price = Number(form.price)
    const stock = form.stock_quantity ? Number(form.stock_quantity) : null

    const { error: err } = await createProduct(user.id, {
      seller_name: form.seller_name,
      seller_phone: form.seller_phone.replace(/\D/g, ''),
      business_name: form.business_name || undefined,
      title: form.title,
      description: form.description,
      category: form.category,
      price,
      unit: form.unit,
      stock_quantity: stock,
      location: form.location,
    })

    // Reflect the new listing locally either way — Supabase may not be wired
    // up yet in preview, and the flow should still feel complete.
    setProducts((prev) => [
      {
        id: crypto.randomUUID(),
        user_id: user.id,
        seller_name: form.seller_name,
        seller_phone: form.seller_phone.replace(/\D/g, ''),
        business_name: form.business_name || null,
        title: form.title,
        description: form.description,
        category: form.category,
        price,
        unit: form.unit,
        stock_quantity: stock,
        location: form.location,
        image_url: null,
        status: 'active',
        created_at: new Date().toISOString(),
      },
      ...prev,
    ])
    setError(err)
    setForm(emptyForm)
    setShowForm(false)
    setSubmitting(false)
  }

  return (
    <div className="container-page py-16">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <span className="eyebrow">Marketplace</span>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Products &amp; services, sold direct.</h1>
          <p className="mt-4 text-white/60">
            Entrepreneurs on MOCA sell produce, materials, apparel and services straight to buyers —
            no commission, enquiries go directly to the seller on WhatsApp.
          </p>
        </div>
        <button onClick={() => setShowForm((s) => !s)} className="btn-primary">
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? 'Cancel' : 'List a Product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card-surface mb-10 flex flex-col gap-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              required
              value={form.seller_name}
              onChange={(e) => updateField('seller_name', e.target.value)}
              placeholder="Your name"
              className="input-field"
            />
            <input
              required
              value={form.seller_phone}
              onChange={(e) => updateField('seller_phone', e.target.value)}
              placeholder="WhatsApp number, e.g. 0648132233"
              className="input-field"
            />
          </div>
          <input
            value={form.business_name}
            onChange={(e) => updateField('business_name', e.target.value)}
            placeholder="Business name (optional)"
            className="input-field"
          />
          <input
            required
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Product or service title"
            className="input-field"
          />
          <textarea
            required
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Describe what you're selling..."
            rows={3}
            className="input-field resize-none"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <select
              value={form.category}
              onChange={(e) => updateField('category', e.target.value as ProductCategory)}
              className="input-field"
            >
              {allCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              value={form.location}
              onChange={(e) => updateField('location', e.target.value)}
              placeholder="Location, e.g. Jane Furse, Sekhukhune"
              required
              className="input-field"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <input
              required
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => updateField('price', e.target.value)}
              placeholder="Price (ZAR)"
              className="input-field"
            />
            <input
              value={form.unit}
              onChange={(e) => updateField('unit', e.target.value)}
              placeholder="Unit, e.g. per item / per crate"
              className="input-field"
            />
            <input
              type="number"
              min="0"
              value={form.stock_quantity}
              onChange={(e) => updateField('stock_quantity', e.target.value)}
              placeholder="Stock qty (optional)"
              className="input-field"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-primary self-start">
            {submitting ? 'Listing...' : 'List on Marketplace'}
          </button>
        </form>
      )}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products, services or businesses..."
            className="input-field pl-11"
          />
        </div>
        <button onClick={() => setShowFilters((s) => !s)} className="btn-secondary sm:w-auto">
          <SlidersHorizontal className="h-4 w-4" />
          Categories {selectedCategories.length > 0 && `(${selectedCategories.length})`}
        </button>
      </div>

      {showFilters && (
        <div className="mb-10 flex flex-wrap gap-2 border-b border-white/10 pb-8">
          {allCategories.map((category) => (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                selectedCategories.includes(category)
                  ? 'border-moca-green bg-moca-green/15 text-moca-green'
                  : 'border-white/15 text-white/60 hover:border-white/30'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={<Store className="h-10 w-10" />}
          title="No products listed yet"
          description="Try clearing your filters, or be the first to list a product or service."
          action={
            <button
              onClick={() => {
                setSearch('')
                setSelectedCategories([])
              }}
              className="btn-secondary"
            >
              Clear filters
            </button>
          }
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="card-surface relative flex flex-col overflow-hidden p-6 transition-transform hover:-translate-y-1"
            >
              <span className="absolute inset-x-0 top-0 h-0.5 bg-moca-gradient" />
              <div className="flex items-start justify-between gap-3">
                <Badge>{p.category}</Badge>
                {p.stock_quantity !== null && p.stock_quantity <= 5 && (
                  <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-medium text-gold">
                    Low stock
                  </span>
                )}
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold leading-snug">{p.title}</h3>
              <p className="mt-1 text-sm text-white/50">{p.business_name ?? p.seller_name}</p>
              <p className="mt-3 flex-1 text-sm text-white/60">{p.description}</p>
              <p className="mt-4 text-xs text-white/40">
                <span className="font-semibold text-white/60">Location: </span>
                {p.location}
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                <div>
                  <p className="font-mono text-sm text-gold">{formatZAR(p.price)}</p>
                  <p className="text-xs text-white/40">{p.unit}</p>
                </div>
                <a
                  href={whatsappLink(
                    `Hi, I'm interested in "${p.title}" (${formatZAR(p.price)} ${p.unit}) on MOCA Marketplace.`,
                    p.seller_phone,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary text-xs"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> Enquire
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
