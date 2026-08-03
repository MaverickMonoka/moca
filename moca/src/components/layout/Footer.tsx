import { Link } from 'react-router-dom'
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'
import { Logo } from '@/components/common/Logo'

const columns = [
  {
    title: 'Platform',
    links: [
      { to: '/funding', label: 'Funding Marketplace' },
      { to: '/insights', label: 'MOCA Insights' },
      { to: '/academy', label: 'Learning Academy' },
      { to: '/community', label: 'Community' },
    ],
  },
  {
    title: 'For',
    links: [
      { to: '/signup', label: 'Entrepreneurs' },
      { to: '/signup', label: 'Investors' },
      { to: '/academy', label: 'Youth & Students' },
      { to: '/funding', label: 'Farmers' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/', label: 'About MOCA' },
      { to: '/', label: 'Mobicom Business Solutions' },
      { to: '/', label: 'Contact' },
      { to: '/', label: 'Careers' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-charcoal-light">
      <div className="container-page py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
              <Logo className="h-7 w-7" />
              MOCA
            </Link>
            <p className="mt-4 max-w-xs text-sm text-white/50">
              Mobicom Opportunity &amp; Capital Access — Africa's intelligent platform for entrepreneurs.
              Built by Mobicom Business Solutions.
            </p>
            <div className="mt-6 flex gap-4 text-white/40">
              <Facebook className="h-5 w-5 hover:text-white transition-colors" />
              <Instagram className="h-5 w-5 hover:text-white transition-colors" />
              <Twitter className="h-5 w-5 hover:text-white transition-colors" />
              <Linkedin className="h-5 w-5 hover:text-white transition-colors" />
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="eyebrow mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l, i) => (
                  <li key={i}>
                    <Link to={l.to} className="text-sm text-white/60 hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Mobicom Business Solutions (Pty) Ltd. All rights reserved.</p>
          <p>Reg. 2016/207169/23 · Sekhukhune District, Limpopo, South Africa</p>
        </div>
      </div>
    </footer>
  )
}
