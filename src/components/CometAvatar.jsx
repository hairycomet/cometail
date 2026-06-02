import { motion } from 'framer-motion'

export default function CometAvatar({ size = 'large', equipped = [] }) {
  const isSmall = size === 'small'
  const hasCap = equipped.includes('golden_cap')
  const hasWizard = equipped.includes('wizard_hat')
  const hasCrown = equipped.includes('comet_crown')
  const hasHoodie = equipped.includes('star_hoodie')
  const hasCape = equipped.includes('galaxy_cape')
  const hasGlasses = equipped.includes('round_glasses')
  const hasSunglasses = equipped.includes('star_sunglasses')
  const hasRocket = equipped.includes('rocket')
  const hasBook = equipped.includes('english_book')
  const hasCoffee = equipped.includes('coffee')
  const hasFireTail = equipped.includes('fire_tail')
  const hasIceTail = equipped.includes('ice_tail')
  return (
    <motion.div
      className={`comet-avatar ${isSmall ? 'small' : ''} ${hasFireTail ? 'fire-tail' : ''} ${hasIceTail ? 'ice-tail' : ''}`}
      animate={{ y: [0, -8, 0], rotate: [0, 1.5, -1.5, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      aria-label="Cometail character"
    >
      <div className="avatar-glow" />
      <svg viewBox="0 0 280 280" role="img">
        <defs>
          <linearGradient id="tail" x1="18" x2="176" y1="164" y2="96" gradientUnits="userSpaceOnUse">
            <stop stopColor={hasIceTail ? '#bae6fd' : '#fde68a'} />
            <stop offset=".52" stopColor={hasFireTail ? '#ef4444' : hasIceTail ? '#38bdf8' : '#fb923c'} />
            <stop offset="1" stopColor="var(--primary)" />
          </linearGradient>
          <linearGradient id="body" x1="80" x2="211" y1="45" y2="216" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" />
            <stop offset="1" stopColor="#ede9fe" />
          </linearGradient>
        </defs>
        <path d="M29 176c58-5 105-30 139-74" stroke="url(#tail)" strokeWidth="32" strokeLinecap="round" />
        <path d="M34 203c48-8 82-26 112-57" stroke={hasIceTail ? '#7dd3fc' : '#fbbf24'} strokeWidth="14" strokeLinecap="round" opacity=".8" />
        {hasCape && <path d="M100 164c-20 44-4 82 62 92 54-8 78-38 67-90-31 23-87 25-129-2Z" fill="#312e81" opacity=".82" />}
        <ellipse cx="166" cy="136" rx="78" ry="83" fill="url(#body)" />
        {hasHoodie && <path d="M98 172c22 38 88 53 133 10 3 27-14 56-60 60-46 4-76-22-73-70Z" fill="var(--primary-dark)" opacity=".9" />}
        <circle cx="140" cy="132" r="9" fill="#312e81" />
        <circle cx="185" cy="132" r="9" fill="#312e81" />
        {hasGlasses && <g stroke="#111827" strokeWidth="5" fill="none"><circle cx="140" cy="132" r="18" /><circle cx="185" cy="132" r="18" /><path d="M158 132h9" /></g>}
        {hasSunglasses && <g fill="#111827"><path d="M121 121h38l-5 24h-26z" /><path d="M174 121h38l-7 24h-26z" /><path d="M158 130h17" stroke="#111827" strokeWidth="5" /></g>}
        <path d="M149 165c11 12 30 12 42 0" stroke="#312e81" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="119" cy="156" r="11" fill="#fecdd3" opacity=".85" />
        <circle cx="207" cy="156" r="11" fill="#fecdd3" opacity=".85" />
        {hasCap && <path d="M104 83c31-28 86-28 119 5l-13 21c-30-16-67-17-99-2L104 83Z" fill="#f59e0b" />}
        {hasCap && <path d="M95 105c42-15 88-14 129 2" stroke="#fde68a" strokeWidth="9" strokeLinecap="round" />}
        {hasWizard && <path d="M116 92l44-74 45 77c-30-13-60-14-89-3Z" fill="#6d28d9" />}
        {hasWizard && <circle cx="160" cy="55" r="7" fill="#fde68a" />}
        {hasCrown && <path d="M110 91l16-36 32 30 25-40 25 43 27-28-5 45c-42-17-80-18-120-1Z" fill="#facc15" stroke="#f59e0b" strokeWidth="4" />}
        {hasRocket && <g transform="translate(218 184)"><path d="M0 12c22-27 38-28 50-24-1 19-12 34-38 50z" fill="#ef4444"/><circle cx="27" cy="4" r="8" fill="#bfdbfe"/><path d="M4 28l-14 8 6-16z" fill="#f97316"/></g>}
        {hasBook && <g transform="translate(216 187)"><rect x="0" y="0" width="38" height="46" rx="6" fill="#2563eb"/><path d="M8 8h20M8 18h22" stroke="#fff" strokeWidth="4" strokeLinecap="round"/></g>}
        {hasCoffee && <g transform="translate(218 190)"><rect x="0" y="6" width="34" height="36" rx="9" fill="#fff7ed"/><path d="M34 16h9c8 3 5 18-4 18h-5" stroke="#92400e" strokeWidth="5" fill="none"/><path d="M8 0c-5-9 9-10 4-20" stroke="#d97706" strokeWidth="4" strokeLinecap="round"/></g>}
      </svg>
    </motion.div>
  )
}
