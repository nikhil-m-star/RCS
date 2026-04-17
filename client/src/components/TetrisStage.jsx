import { motion } from 'framer-motion';
import { categoryColors } from '../lib/categories';

const GRID_ROWS = 18;
const GRID_COLS = 10;
const SHAPE_UNIT = 4; // Each shape container is 4x4 internal units

export function TetrisStage({ score = 0, habits = [] }) {
  // Process all habits into positioned shapes
  // 1st habit in the array is the newest (falling)
  // Subsequent habits are settled
  const shapes = getShapesFromHabits(habits);
  
  const fallingItem = shapes.length > 0 ? shapes[0] : null;
  const settledItems = shapes.length > 1 ? shapes.slice(1) : [];

  return (
    <div className="tetris-panel">
      <div className="flex-between mb-4">
        <div>
          <div className="text-label">Eco Grid</div>
          <div className="text-3xl font-bold mt-1 tracking-tight" style={{ color: '#a78bfa' }}>
            {score}
          </div>
        </div>
        <div className="text-right">
          <div className="text-label">Stability</div>
          <div className="text-sm font-semibold mt-1 opacity-60">Verified</div>
        </div>
      </div>

      <div className="tetris-stage">
        {/* Grid Background/Overlay */}
        <div className="tetris-grid-line" />
        
        {/* Settled Shapes */}
        {settledItems.map((item, idx) => (
          <TetrisShape key={`${item.id}-${idx}`} item={item} isFalling={false} />
        ))}

        {/* Falling Shape (Newest Habit) */}
        {fallingItem && (
          <TetrisShape 
            key={fallingItem.id} 
            item={fallingItem} 
            isFalling={true} 
          />
        )}
      </div>
    </div>
  );
}

function TetrisShape({ item, isFalling }) {
  const color = categoryColors[item.category] || '#a78bfa';
  const blocks = getBlocksForCategory(item.category);

  // Position calculation
  const left = `${item.gridX * 10}%`;
  const finalBottom = `${item.gridY * (100 / GRID_ROWS)}%`;
  
  return (
    <motion.div
      className="absolute"
      style={{
        left,
        bottom: isFalling ? '100%' : finalBottom,
        width: '40%', // 4 units out of 10
        height: `${(4 / GRID_ROWS) * 100}%`, // 4 units out of 18
        zIndex: isFalling ? 50 : 25,
      }}
      initial={isFalling ? { bottom: '100%', opacity: 0 } : false}
      animate={{ 
        bottom: finalBottom,
        opacity: 1 
      }}
      transition={isFalling ? { 
        duration: 0.8, 
        ease: [0.34, 1.56, 0.64, 1] // Bouncy fall
      } : {}}
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
              padding: '1.5px', // Gap between jewel blocks
            }}
          >
            <div 
              className="tetris-block-jewel"
              style={{ 
                backgroundColor: color,
                background: `linear-gradient(135deg, ${color}, ${color}cc)`,
              }} 
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function getShapesFromHabits(habits) {
  const colHeights = [0, 0, 0];
  const colX = [0, 3, 6];

  // Oldest first for height calculation
  return [...habits].reverse().map((h) => {
    const colIdx = h.category.length % 3;
    const gridX = colX[colIdx];
    const gridY = colHeights[colIdx];
    
    colHeights[colIdx] += 2.5; // Average block height contribution

    return {
      ...h,
      gridX,
      gridY,
    };
  }).reverse(); // Newest back to top
}

export function getBlocksForCategory(category) {
  switch (category) {
    case 'transport': // T
      return [{x:1,y:1}, {x:0,y:1}, {x:2,y:1}, {x:1,y:2}];
    case 'water': // Z-shape
      return [{x:0,y:1}, {x:1,y:1}, {x:1,y:2}, {x:2,y:2}];
    case 'energy': // L-shape
      return [{x:1,y:0}, {x:1,y:1}, {x:1,y:2}, {x:2,y:2}];
    case 'food': // O (Square)
      return [{x:1,y:1}, {x:2,y:1}, {x:1,y:2}, {x:2,y:2}];
    case 'nature': // S-shape
      return [{x:1,y:1}, {x:2,y:1}, {x:0,y:2}, {x:1,y:2}];
    case 'waste': // Line (I-ish)
      return [{x:1,y:0}, {x:1,y:1}, {x:1,y:2}, {x:1,y:3}];
    default:
      return [{x:1,y:1}, {x:2,y:1}, {x:1,y:2}, {x:2,y:2}];
  }
}
