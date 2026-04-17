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
        className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 gap-2 rounded-full p-2 lg:hidden"
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
              className="relative cursor-pointer rounded-full border-none p-3 outline-none"
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

      <motion.aside
        className="hidden lg:flex lg:h-full lg:w-[220px] lg:flex-col lg:justify-between lg:pr-6"
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 18, stiffness: 90, delay: 0.1 }}
      >
        <div>
          <div className="mb-10 pt-3">
            <div className="text-3xl font-bold tracking-[-0.06em]" style={{ color: '#e2e8f0' }}>
              Foot<span style={{ color: '#a78bfa' }}>prints</span>
            </div>
            <div className="mt-2 text-[11px] uppercase tracking-[0.36em]" style={{ color: '#64748b' }}>
              Path Tracker
            </div>
          </div>

          <div className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.path}
                  id={item.id}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-left outline-none"
                  style={{
                    color: isActive ? '#e2e8f0' : '#94a3b8',
                    borderColor: isActive ? 'rgba(167,139,250,0.24)' : 'rgba(255,255,255,0.04)',
                    background: isActive
                      ? 'linear-gradient(180deg, rgba(124,58,237,0.24), rgba(124,58,237,0.08))'
                      : 'rgba(255,255,255,0.01)',
                    boxShadow: isActive ? '0 18px 36px rgba(124,58,237,0.12)' : 'none',
                  }}
                  whileHover={{ scale: 1.01, color: '#e2e8f0' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(item.path)}
                >
                  <span style={{ color: isActive ? '#c4b5fd' : '#64748b' }}>
                    <Icon />
                  </span>
                  <span className="text-sm font-medium tracking-[0.08em]">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div
          className="rounded-3xl border p-4"
          style={{
            borderColor: 'rgba(167,139,250,0.14)',
            background: 'linear-gradient(180deg, rgba(18,18,26,0.65), rgba(10,10,15,0.72))',
          }}
        >
          <div className="text-[11px] uppercase tracking-[0.34em]" style={{ color: '#64748b' }}>
            Desktop Mode
          </div>
          <div className="mt-3 text-sm leading-6" style={{ color: '#cbd5e1' }}>
            Wider canvas, persistent navigation, and full-page views.
          </div>
        </div>
      </motion.aside>
    </>
  );
}
