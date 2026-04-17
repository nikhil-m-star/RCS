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
        width: '40%',
        height: 'calc(4 * (100% / 18))',
        zIndex: 50,
      }}
      initial={{ y: -400, opacity: 0 }}
      animate={{ 
        y: 650 - (item.gridY * (100 / 18) * 5), // Rough approximation for falling to floor
        opacity: 1 
      }}
      transition={{ 
        duration: 0.8, 
        ease: [0.45, 0, 0.55, 1],
      }}
      onAnimationComplete={() => {
        if (onSettle) onSettle(item);
      }}
    >
      <div className="relative w-full h-full">
        {blocks.map((b, i) => (
          <div
            key={i}
            className="absolute rounded-[2px]"
            style={{
              left: `${b.x * 25}%`,
              bottom: `${b.y * 25}%`,
              width: '25%',
              height: '25%',
              background: color,
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: `0 0 20px ${color}66`,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
