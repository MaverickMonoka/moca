import type { ReactNode } from 'react'

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 py-16 px-6 text-center">
      {icon && <div className="mb-4 text-white/30">{icon}</div>}
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-white/50">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
