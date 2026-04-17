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
  { path: '/dashboard', icon: CauldronNavIcon, id: 'nav-dashboard', label: 'Cauldron' },
  { path: '/spellbook', icon: ScrollNavIcon, id: 'nav-spellbook', label: 'Spellbook' },
  { path: '/coven', icon: CovenNavIcon, id: 'nav-coven', label: 'Coven' },
];

export function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <motion.nav
        className="nav-mobile"
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
              className={`nav-item-mobile ${isActive ? 'active' : ''}`.trim()}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(item.path)}
            >
              <Icon />
              {isActive && (
                <motion.div
                  className="nav-active-glow"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.button>
          );
        })}
      </motion.nav>

      <motion.aside
        className="nav-desktop"
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 18, stiffness: 90, delay: 0.1 }}
      >
        <div>
          <div className="nav-logo-section">
            <div className="nav-logo-text">
              Eco<span>Tetris</span>
            </div>
            <div className="text-label mt-2">
              Console
            </div>
          </div>

          <div className="nav-item-list">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.path}
                  id={item.id}
                  className={`nav-item-desktop ${isActive ? 'active' : ''}`.trim()}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(item.path)}
                >
                  <span className={`nav-icon-container ${isActive ? 'active' : ''}`.trim()}>
                    <Icon />
                  </span>
                  <span className="text-sm font-medium tracking-[0.08em]">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="nav-footer-card">
          <div className="nav-footer-status text-label">
            <span className="status-dot" />
            Live Sync
          </div>
          <div className="mt-2 text-xs font-medium opacity-60">
            Real-time block updates active.
          </div>
        </div>
      </motion.aside>
    </>
  );
}
