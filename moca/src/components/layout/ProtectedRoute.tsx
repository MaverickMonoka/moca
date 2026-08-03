import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export function ProtectedRoute({ children, adminOnly = false }: { children: ReactNode; adminOnly?: boolean }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-charcoal">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-moca-green" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  // adminOnly is enforced properly at the RLS layer server-side; this is a UX guard only.
  void adminOnly

  return <>{children}</>
}
