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
      className="habit-panel-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="habit-panel-overlay"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Slide-up panel */}
      <motion.div
        className="habit-panel-card"
        initial={{ y: '100%', opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: '100%', opacity: 0, scale: 0.98 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <div className="habit-panel-header">
          <div>
            <div className="text-label">New Spell</div>
            <div className="text-title" style={{ marginTop: '0.25rem' }}>Select Category</div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn-close"
          >
            ×
          </button>
        </div>

        {errorMessage && (
          <div className="error-banner mb-5">
            {errorMessage}
          </div>
        )}

        {/* habit tiles grid */}
        <div className="habit-panel-grid">
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
