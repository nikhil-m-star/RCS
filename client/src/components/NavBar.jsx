import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Minimal SVG nav icons (no text labels)
function CauldronNavIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M5,9 Q4,18 12,19 Q20,18 19,9" />
      <ellipse cx="12" cy="9" rx="8" ry="3" />
      <path d="M8,19 L7,22" />
      <path d="M16,19 L17,22" />
    </svg>
  );
}

function ScrollNavIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M8,3 Q5,3 5,6 L5,18 Q5,21 8,21" />
      <path d="M8,3 L18,3 L18,18 Q18,21 15,21 L8,21" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="13" y2="16" />
    </svg>
  );
}

function CovenNavIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="7" r="3.5" />
      <circle cx="5" cy="10" r="2.5" />
      <circle cx="19" cy="10" r="2.5" />
      <path d="M3,18 Q5,14 8,15" />
      <path d="M8,18 Q12,13 16,18" />
      <path d="M16,15 Q19,14 21,18" />
    </svg>
  );
}

const navItems = [
  { path: '/dashboard', icon: CauldronNavIcon, id: 'nav-dashboard' },
  { path: '/spellbook', icon: ScrollNavIcon, id: 'nav-spellbook' },
  { path: '/coven', icon: CovenNavIcon, id: 'nav-coven' },
];

export function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <motion.nav
      className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 gap-2 rounded-full p-2"
      style={{
        background: 'rgba(13, 13, 20, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(167, 139, 250, 0.18)',
        boxShadow: '0 18px 42px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
      initial={{ y: '120vh' }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 15, stiffness: 80, delay: 0.6 }}
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        return (
          <motion.button
            key={item.path}
            id={item.id}
            className="relative rounded-full border-none p-3 outline-none cursor-pointer"
            style={{
              color: isActive ? '#a78bfa' : '#64748b',
              background: isActive ? 'linear-gradient(180deg, rgba(124, 58, 237, 0.18), rgba(124, 58, 237, 0.08))' : 'transparent',
            }}
            whileHover={{ scale: 1.15, color: '#a78bfa' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(item.path)}
          >
            <Icon />
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ boxShadow: '0 0 15px rgba(124, 58, 237, 0.3)' }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.button>
        );
      })}
    </motion.nav>
  );
}
