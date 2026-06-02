import { motion } from 'framer-motion'

export default function CometAvatar({ size = 'large', equipped = [] }) {
  const isSmall = size === 'small'
  const hasCap = equipped.includes('golden_cap')
  const hasHoodie = equipped.includes('star_hoodie')
  return (
    <motion.div
      className={`comet-avatar ${isSmall ? 'small' : ''}`}
      animate={{ y: [0, -8, 0], rotate: [0, 1.5, -1.5, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      aria-label="Cometail character"
    >
      <div className="avatar-glow" />
      <svg viewBox="0 0 280 280" role="img">
        <defs>
          <linearGradient id="tail" x1="18" x2="176" y1="164" y2="96" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fde68a" />
            <stop offset=".52" stopColor="#fb923c" />
            <stop offset="1" stopColor="#a78bfa" />
          </linearGradient>
          <linearGradient id="body" x1="80" x2="211" y1="45" y2="216" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" />
            <stop offset="1" stopColor="#ede9fe" />
          </linearGradient>
        </defs>
        <path d="M29 176c58-5 105-30 139-74" stroke="url(#tail)" strokeWidth="32" strokeLinecap="round" />
        <path d="M34 203c48-8 82-26 112-57" stroke="#fbbf24" strokeWidth="14" strokeLinecap="round" opacity=".8" />
        <ellipse cx="166" cy="136" rx="78" ry="83" fill="url(#body)" />
        {hasHoodie && <path d="M98 172c22 38 88 53 133 10 3 27-14 56-60 60-46 4-76-22-73-70Z" fill="#6d28d9" opacity=".9" />}
        <circle cx="140" cy="132" r="9" fill="#312e81" />
        <circle cx="185" cy="132" r="9" fill="#312e81" />
        <path d="M149 165c11 12 30 12 42 0" stroke="#312e81" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="119" cy="156" r="11" fill="#fecdd3" opacity=".85" />
        <circle cx="207" cy="156" r="11" fill="#fecdd3" opacity=".85" />
        {hasCap && <path d="M104 83c31-28 86-28 119 5l-13 21c-30-16-67-17-99-2L104 83Z" fill="#f59e0b" />}
        {hasCap && <path d="M95 105c42-15 88-14 129 2" stroke="#fde68a" strokeWidth="9" strokeLinecap="round" />}
      </svg>
    </motion.div>
  )
}
