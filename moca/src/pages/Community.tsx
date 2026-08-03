import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { MessageCircle, Plus, X } from 'lucide-react'
import { getCommunityPosts, createCommunityPost } from '@/services/communityService'
import { useAuth } from '@/hooks/useAuth'
import { formatDate, initials } from '@/lib/utils'
import type { CommunityPost } from '@/types'
import { Skeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/Badge'

export default function Community() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [tag, setTag] = useState('General')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getCommunityPosts().then((data) => {
      setPosts(data)
      setLoading(false)
    })
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user) {
      setError('Log in to post in the community.')
      return
    }
    setSubmitting(true)
    setError(null)
    const { error: err } = await createCommunityPost(user.id, title, body, tag)
    if (err) {
      setError(err)
    } else {
      setPosts((prev) => [
        {
          id: crypto.randomUUID(),
          user_id: user.id,
          author_name: user.email ?? 'You',
          author_avatar: null,
          title,
          body,
          tag,
          replies_count: 0,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ])
      setTitle('')
      setBody('')
      setShowForm(false)
    }
    setSubmitting(false)
  }

  return (
    <div className="container-page py-16">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <span className="eyebrow">Community</span>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Founders helping founders.</h1>
          <p className="mt-4 text-white/60">
            Ask questions, share what worked, and network with entrepreneurs across South Africa.
          </p>
        </div>
        <button onClick={() => setShowForm((s) => !s)} className="btn-primary">
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? 'Cancel' : 'New Post'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card-surface mb-10 flex flex-col gap-4 p-6">
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
            className="input-field"
          />
          <textarea
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What's on your mind?"
            rows={4}
            className="input-field resize-none"
          />
          <select value={tag} onChange={(e) => setTag(e.target.value)} className="input-field">
            {['General', 'Agriculture', 'Construction', 'Technology', 'Funding Readiness', 'Tenders'].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-primary self-start">
            {submitting ? 'Posting...' : 'Post to Community'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((p) => (
            <div key={p.id} className="card-surface p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-moca-gradient text-sm font-semibold">
                  {initials(p.author_name)}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold">{p.author_name}</span>
                    <span className="text-xs text-white/30">· {formatDate(p.created_at)}</span>
                    <Badge>{p.tag}</Badge>
                  </div>
                  <h3 className="mt-2 font-display text-lg font-semibold">{p.title}</h3>
                  <p className="mt-1 text-sm text-white/60">{p.body}</p>
                  <div className="mt-3 flex items-center gap-1 text-xs text-white/40">
                    <MessageCircle className="h-3.5 w-3.5" /> {p.replies_count} replies
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
