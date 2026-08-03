import { useState } from 'react'
import { Users, FileText, BookOpen, BarChart3, Landmark, Plus } from 'lucide-react'

const tabs = [
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'funding', label: 'Funding Opportunities', icon: Landmark },
  { id: 'articles', label: 'Articles', icon: FileText },
  { id: 'courses', label: 'Courses', icon: BookOpen },
] as const

type TabId = (typeof tabs)[number]['id']

const stats = [
  { label: 'Registered users', value: '1,842' },
  { label: 'Active applications', value: '312' },
  { label: 'Funding published', value: 'R280M' },
  { label: 'Articles this month', value: '14' },
]

export default function Admin() {
  const [active, setActive] = useState<TabId>('analytics')

  return (
    <div className="container-page py-16">
      <div className="mb-10">
        <span className="eyebrow">Admin</span>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Platform control centre</h1>
      </div>

      <div className="mb-10 flex flex-wrap gap-2 border-b border-white/10 pb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
              active === t.id
                ? 'border-moca-green bg-moca-green/15 text-moca-green'
                : 'border-white/15 text-white/60 hover:border-white/30'
            }`}
          >
            <t.icon className="h-3.5 w-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {active === 'analytics' && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="card-surface p-6">
              <p className="text-xs text-white/50">{s.label}</p>
              <p className="mt-3 font-display text-3xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {active === 'users' && (
        <div className="card-surface p-6">
          <p className="text-sm text-white/50">
            User management connects to the <code className="text-moca-green">users</code> table.
            Search, view roles (entrepreneur / investor / admin), and suspend accounts here once
            connected to Supabase with an admin-scoped service key via a Netlify Function.
          </p>
        </div>
      )}

      {active === 'funding' && (
        <div className="flex flex-col gap-4">
          <button className="btn-primary w-fit">
            <Plus className="h-4 w-4" /> New Funding Opportunity
          </button>
          <div className="card-surface p-6">
            <p className="text-sm text-white/50">
              Create, edit and close listings in <code className="text-moca-green">funding_opportunities</code>.
              Set sector, amount range, eligibility, closing date and application link — publishes
              instantly to /funding.
            </p>
          </div>
        </div>
      )}

      {active === 'articles' && (
        <div className="flex flex-col gap-4">
          <button className="btn-primary w-fit">
            <Plus className="h-4 w-4" /> New Article
          </button>
          <div className="card-surface p-6">
            <p className="text-sm text-white/50">
              Draft and publish to <code className="text-moca-green">articles</code>. Supports
              category tagging, cover image upload via Supabase Storage, and scheduled publish dates.
            </p>
          </div>
        </div>
      )}

      {active === 'courses' && (
        <div className="flex flex-col gap-4">
          <button className="btn-primary w-fit">
            <Plus className="h-4 w-4" /> New Course
          </button>
          <div className="card-surface p-6">
            <p className="text-sm text-white/50">
              Upload lessons, set level and duration to <code className="text-moca-green">courses</code>.
              Course video/asset storage uses the Supabase Storage <code className="text-moca-green">course-media</code> bucket.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
