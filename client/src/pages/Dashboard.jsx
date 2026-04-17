import { useState, useEffect } from 'react';
import { useAuth, useUser, UserButton } from '../lib/auth.js';
import { motion, AnimatePresence } from 'framer-motion';
import { Cauldron } from '../components/Cauldron';
import { FloatingOrb } from '../components/FloatingOrb';
import { NavBar } from '../components/NavBar';
import { TetrisFall } from '../components/TetrisFall';
import { FogBackground } from '../components/FogBackground';
import { HabitPanel } from './HabitPanel';
import { setAuthToken, syncUser, getScore, getTodayHabits } from '../lib/api';

// Demo fallback data when API is not available
const DEMO_SCORE = { todayScore: 45, pathScore: 320, streak: 5 };
const DEMO_HABITS = [
  { id: '1', category: 'transport', label: 'transport', points: 15, loggedAt: new Date().toISOString() },
  { id: '2', category: 'water', label: 'water', points: 10, loggedAt: new Date().toISOString() },
  { id: '3', category: 'energy', label: 'energy', points: 20, loggedAt: new Date().toISOString() },
];

export function Dashboard() {
  const { getToken, userId } = useAuth();
  const { user } = useUser();
  const [score, setScore] = useState({ todayScore: 0, pathScore: 0, streak: 0 });
  const [todayHabits, setTodayHabits] = useState([]);
  const [showPanel, setShowPanel] = useState(false);

  const loadData = async () => {
    try {
      const token = await getToken();
      setAuthToken(token);
      await syncUser(user?.username || user?.firstName || 'wanderer');
      const [scoreRes, habitsRes] = await Promise.all([
        getScore(userId),
        getTodayHabits(userId),
      ]);
      setScore(scoreRes.data);
      setTodayHabits(habitsRes.data);
    } catch {
      console.warn('[Footprints] API unavailable, using demo data');
      setScore(DEMO_SCORE);
      setTodayHabits(DEMO_HABITS);
    }
  };

  useEffect(() => {
    if (userId) {
      const timerId = window.setTimeout(() => {
        void (async () => {
          try {
            const token = await getToken();
            setAuthToken(token);
            await syncUser(user?.username || user?.firstName || 'wanderer');
            const [scoreRes, habitsRes] = await Promise.all([
              getScore(userId),
              getTodayHabits(userId),
            ]);
            setScore(scoreRes.data);
            setTodayHabits(habitsRes.data);
          } catch {
            console.warn('[Footprints] API unavailable, using demo data');
            setScore(DEMO_SCORE);
            setTodayHabits(DEMO_HABITS);
          }
        })();
      }, 0);

      return () => {
        window.clearTimeout(timerId);
      };
  }

    return undefined;
  }, [getToken, user?.firstName, user?.username, userId]);

  const loggedCategories = [...new Set(todayHabits.map((h) => h.category))];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: '#0a0a0f' }}
    >
      <FogBackground />

      {/* User avatar top-right */}
      <TetrisFall delay={0.1} className="fixed top-5 right-5 z-50">
        <UserButton afterSignOutUrl="/" />
      </TetrisFall>

      {/* Streak badge top-left */}
      <TetrisFall delay={0.2} className="fixed top-5 left-5 z-50">
        <div
          className="text-sm font-semibold px-3 py-1.5 rounded-full"
          style={{
            color: '#a78bfa',
            background: '#12121a',
            border: '1px solid rgba(124, 58, 237, 0.25)',
            boxShadow: '0 0 12px rgba(124, 58, 237, 0.15)',
          }}
        >
          {score.streak}d
        </div>
      </TetrisFall>

      {/* Today's score */}
      <TetrisFall delay={0.3} className="z-10 mb-2">
        <div className="text-center">
          <motion.div
            className="text-5xl font-bold"
            style={{ color: '#a78bfa' }}
            key={score.todayScore}
            initial={{ scale: 1.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 12 }}
          >
            {score.todayScore}
          </motion.div>
        </div>
      </TetrisFall>

      {/* Cauldron + orbs */}
      <TetrisFall delay={0.4} className="relative z-10">
        <div className="relative">
          <Cauldron score={score.todayScore} />
          {loggedCategories.map((cat, i) => (
            <FloatingOrb key={cat} category={cat} index={i} />
          ))}
        </div>
      </TetrisFall>

      {/* Total path score */}
      <TetrisFall delay={0.5} className="z-10 mt-2">
        <motion.div
          className="text-xs font-medium tracking-widest uppercase"
          style={{ color: '#64748b' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {score.pathScore} total
        </motion.div>
      </TetrisFall>

      {/* LOG button */}
      <TetrisFall delay={0.6} className="z-10 mt-8">
        <motion.button
          id="log-habit-btn"
          className="px-14 py-4 rounded-full text-lg font-bold border-2 cursor-pointer"
          style={{
            background: '#7c3aed',
            borderColor: '#a78bfa',
            color: '#e2e8f0',
            boxShadow: '0 0 30px rgba(124, 58, 237, 0.4)',
          }}
          whileHover={{ scale: 1.06, boxShadow: '0 0 50px rgba(124, 58, 237, 0.6)' }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setShowPanel(true)}
        >
          LOG
        </motion.button>
      </TetrisFall>

      {/* Habit Panel */}
      <AnimatePresence>
        {showPanel && (
          <HabitPanel
            onClose={() => setShowPanel(false)}
            onLogged={loadData}
            loggedCategories={loggedCategories}
          />
        )}
      </AnimatePresence>

      <NavBar />
    </div>
  );
}
