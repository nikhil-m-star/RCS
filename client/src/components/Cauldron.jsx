import { motion } from 'framer-motion';

export function Cauldron({ score = 0 }) {
  const fillPercent = Math.min(Math.max(score, 0), 100);
  // Liquid area: from y=195 (bottom) to y=90 (near rim)
  // Total usable height = 105px
  const liquidHeight = (fillPercent / 100) * 105;
  const liquidY = 195 - liquidHeight;

  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Glow behind cauldron */}
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-30"
        style={{
          background: `radial-gradient(circle, rgba(124,58,237,${0.1 + fillPercent * 0.004}) 0%, transparent 70%)`,
        }}
      />

      <svg viewBox="0 0 240 240" className="w-full h-full relative z-10">
        <defs>
          <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.95" />
          </linearGradient>
          <clipPath id="cauldronInterior">
            <path d="M62,90 Q56,200 120,208 Q184,200 178,90 Z" />
          </clipPath>
          <filter id="cauldronGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="roughEdge">
            <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
          </filter>
        </defs>

        {/* Legs */}
        <path d="M78,208 L68,232" stroke="#7c3aed" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
        <path d="M162,208 L172,232" stroke="#7c3aed" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
        <path d="M120,212 L120,232" stroke="#7c3aed" strokeWidth="4" strokeLinecap="round" opacity="0.7" />

        {/* Cauldron body */}
        <path
          d="M52,88 Q46,205 120,212 Q194,205 188,88"
          fill="#12121a"
          stroke="#7c3aed"
          strokeWidth="3"
          filter="url(#cauldronGlow)"
        />

        {/* Liquid fill */}
        <motion.rect
          x="52"
          width="136"
          height="130"
          fill="url(#liquidGrad)"
          clipPath="url(#cauldronInterior)"
          initial={{ y: 210 }}
          animate={{ y: liquidY }}
          transition={{ type: 'spring', damping: 15, stiffness: 60 }}
        />

        {/* Liquid surface wave */}
        {fillPercent > 5 && (
          <motion.path
            fill="none"
            stroke="#c4b5fd"
            strokeWidth="2"
            strokeOpacity="0.5"
            clipPath="url(#cauldronInterior)"
            animate={{
              d: [
                `M65,${liquidY + 82} Q90,${liquidY + 76} 120,${liquidY + 82} Q150,${liquidY + 88} 175,${liquidY + 82}`,
                `M65,${liquidY + 82} Q90,${liquidY + 88} 120,${liquidY + 82} Q150,${liquidY + 76} 175,${liquidY + 82}`,
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          />
        )}

        {/* Bubbles */}
        {fillPercent > 10 && (
          <>
            <motion.circle
              cx="100" r="4" fill="#a78bfa" opacity="0.5"
              clipPath="url(#cauldronInterior)"
              animate={{ cy: [200, liquidY + 85], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0 }}
            />
            <motion.circle
              cx="140" r="3" fill="#c4b5fd" opacity="0.4"
              clipPath="url(#cauldronInterior)"
              animate={{ cy: [195, liquidY + 85], opacity: [0.4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: 0.7 }}
            />
            <motion.circle
              cx="120" r="5" fill="#a78bfa" opacity="0.6"
              clipPath="url(#cauldronInterior)"
              animate={{ cy: [205, liquidY + 85], opacity: [0.6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 1.3 }}
            />
            <motion.circle
              cx="90" r="2.5" fill="#c4b5fd" opacity="0.3"
              clipPath="url(#cauldronInterior)"
              animate={{ cy: [198, liquidY + 85], opacity: [0.3, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: 0.4 }}
            />
          </>
        )}

        {/* Cauldron rim */}
        <ellipse
          cx="120" cy="86" rx="76" ry="13"
          fill="#1a1a2e"
          stroke="#7c3aed"
          strokeWidth="3"
          filter="url(#cauldronGlow)"
        />

        {/* Handles */}
        <path
          d="M52,108 Q32,108 36,128 Q40,148 56,143"
          fill="none" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round"
        />
        <path
          d="M188,108 Q208,108 204,128 Q200,148 184,143"
          fill="none" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round"
        />

        {/* Steam wisps */}
        {fillPercent > 20 && (
          <>
            <motion.path
              d="M100,72 Q96,58 104,48"
              fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round"
              animate={{ opacity: [0.3, 0.08, 0.3], y: [0, -6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity }}
            />
            <motion.path
              d="M132,68 Q138,52 128,42"
              fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round"
              animate={{ opacity: [0.2, 0.05, 0.2], y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, delay: 1.2 }}
            />
            <motion.path
              d="M115,70 Q110,55 118,44"
              fill="none" stroke="#c4b5fd" strokeWidth="1" strokeLinecap="round"
              animate={{ opacity: [0.15, 0.03, 0.15], y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 2 }}
            />
          </>
        )}
      </svg>
    </div>
  );
}
