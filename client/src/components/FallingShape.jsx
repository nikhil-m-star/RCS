import { motion } from 'framer-motion';
import { categoryColors } from '../lib/categories';
import { getBlocksForCategory } from './TetrisStage';

export function FallingShape({ item, onSettle }) {
  const color = categoryColors[item.category] || '#a78bfa';
  const blocks = getBlocksForCategory(item.category);

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${item.gridX * 10}%`,
        bottom: `${item.gridY * (100 / 18)}%`,
        width: '40%',
        height: 'calc(4 * (100% / 18))',
        zIndex: 50,
      }}
      initial={{ y: -600, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        duration: 0.65, 
        ease: [0.16, 1, 0.3, 1], // Custom bounce-out feel
      }}
      onAnimationComplete={() => {
        if (onSettle) onSettle(item);
      }}
    >
      <div className="relative w-full h-full">
        {blocks.map((b, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${b.x * 25}%`,
              bottom: `${b.y * 25}%`,
              width: '25%',
              height: '25%',
              background: color,
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '2px',
              boxShadow: `inset 2px 2px 0 rgba(255,255,255,0.4), inset -2px -2px 0 rgba(0,0,0,0.3), 0 0 25px ${color}66`,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
