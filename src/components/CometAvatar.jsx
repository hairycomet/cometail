import { motion } from 'framer-motion'

export default function CometAvatar({ size = 'large', equipped = [], level = 1, preview = false }) {
  const isSmall = size === 'small'
  const tailCount = Math.min(5, Math.max(1, Math.floor(level / 10) + 1))
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
  const hasSoftAura = equipped.includes('soft_aura')
  const hasGalaxyAura = equipped.includes('galaxy_aura')
  const hasMoonCat = equipped.includes('moon_cat')
  const hasRocketPuppy = equipped.includes('rocket_puppy')
  const tails = Array.from({ length: tailCount }, (_, index) => index)

  return (
    <motion.div
      className={`comet-avatar ${isSmall ? 'small' : ''} ${preview ? 'preview' : ''} ${hasFireTail ? 'fire-tail' : ''} ${hasIceTail ? 'ice-tail' : ''} ${hasSoftAura ? 'soft-aura' : ''} ${hasGalaxyAura ? 'galaxy-aura' : ''}`}
      animate={{ y: [0, -8, 0], rotate: [0, 1.5, -1.5, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      aria-label="Cometail character"
    >
      <div className="avatar-glow" />
      {hasGalaxyAura && <div className="avatar-aura-ring" />}
      {hasSoftAura && <div className="avatar-aura-soft" />}
      {hasMoonCat && <div className="avatar-pet moon-cat">🐈‍⬛</div>}
      {hasRocketPuppy && <div className="avatar-pet rocket-puppy">🐶</div>}
      <svg viewBox="0 0 300 320" role="img">
        <defs>
          <linearGradient id={`tail-${size}`} x1="16" x2="175" y1="198" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor={hasIceTail ? '#bae6fd' : '#fde68a'} />
            <stop offset=".52" stopColor={hasFireTail ? '#ef4444' : hasIceTail ? '#38bdf8' : '#fb923c'} />
            <stop offset="1" stopColor="var(--primary)" />
          </linearGradient>
          <linearGradient id={`head-${size}`} x1="93" x2="216" y1="39" y2="174" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" />
            <stop offset="1" stopColor="#ede9fe" />
          </linearGradient>
          <linearGradient id={`body-${size}`} x1="110" x2="210" y1="170" y2="285" gradientUnits="userSpaceOnUse">
            <stop stopColor={hasHoodie ? 'var(--primary)' : '#f5f3ff'} />
            <stop offset="1" stopColor={hasHoodie ? 'var(--primary-dark)' : '#ddd6fe'} />
          </linearGradient>
        </defs>

        {tails.map(index => (
          <path
            key={index}
            d={`M${28 + index * 8} ${205 + index * 13}C${72 + index * 5} ${189 - index * 7} ${117 + index * 3} ${154 - index * 12} ${160 + index * 2} ${113 - index * 4}`}
            stroke={`url(#tail-${size})`}
            strokeWidth={index === 0 ? 28 : 12}
            strokeLinecap="round"
            opacity={1 - index * .11}
          />
        ))}

        {hasCape && <path d="M104 190c-28 54-4 99 68 110 62-10 90-50 72-110-36 31-96 32-140 0Z" fill="#312e81" opacity=".82" />}
        <ellipse cx="164" cy="229" rx="49" ry="63" fill={`url(#body-${size})`} />
        <path d="M122 219c-25 17-30 41-15 52" stroke="#ddd6fe" strokeWidth="16" strokeLinecap="round" />
        <path d="M204 219c25 17 30 41 15 52" stroke="#ddd6fe" strokeWidth="16" strokeLinecap="round" />
        <path d="M143 286c-8 15-6 25 8 27" stroke="#312e81" strokeWidth="13" strokeLinecap="round" opacity=".35" />
        <path d="M185 286c8 15 6 25-8 27" stroke="#312e81" strokeWidth="13" strokeLinecap="round" opacity=".35" />

        <ellipse cx="164" cy="130" rx="75" ry="78" fill={`url(#head-${size})`} />
        <circle cx="139" cy="127" r="8" fill="#312e81" />
        <circle cx="185" cy="127" r="8" fill="#312e81" />
        {hasGlasses && <g stroke="#111827" strokeWidth="5" fill="none"><circle cx="139" cy="127" r="18" /><circle cx="185" cy="127" r="18" /><path d="M157 127h10" /></g>}
        {hasSunglasses && <g fill="#111827"><path d="M120 117h38l-5 24h-26z" /><path d="M174 117h38l-7 24h-26z" /><path d="M158 126h16" stroke="#111827" strokeWidth="5" /></g>}
        <path d="M150 160c11 12 30 12 42 0" stroke="#312e81" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="119" cy="153" r="11" fill="#fecdd3" opacity=".85" />
        <circle cx="209" cy="153" r="11" fill="#fecdd3" opacity=".85" />

        {hasCap && <path d="M103 83c31-28 86-28 119 5l-13 21c-30-16-67-17-99-2L103 83Z" fill="#f59e0b" />}
        {hasCap && <path d="M94 105c42-15 88-14 129 2" stroke="#fde68a" strokeWidth="9" strokeLinecap="round" />}
        {hasWizard && <path d="M115 92l44-74 45 77c-30-13-60-14-89-3Z" fill="#6d28d9" />}
        {hasWizard && <circle cx="159" cy="55" r="7" fill="#fde68a" />}
        {hasCrown && <path d="M109 91l16-36 32 30 25-40 25 43 27-28-5 45c-42-17-80-18-120-1Z" fill="#facc15" stroke="#f59e0b" strokeWidth="4" />}
        {hasRocket && <g transform="translate(215 232)"><path d="M0 12c22-27 38-28 50-24-1 19-12 34-38 50z" fill="#ef4444"/><circle cx="27" cy="4" r="8" fill="#bfdbfe"/><path d="M4 28l-14 8 6-16z" fill="#f97316"/></g>}
        {hasBook && <g transform="translate(218 231)"><rect x="0" y="0" width="38" height="46" rx="6" fill="#2563eb"/><path d="M8 8h20M8 18h22" stroke="#fff" strokeWidth="4" strokeLinecap="round"/></g>}
        {hasCoffee && <g transform="translate(220 235)"><rect x="0" y="6" width="34" height="36" rx="9" fill="#fff7ed"/><path d="M34 16h9c8 3 5 18-4 18h-5" stroke="#92400e" strokeWidth="5" fill="none"/><path d="M8 0c-5-9 9-10 4-20" stroke="#d97706" strokeWidth="4" strokeLinecap="round"/></g>}
      </svg>
    </motion.div>
  )
}
