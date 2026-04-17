import { useState, useEffect } from 'react';
import { UserButton } from '../lib/auth.jsx';
import { useAuth, useUser } from '../lib/authHooks.js';
import { motion, AnimatePresence } from 'framer-motion';
import { Cauldron } from '../components/Cauldron';
import { FloatingOrb } from '../components/FloatingOrb';
import { NavBar } from '../components/NavBar';
import { TetrisFall } from '../components/TetrisFall';
import { FogBackground } from '../components/FogBackground';
import { HabitPanel } from './HabitPanel';
import { PageShell } from '../components/PageShell';
import { getApiErrorMessage, setAuthToken, syncUser, getScore, getTodayHabits } from '../lib/api';
import { categoryColors } from '../lib/categories.js';

const EMPTY_SCORE = { todayScore: 0, pathScore: 0, streak: 0 };

export function Dashboard() {
  const { getToken, userId } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const [score, setScore] = useState(EMPTY_SCORE);
  const [todayHabits, setTodayHabits] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const [loadError, setLoadError] = useState('');

  const loadData = async () => {
    if (!userId) {
      return;
    }

    try {
      setLoadError('');
      const token = await getToken();
      setAuthToken(token);
      await syncUser(user?.username || user?.firstName || 'wanderer');
      const [scoreRes, habitsRes] = await Promise.all([
        getScore(userId),
        getTodayHabits(userId),
      ]);
      setScore(scoreRes.data);
      setTodayHabits(habitsRes.data);
    } catch (error) {
      console.warn('[Footprints] API unavailable, showing empty state', error);
      setScore(EMPTY_SCORE);
      setTodayHabits([]);
      setLoadError(getApiErrorMessage(error, 'Live data unavailable'));
    }
  };

  useEffect(() => {
    if (!isUserLoaded) {
      return undefined;
    }

    if (userId) {
      const timerId = window.setTimeout(() => {
        void (async () => {
          try {
            setLoadError('');
            const token = await getToken();
            setAuthToken(token);
            await syncUser(user?.username || user?.firstName || 'wanderer');
            const [scoreRes, habitsRes] = await Promise.all([
              getScore(userId),
              getTodayHabits(userId),
            ]);
            setScore(scoreRes.data);
            setTodayHabits(habitsRes.data);
          } catch (error) {
            console.warn('[Footprints] API unavailable, showing empty state', error);
            setScore(EMPTY_SCORE);
            setTodayHabits([]);
            setLoadError(getApiErrorMessage(error, 'Live data unavailable'));
          }
        })();
      }, 0);

      return () => {
        window.clearTimeout(timerId);
      };
    }

    return undefined;
  }, [getToken, isUserLoaded, user?.firstName, user?.username, userId]);

  const loggedCategories = [...new Set(todayHabits.map((h) => h.category))];
  const recentHabits = todayHabits.slice(0, 4);
  const categorySummary = loggedCategories.map((category) => ({
    category,
    color: categoryColors[category] || '#a78bfa',
    count: todayHabits.filter((habit) => habit.category === category).length,
  }));

  return (
    <PageShell>
      <div className="container" style={{ paddingTop: '1.25rem' }}>
        <div className="dashboard-grid">
          <NavBar />

          <div className="dashboard-main-content dashboard-grid">
            {/* Status & Stats Section */}
            <div className="dashboard-stats-section">
              <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                <TetrisFall delay={0.1}>
                  <div className="glass-pill px-3 py-1.5 text-sm font-semibold" style={{ color: '#a78bfa' }}>
                    {score.streak}d
                  </div>
                </TetrisFall>

                <TetrisFall delay={0.2}>
                  <div className="glass-pill p-1">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </TetrisFall>
              </div>

              <TetrisFall delay={0.26}>
                <div className="metric-panel" style={{ background: 'linear-gradient(180deg, rgba(16,16,24,0.72), rgba(10,10,16,0.78))' }}>
                  <div className="flex-between">
                    <div>
                      <motion.div
                        className="badge-dot"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.55, 1, 0.55] }}
                        transition={{ delay: 0.3 }}
                      />
                      <motion.div
                        className="score-value"
                        style={{ color: '#a78bfa', marginTop: '1rem' }}
                        key={score.todayScore}
                        initial={{ scale: 1.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', damping: 12 }}
                      >
                        {score.todayScore}
                      </motion.div>
                      <div className="score-label" style={{ marginTop: '0.75rem' }}>
                        {loadError ? 'Waiting for live path' : 'Today&apos;s brew'}
                      </div>
                    </div>

                    <div className="glass-pill px-5 py-4 hidden lg-block">
                      <div className="text-label">Active</div>
                      <div className="text-3xl font-bold tracking-[-0.04em]" style={{ color: '#e2e8f0', marginTop: '0.5rem' }}>
                        {loggedCategories.length}
                      </div>
                    </div>
                  </div>

                  <div className="activity-grid mt-8" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    <div className="glass-pill p-4">
                      <div className="text-label" style={{ fontSize: '10px' }}>Path</div>
                      <div className="text-2xl font-bold mt-2" style={{ color: '#c4b5fd' }}>{score.pathScore}</div>
                    </div>
                    <div className="glass-pill p-4">
                      <div className="text-label" style={{ fontSize: '10px' }}>Logged</div>
                      <div className="text-2xl font-bold mt-2" style={{ color: '#e2e8f0' }}>{loggedCategories.length}</div>
                    </div>
                    <div className="glass-pill p-4">
                      <div className="text-label" style={{ fontSize: '10px' }}>Streak</div>
                      <div className="text-2xl font-bold mt-2" style={{ color: '#e2e8f0' }}>{score.streak}</div>
                    </div>
                  </div>
                </div>
              </TetrisFall>

              {loadError && (
                <TetrisFall delay={0.38} className="mt-5">
                  <div className="error-banner">
                    {loadError}. Sign in again or check the backend connection.
                  </div>
                </TetrisFall>
              )}

              <TetrisFall delay={0.46} className="mt-8 flex-center">
                <motion.button
                  id="log-habit-btn"
                  className="btn-primary px-14 py-4"
                  whileHover={{ scale: 1.06, boxShadow: '0 0 50px rgba(124, 58, 237, 0.6)' }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setShowPanel(true)}
                  disabled={!isUserLoaded}
                >
                  LOG
                </motion.button>
              </TetrisFall>

              <TetrisFall delay={0.4} className="mt-8">
                <div className="metric-panel">
                  <div className="flex-between">
                    <div className="text-label" style={{ letterSpacing: '0.32em' }}>Recent casts</div>
                    <div className="text-label" style={{ letterSpacing: '0.3em' }}>{todayHabits.length}</div>
                  </div>
                  <div className="activity-grid">
                    {recentHabits.length === 0 ? (
                      <div className="activity-card flex-center" style={{ padding: '1.5rem 1rem', color: '#64748b', textAlign: 'center' }}>
                        {loadError ? 'No live activity yet' : 'Nothing logged yet'}
                      </div>
                    ) : (
                      recentHabits.map((habit) => (
                        <div key={habit.id} className="activity-card">
                          <div className="flex-between">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div
                                className="status-dot"
                                style={{ 
                                  background: categoryColors[habit.category] || '#a78bfa', 
                                  boxShadow: `0 0 14px ${categoryColors[habit.category] || '#a78bfa'}` 
                                }}
                              />
                              <div className="text-sm font-medium capitalize" style={{ color: '#e2e8f0' }}>{habit.category}</div>
                            </div>
                            <div className="text-sm font-bold" style={{ color: '#c4b5fd' }}>+{habit.points}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </TetrisFall>
            </div>

            <div className="order-1 lg:order-2">
              <TetrisFall delay={0.3} className="relative z-10">
                <div className="cauldron-panel">
                  <div className="cauldron-panel-glow" />
                  <div className="text-label">Cauldron View</div>
                  <div className="mt-2 text-sm leading-6" style={{ color: '#cbd5e1' }}>
                    A cleaner desktop stage for your daily score, active categories, and the next habit you want to cast.
                  </div>

                  <div className="cauldron-stage">
                    <div
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                      style={{ 
                        background: 'radial-gradient(circle, rgba(124,58,237,0.18), transparent 70%)',
                        width: 'min(80vw, 30rem)',
                        height: 'min(80vw, 30rem)'
                      }}
                    />
                    <Cauldron score={score.todayScore} />
                    {loggedCategories.map((cat, i) => (
                      <FloatingOrb key={cat} category={cat} index={i} />
                    ))}
                  </div>
                </div>
              </TetrisFall>

              <TetrisFall delay={0.5} className="mt-5">
                <div className="metric-panel">
                  <div className="text-label" style={{ letterSpacing: '0.32em' }}>Category echoes</div>
                  <div className="category-echoes">
                    {categorySummary.length === 0 ? (
                      <div className="activity-card flex-center" style={{ padding: '1.5rem 1rem', color: '#64748b', textAlign: 'center' }}>
                        {loadError ? 'Connect live data to see category activity.' : 'Categories appear here after the first log.'}
                      </div>
                    ) : (
                      categorySummary.map((item) => (
                        <div key={item.category} className="echo-item">
                          <div className="status-dot" style={{ background: item.color, boxShadow: `0 0 14px ${item.color}` }} />
                          <div className="min-w-[84px] text-sm capitalize" style={{ color: '#e2e8f0' }}>{item.category}</div>
                          <div className="echo-bar-container">
                            <div
                              className="echo-bar"
                              style={{
                                width: `${Math.max((item.count / Math.max(todayHabits.length, 1)) * 100, 14)}%`,
                                background: `linear-gradient(90deg, ${item.color}, ${item.color}66)`,
                              }}
                            />
                          </div>
                          <div className="w-6 text-right text-sm font-bold" style={{ color: '#c4b5fd' }}>{item.count}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </TetrisFall>
            </div>
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
