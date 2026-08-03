import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'card-surface p-6 transition-colors hover:border-moca-green/40',
        className,
      )}
      {...props}
    />
  )
}
