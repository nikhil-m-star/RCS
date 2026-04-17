import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth.js';
import { motion } from 'framer-motion';
import { CategoryIcon } from '../components/CategoryIcons';
import { categoryColors } from '../lib/categories.js';
import { NavBar } from '../components/NavBar';
import { TetrisFall } from '../components/TetrisFall';
import { FogBackground } from '../components/FogBackground';
import { api, setAuthToken } from '../lib/api';

// Demo fallback
const DEMO_HABITS = [
  { id: '1', category: 'transport', points: 15, loggedAt: new Date(Date.now() - 3600000).toISOString() },
  { id: '2', category: 'water', points: 10, loggedAt: new Date(Date.now() - 7200000).toISOString() },
  { id: '3', category: 'energy', points: 20, loggedAt: new Date(Date.now() - 10800000).toISOString() },
  { id: '4', category: 'food', points: 10, loggedAt: new Date(Date.now() - 14400000).toISOString() },
  { id: '5', category: 'nature', points: 10, loggedAt: new Date(Date.now() - 18000000).toISOString() },
];

export function Spellbook() {
  const { getToken, userId } = useAuth();
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getToken();
        setAuthToken(token);
        const res = await api.get(`/habits/${userId}`);
        setHabits(res.data);
      } catch {
        console.warn('[Footprints] API unavailable, using demo data');
        setHabits(DEMO_HABITS);
      }
    };
    if (userId) {
      void load();
    }
  }, [getToken, userId]);

  return (
    <div className="min-h-screen relative pb-24" style={{ background: '#0a0a0f' }}>
      <FogBackground />

      <div className="relative z-10 max-w-[430px] mx-auto px-4 pt-10">
        {/* Title */}
        <TetrisFall delay={0.1}>
          <h1
            className="text-2xl font-bold mb-8 text-center"
            style={{ color: '#a78bfa' }}
          >
            Spellbook
          </h1>
        </TetrisFall>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-5 top-0 bottom-0 w-px"
            style={{ background: 'rgba(124, 58, 237, 0.15)' }}
          />

          {habits.length === 0 ? (
            <TetrisFall delay={0.2}>
              <div className="text-center py-20 text-sm" style={{ color: '#64748b' }}>
                No spells cast yet today
              </div>
            </TetrisFall>
          ) : (
            habits.map((habit, i) => (
              <motion.div
                key={habit.id}
                className="relative pl-14 pb-6"
                initial={{ y: '-120vh', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  type: 'spring',
                  damping: 15,
                  stiffness: 80,
                  delay: 0.2 + i * 0.08,
                }}
              >
                {/* Timeline dot */}
                <div
                  className="absolute left-3.5 top-3 w-3 h-3 rounded-full border-2"
                  style={{
                    borderColor: categoryColors[habit.category] || '#7c3aed',
                    background: '#0a0a0f',
                    boxShadow: `0 0 8px ${categoryColors[habit.category] || '#7c3aed'}40`,
                  }}
                />

                {/* Card */}
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: '#12121a',
                    border: '1px solid rgba(124, 58, 237, 0.12)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div style={{ color: categoryColors[habit.category] || '#a78bfa' }}>
                        <CategoryIcon category={habit.category} size={26} />
                      </div>
                      <span className="text-lg font-bold" style={{ color: '#a78bfa' }}>
                        +{habit.points}
                      </span>
                    </div>
                    <span className="text-xs" style={{ color: '#64748b' }}>
                      {new Date(habit.loggedAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <NavBar />
    </div>
  );
}
