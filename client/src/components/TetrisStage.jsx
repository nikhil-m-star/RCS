import { motion } from 'framer-motion';
import { categoryColors } from '../lib/categories';

export function TetrisStage({ score = 0, items = [] }) {
  // 10x18 grid
  const rows = 18;
  const cols = 10;

  return (
    <div className="tetris-panel">
      <div className="flex-between mb-4">
        <div>
          <div className="text-label">Eco Grid</div>
          <div className="text-2xl font-bold mt-1" style={{ color: '#a78bfa' }}>{score}</div>
        </div>
        <div className="text-right">
          <div className="text-label">Stability</div>
          <div className="text-sm font-semibold mt-1" style={{ color: '#94a3b8' }}>Verified</div>
        </div>
      </div>

      <div className="tetris-stage">
        {/* Background Grid Lines */}
        {Array.from({ length: rows * cols }).map((_, i) => (
          <div key={`bg-${i}`} className="tetris-block" style={{ opacity: 0.15 }} />
        ))}

        {/* Settled Items */}
        {items.map((item, idx) => (
          <SettledShape key={`${item.id}-${idx}`} item={item} />
        ))}
      </div>
    </div>
  );
}

function SettledShape({ item }) {
  const color = categoryColors[item.category] || '#a78bfa';
  
  // Grid layout for the shape based on category
  const blocks = getBlocksForCategory(item.category);
  
  return (
    <div 
      className="absolute"
      style={{
        left: `${item.gridX * 10}%`,
        bottom: `${item.gridY * (100 / 18)}%`,
        width: '40%', // Assuming max 4 blocks wide
        height: 'calc(4 * (100% / 18))',
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
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: `inset 0 0 10px rgba(0,0,0,0.3), 0 0 12px ${color}44`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function getBlocksForCategory(category) {
  switch (category) {
    case 'transport': // T-shape
      return [{x:1,y:0}, {x:0,y:1}, {x:1,y:1}, {x:2,y:1}];
    case 'water': // I-shape
      return [{x:1,y:0}, {x:1,y:1}, {x:1,y:2}, {x:1,y:3}];
    case 'energy': // L-shape
      return [{x:1,y:0}, {x:1,y:1}, {x:1,y:2}, {x:2,y:2}];
    case 'food': // O-shape (Square)
      return [{x:1,y:1}, {x:2,y:1}, {x:1,y:2}, {x:2,y:2}];
    case 'nature': // S-shape
      return [{x:2,y:0}, {x:1,y:0}, {x:1,y:1}, {x:0,y:1}];
    case 'waste': // Z-shape
      return [{x:0,y:0}, {x:1,y:0}, {x:1,y:1}, {x:2,y:1}];
    default:
      return [{x:1,y:1}, {x:2,y:1}, {x:1,y:2}, {x:2,y:2}];
  }
}
