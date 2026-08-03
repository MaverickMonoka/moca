import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'gold' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variantClass: Record<Variant, string> = {
  primary: 'bg-moca-gradient text-white shadow-glow-green hover:scale-[1.02]',
  secondary: 'border border-white/20 bg-white/5 text-white hover:bg-white/10',
  gold: 'bg-gold-gradient text-charcoal shadow-glow-gold hover:scale-[1.02]',
  ghost: 'text-white/70 hover:text-white hover:bg-white/5',
}

const sizeClass: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-transform active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...props}
    />
  ),
)
Button.displayName = 'Button'
