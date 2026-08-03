import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'entrepreneur' | 'investor'>('entrepreneur')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    setError(null)
    const { error: err } = await signUp(email, password, fullName)
    setLoading(false)
    if (err) setError(err)
    else navigate('/dashboard')
  }

  return (
    <div className="container-page flex min-h-[80vh] items-center justify-center py-16">
      <div className="card-surface w-full max-w-md p-8">
        <h1 className="font-display text-2xl font-bold">Join MOCA</h1>
        <p className="mt-1 text-sm text-white/50">Start finding funding in minutes.</p>

        <div className="mt-6 grid grid-cols-2 gap-2">
          {(['entrepreneur', 'investor'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`rounded-xl border px-4 py-2.5 text-sm font-medium capitalize transition-colors ${
                role === r
                  ? 'border-moca-green bg-moca-green/15 text-moca-green'
                  : 'border-white/15 text-white/60 hover:border-white/30'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/60">Full name</label>
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input-field"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/60">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@business.co.za"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/60">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="At least 8 characters"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary mt-2 w-full">
            {loading ? 'Creating account...' : `Create ${role} account`}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-white/50">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-moca-green hover:text-moca-green-light">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
