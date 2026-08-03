/**
 * MOCA mark — a single stylized "M", cut from one solid gold-yellow shape.
 * No container, no wordmark-in-a-box: just the letterform, classic pointed
 * style (center vertex meets the baseline), sized to sit inline next to
 * the "MOCA" type in the nav/footer, or alone as a favicon or app icon.
 */
export function Logo({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="moca-logo-gold" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFDE59" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
      </defs>
      <path
        d="M8,90 L8,10 L26,10 L50,90 L74,10 L92,10 L92,90 Z"
        fill="url(#moca-logo-gold)"
      />
    </svg>
  )
}
