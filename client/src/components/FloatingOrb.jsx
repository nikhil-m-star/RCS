import { motion } from 'framer-motion';
import { categoryColors } from '../lib/categories.js';

export function FloatingOrb({ category, index = 0 }) {
  const color = categoryColors[category] || '#a78bfa';

  // Semi-random positions around the cauldron
  const positions = [
    { x: -90, y: -50 },
    { x: 90, y: -40 },
    { x: -70, y: 35 },
    { x: 75, y: 45 },
    { x: -35, y: -80 },
    { x: 45, y: -70 },
  ];

  const pos = positions[index % positions.length];

  return (
    <motion.div
      className="absolute w-5 h-5 rounded-full"
      style={{
        background: `radial-gradient(circle, ${color}, ${color}40, transparent)`,
        boxShadow: `0 0 16px ${color}, 0 0 32px ${color}30`,
        left: `calc(50% + ${pos.x}px)`,
        top: `calc(50% + ${pos.y}px)`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        opacity: 1,
        y: [0, -10, 0, 6, 0],
        x: [0, 4, 0, -4, 0],
        scale: [0, 1, 1.05, 0.96, 1],
      }}
      transition={{
        scale: { duration: 3.4 + index * 0.25, repeat: Infinity, ease: 'easeInOut', delay: 0.5 + index * 0.15 },
        opacity: { delay: 0.5 + index * 0.15, duration: 0.4 },
        y: { duration: 3 + index * 0.4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.2 },
        x: { duration: 4 + index * 0.3, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 },
      }}
    />
  );
}
