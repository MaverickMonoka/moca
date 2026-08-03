import { useEffect, useMemo, useState } from 'react'
import { Clock, PlayCircle, GraduationCap } from 'lucide-react'
import { getCourses } from '@/services/coursesService'
import type { Course } from '@/types'
import { Skeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/Badge'

const levelColor: Record<Course['level'], string> = {
  Beginner: 'text-moca-green',
  Intermediate: 'text-gold',
  Advanced: 'text-white/70',
}

export default function Academy() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    getCourses().then((data) => {
      setCourses(data)
      setLoading(false)
    })
  }, [])

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(courses.map((c) => c.category)))],
    [courses],
  )
  const filtered = activeCategory === 'All' ? courses : courses.filter((c) => c.category === activeCategory)

  return (
    <div className="container-page py-16">
      <div className="mb-10 max-w-2xl">
        <span className="eyebrow">Learning Academy</span>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Build the skills funders look for.</h1>
        <p className="mt-4 text-white/60">
          Every course on MOCA is free — practical, plain-language lessons covering everything from
          registration to tenders, designed for South African entrepreneurs.
        </p>
      </div>

      {!loading && categories.length > 2 && (
        <div className="mb-10 flex flex-wrap gap-2 border-b border-white/10 pb-8">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                activeCategory === c
                  ? 'border-moca-green bg-moca-green/15 text-moca-green'
                  : 'border-white/15 text-white/60 hover:border-white/30'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <div key={c.id} className="card-surface flex flex-col p-6 transition-transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <GraduationCap className="h-6 w-6 text-moca-green" />
                <div className="flex items-center gap-2">
                  <Badge className={levelColor[c.level]}>{c.level}</Badge>
                  {c.price === 0 && (
                    <span className="rounded-full bg-moca-green/15 px-3 py-1 text-xs font-semibold text-moca-green">
                      Free
                    </span>
                  )}
                </div>
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold">{c.title}</h3>
              <p className="mt-2 flex-1 text-sm text-white/50">{c.description}</p>
              <div className="mt-5 flex items-center gap-4 border-t border-white/10 pt-4 text-xs text-white/40">
                <span className="flex items-center gap-1">
                  <PlayCircle className="h-3.5 w-3.5" /> {c.lessons_count} lessons
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {Math.round(c.duration_minutes / 60)}h {c.duration_minutes % 60}m
                </span>
              </div>
              <button className="btn-primary mt-5 w-full">
                {c.price === 0 ? 'Start Free Course' : 'Enroll'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
