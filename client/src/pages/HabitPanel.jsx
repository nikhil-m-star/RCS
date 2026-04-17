import { motion } from 'framer-motion';
import { useAuth } from '../lib/auth.js';
import { HabitTile } from '../components/HabitTile';
import { CATEGORIES } from '../lib/categories.js';
import { logHabit, setAuthToken } from '../lib/api';

export function HabitPanel({ onClose, onLogged, loggedCategories = [] }) {
  const { getToken } = useAuth();

  const handleLog = async (category) => {
    try {
      const token = await getToken();
      setAuthToken(token);
      await logHabit(category);
      onLogged();
    } catch {
      console.warn('[Footprints] API unavailable, simulating log');
      // Still trigger reload in demo mode
      onLogged();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0"
        style={{ background: 'rgba(10, 10, 15, 0.85)', backdropFilter: 'blur(12px)' }}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Slide-up panel */}
      <motion.div
        className="relative z-10 rounded-t-[32px] p-6 pb-24"
        style={{
          background: 'linear-gradient(180deg, rgba(22,22,32,0.98), rgba(14,14,22,0.98))',
          maxWidth: '430px',
          margin: '0 auto',
          width: '100%',
          border: '1px solid rgba(167, 139, 250, 0.18)',
          borderBottom: 'none',
          boxShadow: '0 -18px 60px rgba(124, 58, 237, 0.16), inset 0 1px 0 rgba(255,255,255,0.03)',
        }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        {/* Drag handle */}
        <div
          className="mx-auto mb-8 h-1 w-14 rounded-full"
          style={{ background: 'linear-gradient(90deg, rgba(124,58,237,0.14), rgba(167,139,250,0.7), rgba(124,58,237,0.14))' }}
        />

        {/* 3x2 grid of habit tiles */}
        <div className="grid grid-cols-3 gap-3">
          {CATEGORIES.map((cat, i) => (
            <HabitTile
              key={cat}
              category={cat}
              delay={0.1 + i * 0.08}
              onLog={handleLog}
              isLogged={loggedCategories.includes(cat)}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
