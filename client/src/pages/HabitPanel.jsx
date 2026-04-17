import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../lib/authHooks.js';
import { HabitTile } from '../components/HabitTile';
import { CATEGORIES } from '../lib/categories.js';
import { getApiErrorMessage, logHabit, setAuthToken } from '../lib/api';

export function HabitPanel({ onClose, onLogged, loggedCategories = [] }) {
  const { getToken } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');

  const handleLog = async (category) => {
    try {
      setErrorMessage('');
      const token = await getToken();
      setAuthToken(token);
      await logHabit(category);
      await onLogged();
      onClose();
    } catch (error) {
      console.warn('[Footprints] API unavailable, unable to log habit', error);
      setErrorMessage(getApiErrorMessage(error, 'Could not log right now. Check auth or backend connection.'));
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col justify-end p-4 lg:items-center lg:justify-center"
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
        className="relative z-10 rounded-t-[32px] p-6 pb-24 lg:rounded-[32px] lg:p-8"
        style={{
          background: 'linear-gradient(180deg, rgba(22,22,32,0.98), rgba(14,14,22,0.98))',
          maxWidth: '780px',
          margin: '0 auto',
          width: '100%',
          border: '1px solid rgba(167, 139, 250, 0.18)',
          borderBottom: '1px solid rgba(167, 139, 250, 0.18)',
          boxShadow: '0 -18px 60px rgba(124, 58, 237, 0.16), inset 0 1px 0 rgba(255,255,255,0.03)',
        }}
        initial={{ y: '100%', opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: '100%', opacity: 0, scale: 0.98 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <div className="mb-8 flex items-start justify-between gap-6">
          <div>
            <div className="text-[11px] uppercase tracking-[0.36em]" style={{ color: '#64748b' }}>
              Cast
            </div>
            <div className="mt-2 text-2xl font-bold tracking-[-0.05em]" style={{ color: '#e2e8f0' }}>
              Choose a habit
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border"
            style={{
              borderColor: 'rgba(167,139,250,0.16)',
              background: 'rgba(255,255,255,0.02)',
              color: '#a78bfa',
            }}
          >
            ×
          </button>
        </div>

        {errorMessage && (
          <div
            className="mb-5 rounded-2xl border px-4 py-3 text-sm"
            style={{
              borderColor: 'rgba(248,113,113,0.16)',
              background: 'rgba(48, 18, 24, 0.34)',
              color: '#fda4af',
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* 3x2 grid of habit tiles */}
        <div className="grid grid-cols-3 gap-3 lg:grid-cols-6">
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
