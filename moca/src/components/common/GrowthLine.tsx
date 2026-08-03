/**
 * Signature hero motif: an ascending capital-growth line, drawn once on
 * mount, with markers at points that echo the platform's real milestones
 * (first funding match, first disbursement, scale). Ties the abstract
 * "BUILD. FUND. GROW." headline to something literal from the subject's
 * own world — a funding curve — rather than a decorative gradient blob.
 */
export function GrowthLine() {
  return (
    <svg
      viewBox="0 0 1200 360"
      fill="none"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[280px] w-full opacity-[0.55] sm:h-[360px]"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="growth-stroke" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00A651" stopOpacity="0.15" />
          <stop offset="55%" stopColor="#00A651" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="growth-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00A651" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#00A651" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path
        d="M0,320 C120,310 180,300 260,285 C340,270 380,250 460,235 C540,220 580,190 660,175 C740,160 800,150 880,120 C960,90 1020,95 1100,55 C1150,30 1180,20 1200,10 L1200,360 L0,360 Z"
        fill="url(#growth-fill)"
      />
      <path
        d="M0,320 C120,310 180,300 260,285 C340,270 380,250 460,235 C540,220 580,190 660,175 C740,160 800,150 880,120 C960,90 1020,95 1100,55 C1150,30 1180,20 1200,10"
        stroke="url(#growth-stroke)"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="animate-draw-line"
        pathLength={1}
      />

      {/* Milestone markers */}
      <circle cx="260" cy="285" r="4" fill="#00A651" />
      <circle cx="660" cy="175" r="4" fill="#00A651" />
      <circle cx="1100" cy="55" r="5" fill="#D4AF37" />
    </svg>
  )
}
