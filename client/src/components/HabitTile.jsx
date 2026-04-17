import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CategoryIcon } from './CategoryIcons';
import { categoryColors } from '../lib/categories.js';

export function HabitTile({ category, onLog, delay = 0, isLogged = false }) {
  const color = categoryColors[category] || '#a78bfa';
  const initialRotate = ((category.charCodeAt(0) + delay * 100) % 20) - 10;
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchVector, setLaunchVector] = useState({ x: 0, y: 0 });
  const tileRef = useRef(null);

  const handleClick = async () => {
    if (isLogged || isLaunching) {
      return;
    }

    const rect = tileRef.current?.getBoundingClientRect();
    if (rect) {
      const tileCenterX = rect.left + rect.width / 2;
      const tileCenterY = rect.top + rect.height / 2;
      const targetX = window.innerWidth / 2;
      const targetY = Math.max(132, window.innerHeight * 0.34);

      setLaunchVector({
        x: targetX - tileCenterX,
        y: targetY - tileCenterY,
      });
    }

    setIsLaunching(true);
    await new Promise((resolve) => window.setTimeout(resolve, 70));
    await onLog(category);
    window.setTimeout(() => setIsLaunching(false), 550);
  };

  return (
    <motion.button
      ref={tileRef}
      className={`habit-tile ${isLaunching ? 'launching' : ''}`.trim()}
      style={{
        background: isLogged ? `${color}18` : 'linear-gradient(180deg, rgba(26,26,38,0.98), rgba(18,18,26,0.98))',
        borderColor: isLogged ? color : '#7c3aed40',
        color: isLogged ? color : '#a78bfa',
      }}
      initial={{ y: '-120vh', opacity: 0, rotate: initialRotate }}
      animate={{
        opacity: isLaunching ? 0.18 : 1,
        rotate: isLaunching ? -14 : 0,
        scale: isLaunching ? 0.36 : 1,
        x: isLaunching ? launchVector.x : 0,
        y: isLaunching ? launchVector.y : 0,
        boxShadow: isLaunching
          ? `0 0 45px ${color}80, inset 0 0 34px ${color}18`
          : isLogged
          ? `0 0 30px ${color}40, inset 0 0 30px ${color}10`
          : '0 14px 34px rgba(0, 0, 0, 0.35)',
      }}
      transition={{
        type: isLaunching ? 'tween' : 'spring',
        ease: isLaunching ? [0.22, 1, 0.36, 1] : undefined,
        duration: isLaunching ? 0.52 : undefined,
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
      onClick={handleClick}
      disabled={isLaunching}
    >
      <div
        className="habit-tile-overlay"
        style={{
          background: `radial-gradient(circle at 30% 22%, ${color}28, transparent 38%), linear-gradient(180deg, transparent, rgba(255,255,255,0.02))`,
        }}
      />
      <div
        className="habit-tile-inner-border"
        style={{
          boxShadow: `inset 0 0 22px ${color}12`,
        }}
      />
      <div className="flex-center flex-column" style={{ position: 'relative', zIndex: 10, gap: '0.75rem' }}>
        <CategoryIcon category={category} size={36} />
        <span className="text-xs font-bold capitalize tracking-[0.14em] opacity-80">
          {category}
        </span>
      </div>

      {/* Logged glow pulse */}
      {(isLogged || isLaunching) && (
        <motion.div
          className="habit-tile-glow"
          style={{ background: `radial-gradient(circle, ${color}20, transparent)` }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}
