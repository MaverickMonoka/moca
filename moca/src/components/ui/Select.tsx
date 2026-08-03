import { forwardRef } from 'react'
import type { SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select ref={ref} className={cn('input-field appearance-none', className)} {...props}>
      {children}
    </select>
  ),
)
Select.displayName = 'Select'
