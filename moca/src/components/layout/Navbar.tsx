import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/common/Logo'

const links = [
  { to: '/funding', label: 'Funding' },
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/insights', label: 'Insights' },
  { to: '/academy', label: 'Academy' },
  { to: '/community', label: 'Community' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-charcoal/80 backdrop-blur-lg">
      <nav className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight">
          <Logo className="h-7 w-7" />
          MOCA
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  'text-sm font-medium text-white/70 transition-colors hover:text-white',
                  isActive && 'text-white',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <Link to="/dashboard" className="btn-secondary text-sm">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-white/70 hover:text-white">
                Log in
              </Link>
              <Link to="/signup" className="btn-primary">
                Get Started <ArrowUpRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 px-6 pb-6 md:hidden">
          <div className="flex flex-col gap-4 pt-4">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-white/70"
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mt-2 flex flex-col gap-3">
              {user ? (
                <Link to="/dashboard" onClick={() => setOpen(false)} className="btn-secondary w-full">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="btn-secondary w-full">
                    Log in
                  </Link>
                  <Link to="/signup" onClick={() => setOpen(false)} className="btn-primary w-full">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
