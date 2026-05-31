import { motion } from 'framer-motion';

const SKIN_TONES = ['#FAEEDA', '#F5D5A8', '#D4956A', '#A0614B'];
const BODY_COLORS = {
  default: '#7F77DD',
  red: '#E24B4A',
  blue: '#378ADD',
  green: '#1D9E75',
  pink: '#D4537E',
  orange: '#EF9F27',
};
const HAT_COLORS = {
  default: '#534AB7',
  grad: '#3B6D11',
  crown: '#BA7517',
  none: null,
};

export default function MiniMe({ equipped = {}, size = 90, animate = true }) {
  const skin = SKIN_TONES[equipped.skinTone || 0];
  const bodyColor = BODY_COLORS[equipped.bodyColor || 'default'];
  const hatType = equipped.hat || 'default';
  const scale = size / 110;

  return (
    <motion.div
      animate={animate ? { y: [0, -5, 0] } : {}}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{ display: 'inline-block' }}
    >
      <svg
        width={size}
        height={size * 1.1}
        viewBox="0 0 90 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shadow */}
        <ellipse cx="45" cy="106" rx="22" ry="4" fill="rgba(0,0,0,0.1)" />

        {/* Legs */}
        <rect x="30" y="72" width="12" height="30" rx="6" fill={bodyColor} />
        <rect x="48" y="72" width="12" height="30" rx="6" fill={bodyColor} />

        {/* Shoes */}
        <ellipse cx="36" cy="102" rx="8" ry="4" fill={equipped.shoes === 'fancy' ? '#E24B4A' : '#3C3489'} />
        <ellipse cx="54" cy="102" rx="8" ry="4" fill={equipped.shoes === 'fancy' ? '#E24B4A' : '#3C3489'} />

        {/* Body */}
        <rect x="27" y="36" width="36" height="42" rx="14" fill={bodyColor} />

        {/* Arms */}
        <rect x="13" y="38" width="14" height="26" rx="7" fill={bodyColor} />
        <rect x="63" y="38" width="14" height="26" rx="7" fill={bodyColor} />

        {/* Hands */}
        <ellipse cx="20" cy="64" rx="7" ry="6" fill={skin} />
        <ellipse cx="70" cy="64" rx="7" ry="6" fill={skin} />

        {/* Neck */}
        <rect x="40" y="34" width="10" height="8" fill={skin} />

        {/* Head */}
        <ellipse cx="45" cy="24" rx="20" ry="20" fill={skin} />

        {/* Eyes */}
        <ellipse cx="37.5" cy="25" rx="3.5" ry="4" fill="#26215C" />
        <ellipse cx="52.5" cy="25" rx="3.5" ry="4" fill="#26215C" />

        {/* Eye shine */}
        <ellipse cx="36" cy="23" rx="1.2" ry="1.2" fill="white" />
        <ellipse cx="51" cy="23" rx="1.2" ry="1.2" fill="white" />

        {/* Smile */}
        <path d="M38 33 Q45 39 52 33" stroke="#26215C" strokeWidth="1.8" strokeLinecap="round" fill="none" />

        {/* Cheeks */}
        <ellipse cx="31" cy="30" rx="4" ry="2.5" fill="rgba(255,150,150,0.3)" />
        <ellipse cx="59" cy="30" rx="4" ry="2.5" fill="rgba(255,150,150,0.3)" />

        {/* Hat */}
        {hatType === 'default' && (
          <>
            <rect x="33" y="5" width="24" height="14" rx="7" fill="#534AB7" />
            <rect x="38" y="0" width="5" height="8" rx="2.5" fill="#534AB7" />
            <rect x="47" y="0" width="5" height="8" rx="2.5" fill="#534AB7" />
          </>
        )}
        {hatType === 'grad' && (
          <>
            <rect x="28" y="6" width="34" height="6" rx="3" fill="#3B6D11" />
            <rect x="33" y="1" width="24" height="8" rx="4" fill="#3B6D11" />
            <rect x="54" y="4" width="16" height="3" rx="1.5" fill="#BA7517" />
          </>
        )}
        {hatType === 'crown' && (
          <>
            <rect x="30" y="7" width="30" height="8" rx="2" fill="#BA7517" />
            <rect x="30" y="3" width="4" height="7" rx="2" fill="#BA7517" />
            <rect x="41" y="1" width="4" height="9" rx="2" fill="#BA7517" />
            <rect x="52" y="3" width="4" height="7" rx="2" fill="#BA7517" />
            <ellipse cx="32" cy="3" rx="2" ry="2" fill="#EF9F27" />
            <ellipse cx="43" cy="1" rx="2" ry="2" fill="#EF9F27" />
            <ellipse cx="54" cy="3" rx="2" ry="2" fill="#EF9F27" />
          </>
        )}
        {hatType === 'ribbon' && (
          <>
            <ellipse cx="45" cy="9" rx="14" ry="5" fill="#D4537E" />
            <path d="M31 7 L45 12 L59 7 L45 4 Z" fill="#D4537E" />
          </>
        )}

        {/* Accessory */}
        {equipped.accessory === 'star' && (
          <text x="62" y="20" fontSize="12" fill="#EF9F27">⭐</text>
        )}
        {equipped.accessory === 'sparkle' && (
          <text x="0" y="20" fontSize="12" fill="#AFA9EC">✨</text>
        )}
      </svg>
    </motion.div>
  );
}
