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
        bottom: '100%', 
        width: '40%', 
        height: '22.22%', 
        zIndex: 50,
      }}
      initial={{ bottom: '100%', opacity: 0 }}
      animate={{ 
        bottom: `${item.gridY * (100 / 18)}%`,
        opacity: 1 
      }}
      transition={{ 
        duration: 0.82, 
        ease: [0.16, 1, 0.3, 1],
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
              padding: '1px',
            }}
          >
            <div 
              className="tetris-block-jewel"
              style={{ 
                backgroundColor: color,
                background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                boxShadow: `0 0 35px ${color}55`
              }} 
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
