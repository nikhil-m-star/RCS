import { useState, useEffect } from 'react';
import { useAuth, useUser, UserButton } from '../lib/auth.js';
import { motion, AnimatePresence } from 'framer-motion';
import { Cauldron } from '../components/Cauldron';
import { FloatingOrb } from '../components/FloatingOrb';
import { NavBar } from '../components/NavBar';
import { TetrisFall } from '../components/TetrisFall';
import { FogBackground } from '../components/FogBackground';
import { HabitPanel } from './HabitPanel';
import { PageShell } from '../components/PageShell';
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
    <PageShell>
      <FogBackground />

      <div className="relative lg:grid lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
        <NavBar />

        <div className="relative flex min-h-[calc(100vh-6rem)] flex-col pt-2 lg:min-h-0 lg:justify-between lg:pt-0">
          <div className="flex w-full items-center justify-between">
            <TetrisFall delay={0.1}>
              <div
                className="rounded-full px-3 py-1.5 text-sm font-semibold"
                style={{
                  color: '#a78bfa',
                  background: 'rgba(18,18,26,0.88)',
                  border: '1px solid rgba(124, 58, 237, 0.25)',
                  boxShadow: '0 10px 22px rgba(0, 0, 0, 0.26)',
                }}
              >
                {score.streak}d
              </div>
            </TetrisFall>

            <TetrisFall delay={0.2}>
              <div
                className="rounded-full p-1"
                style={{
                  background: 'rgba(18,18,26,0.88)',
                  border: '1px solid rgba(124, 58, 237, 0.25)',
                  boxShadow: '0 10px 22px rgba(0, 0, 0, 0.26)',
                }}
              >
                <UserButton afterSignOutUrl="/" />
              </div>
            </TetrisFall>
          </div>

          <div className="mt-6 grid flex-1 items-center gap-10 lg:grid-cols-[minmax(320px,440px)_minmax(0,1fr)] lg:gap-16">
            <div>
              <TetrisFall delay={0.26} className="text-left">
                <motion.div
                  className="h-2 w-2 rounded-full"
                  style={{ background: '#7c3aed', boxShadow: '0 0 16px rgba(124,58,237,0.85)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.55, 1, 0.55] }}
                  transition={{ delay: 0.3 }}
                />
                <motion.div
                  className="mt-4 text-7xl font-bold tracking-[-0.08em] lg:text-8xl"
                  style={{ color: '#a78bfa' }}
                  key={score.todayScore}
                  initial={{ scale: 1.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', damping: 12 }}
                >
                  {score.todayScore}
                </motion.div>
              </TetrisFall>

              <TetrisFall delay={0.34} className="mt-6">
                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  <div className="rounded-3xl border p-5" style={{ borderColor: 'rgba(124,58,237,0.14)', background: 'rgba(12,12,18,0.55)' }}>
                    <div className="text-[11px] uppercase tracking-[0.3em]" style={{ color: '#64748b' }}>Path</div>
                    <div className="mt-3 text-3xl font-bold tracking-[-0.04em]" style={{ color: '#c4b5fd' }}>{score.pathScore}</div>
                  </div>
                  <div className="rounded-3xl border p-5" style={{ borderColor: 'rgba(124,58,237,0.14)', background: 'rgba(12,12,18,0.55)' }}>
                    <div className="text-[11px] uppercase tracking-[0.3em]" style={{ color: '#64748b' }}>Logged</div>
                    <div className="mt-3 text-3xl font-bold tracking-[-0.04em]" style={{ color: '#e2e8f0' }}>{loggedCategories.length}</div>
                  </div>
                  <div className="rounded-3xl border p-5" style={{ borderColor: 'rgba(124,58,237,0.14)', background: 'rgba(12,12,18,0.55)' }}>
                    <div className="text-[11px] uppercase tracking-[0.3em]" style={{ color: '#64748b' }}>Streak</div>
                    <div className="mt-3 text-3xl font-bold tracking-[-0.04em]" style={{ color: '#e2e8f0' }}>{score.streak}</div>
                  </div>
                </div>
              </TetrisFall>

              <TetrisFall delay={0.46} className="mt-8">
                <motion.button
                  id="log-habit-btn"
                  className="cursor-pointer rounded-full border-2 px-14 py-4 text-lg font-bold tracking-[0.28em]"
                  style={{
                    background: 'linear-gradient(180deg, #8b5cf6 0%, #6d28d9 100%)',
                    borderColor: '#c4b5fd',
                    color: '#f8fafc',
                    boxShadow: '0 22px 46px rgba(124, 58, 237, 0.34)',
                  }}
                  whileHover={{ scale: 1.06, boxShadow: '0 0 50px rgba(124, 58, 237, 0.6)' }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setShowPanel(true)}
                >
                  LOG
                </motion.button>
              </TetrisFall>
            </div>

            <TetrisFall delay={0.36} className="relative z-10">
              <div className="relative mx-auto flex min-h-[360px] items-center justify-center lg:min-h-[520px]">
                <div
                  className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl lg:h-96 lg:w-96"
                  style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.16), transparent 70%)' }}
                />
                <Cauldron score={score.todayScore} />
                {loggedCategories.map((cat, i) => (
                  <FloatingOrb key={cat} category={cat} index={i} />
                ))}
              </div>
            </TetrisFall>
          </div>
        </div>
      </div>

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
    </PageShell>
  );
}
