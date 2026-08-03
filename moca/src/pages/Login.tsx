import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error: err } = await signIn(email, password)
    setLoading(false)
    if (err) setError(err)
    else navigate('/dashboard')
  }

  return (
    <div className="container-page flex min-h-[80vh] items-center justify-center py-16">
      <div className="card-surface w-full max-w-md p-8">
        <h1 className="font-display text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-white/50">Log in to your MOCA dashboard.</p>
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
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
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary mt-2 w-full">
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-white/50">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-moca-green hover:text-moca-green-light">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
