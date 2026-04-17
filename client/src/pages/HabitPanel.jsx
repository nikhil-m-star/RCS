import { motion } from 'framer-motion';
import { useAuth } from '../lib/auth.js';
import { HabitTile } from '../components/HabitTile';
import { CATEGORIES } from '../components/CategoryIcons';
import { logHabit, setAuthToken } from '../lib/api';

export function HabitPanel({ onClose, onLogged, loggedCategories = [] }) {
  const { getToken } = useAuth();

  const handleLog = async (category) => {
    try {
      const token = await getToken();
      setAuthToken(token);
      await logHabit(category);
      onLogged();
    } catch (err) {
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
        className="relative z-10 rounded-t-3xl p-6 pb-24"
        style={{
          background: '#12121a',
          maxWidth: '430px',
          margin: '0 auto',
          width: '100%',
          border: '1px solid rgba(124, 58, 237, 0.15)',
          borderBottom: 'none',
          boxShadow: '0 -8px 40px rgba(124, 58, 237, 0.1)',
        }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        {/* Drag handle */}
        <div
          className="w-10 h-1 rounded-full mx-auto mb-8"
          style={{ background: 'rgba(124, 58, 237, 0.3)' }}
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
