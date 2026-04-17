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
        <div className="tetris-grid-line" />
        
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
        width: '40%', 
        height: 'calc(4 * (100% / 18))',
        zIndex: 10,
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
                boxShadow: `0 0 25px ${color}33`
              }} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function getBlocksForCategory(category) {
  switch (category) {
    case 'transport': // T
      return [{x:1,y:1}, {x:0,y:1}, {x:2,y:1}, {x:1,y:2}];
    case 'water': // Z-shape (More complex than line)
      return [{x:0,y:1}, {x:1,y:1}, {x:1,y:2}, {x:2,y:2}];
    case 'energy': // L
      return [{x:1,y:0}, {x:1,y:1}, {x:1,y:2}, {x:2,y:2}];
    case 'food': // O (Square)
      return [{x:1,y:1}, {x:2,y:1}, {x:1,y:2}, {x:2,y:2}];
    case 'nature': // S
      return [{x:1,y:1}, {x:2,y:1}, {x:0,y:2}, {x:1,y:2}];
    case 'waste': // J
      return [{x:1,y:0}, {x:1,y:1}, {x:1,y:2}, {x:0,y:2}];
    default:
      return [{x:1,y:1}, {x:2,y:1}, {x:1,y:2}, {x:2,y:2}];
  }
}
