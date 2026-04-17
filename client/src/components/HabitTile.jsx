import { motion } from 'framer-motion';
import { CategoryIcon } from './CategoryIcons';
import { categoryColors } from '../lib/categories.js';

export function HabitTile({ category, onLog, delay = 0, isLogged = false }) {
  const color = categoryColors[category] || '#a78bfa';
  const initialRotate = ((category.charCodeAt(0) + delay * 100) % 20) - 10;

  return (
    <motion.button
      className="relative w-full aspect-square rounded-2xl border-2 flex items-center justify-center cursor-pointer overflow-hidden"
      style={{
        background: isLogged ? `${color}15` : '#12121a',
        borderColor: isLogged ? color : '#7c3aed40',
        color: isLogged ? color : '#a78bfa',
      }}
      initial={{ y: '-120vh', opacity: 0, rotate: initialRotate }}
      animate={{
        y: 0,
        opacity: 1,
        rotate: 0,
        boxShadow: isLogged
          ? `0 0 30px ${color}40, inset 0 0 30px ${color}10`
          : '0 0 0px transparent',
      }}
      transition={{
        type: 'spring',
        damping: 12,
        stiffness: 80,
        delay: delay,
      }}
      whileHover={{
        scale: 1.08,
        boxShadow: `0 0 25px ${color}50`,
        borderColor: color,
      }}
      whileTap={{ scale: 0.88 }}
      onClick={() => !isLogged && onLog(category)}
      disabled={isLogged}
    >
      <CategoryIcon category={category} size={40} />

      {/* Logged glow pulse */}
      {isLogged && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{ background: `radial-gradient(circle, ${color}20, transparent)` }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}
