import { useState, useEffect } from 'react';
import { UserButton } from '../lib/auth.jsx';
import { useAuth, useUser } from '../lib/authHooks.js';
import { motion, AnimatePresence } from 'framer-motion';
import { TetrisStage } from '../components/TetrisStage';
import { FallingShape } from '../components/FallingShape';
import { NavBar } from '../components/NavBar';
import { TetrisFall } from '../components/TetrisFall';
import { FogBackground } from '../components/FogBackground';
import { HabitPanel } from './HabitPanel';
import { PageShell } from '../components/PageShell';
import { getApiErrorMessage, setAuthToken, syncUser, getScore, getTodayHabits } from '../lib/api';
import { categoryColors } from '../lib/categories.js';

const EMPTY_SCORE = { todayScore: 0, pathScore: 0, streak: 0 };

function getShapesFromHabits(habits) {
  const colHeights = [0, 0, 0];
  const colX = [0, 3, 6];

  // We process habits in reverse (oldest first) to build the stack upwards
  return [...habits].reverse().map((h) => {
    // Choose column based on category hash or simple rotation
    const colIdx = h.category.length % 3;
    const gridX = colX[colIdx];
    const gridY = colHeights[colIdx];
    
    // Increment height for this column (most shapes are 2-3 units tall)
    colHeights[colIdx] += 2.5;

    return {
      ...h,
      gridX,
      gridY,
    };
  }).reverse(); // Reverse back so the newest is at index 0 for the FallingShape
}

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

          <div className="dashboard-main-area">
            {/* Main Action Area */}
            <div className="flex flex-column gap-6">
              <div className="flex-between">
                <TetrisFall delay={0.1}>
                  <div className="glass-pill px-4 py-2 text-sm font-bold" style={{ color: '#a78bfa' }}>
                    STREAK {score.streak}D
                  </div>
                </TetrisFall>

                <TetrisFall delay={0.2}>
                  <div className="glass-pill p-1">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </TetrisFall>
              </div>

              <TetrisFall delay={0.26}>
                <div className="metric-panel">
                  <div className="flex-between items-end">
                    <div>
                      <div className="text-label">Today's Brew</div>
                      <motion.div
                        className="text-6xl font-bold tracking-tight mt-2"
                        style={{ color: '#f5f3ff' }}
                        key={score.todayScore}
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                      >
                        {score.todayScore}
                      </motion.div>
                    </div>

                    <div className="hidden lg-block text-right">
                      <div className="text-label">Active Schools</div>
                      <div className="text-3xl font-bold mt-1" style={{ color: '#e2e8f0' }}>
                        {loggedCategories.length}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-8">
                    <div className="glass-pill p-4">
                      <div className="text-label">Path</div>
                      <div className="text-2xl font-bold mt-1" style={{ color: '#c4b5fd' }}>{score.pathScore}</div>
                    </div>
                    <div className="glass-pill p-4">
                      <div className="text-label">Logged</div>
                      <div className="text-2xl font-bold mt-1">{loggedCategories.length}</div>
                    </div>
                    <div className="glass-pill p-4">
                      <div className="text-label">Level</div>
                      <div className="text-2xl font-bold mt-1">{Math.floor(score.pathScore / 100) + 1}</div>
                    </div>
                  </div>
                </div>
              </TetrisFall>

              <TetrisFall delay={0.46} className="flex-center">
                <motion.button
                  id="log-habit-btn"
                  className="btn-primary px-16 py-5"
                  whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(124, 58, 237, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPanel(true)}
                  disabled={!isUserLoaded}
                >
                  CAST SPELL
                </motion.button>
              </TetrisFall>

              <div className="metric-panel">
                <div className="flex-between">
                  <div className="text-label">Recent Casts</div>
                  <div className="text-sm font-semibold opacity-60">{todayHabits.length}</div>
                </div>
                <div className="activity-grid">
                  {recentHabits.length === 0 ? (
                    <div className="activity-card flex-center py-10 opacity-40">
                      No live activity
                    </div>
                  ) : (
                    recentHabits.map((habit) => (
                      <div key={habit.id} className="activity-card">
                        <div className="flex-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ 
                                background: categoryColors[habit.category] || '#a78bfa', 
                                boxShadow: `0 0 10px ${categoryColors[habit.category] || '#a78bfa'}` 
                              }}
                            />
                            <div className="text-sm font-bold capitalize">{habit.category}</div>
                          </div>
                          <div className="text-sm font-bold" style={{ color: '#c4b5fd' }}>+{habit.points}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Tetris Area */}
            <div className="flex flex-column gap-5">
              <div className="relative">
                <TetrisStage 
                  score={score.todayScore} 
                  items={getShapesFromHabits(todayHabits.slice(1))} 
                />
                {todayHabits.length > 0 && (
                  <FallingShape 
                    key={todayHabits[0].id}
                    item={getShapesFromHabits(todayHabits)[0]} 
                  />
                )}
              </div>

              <TetrisFall delay={0.5}>
                <div className="metric-panel">
                  <div className="text-label mb-4">Registry</div>
                  <div className="category-echoes">
                    {categorySummary.map((item) => (
                      <div key={item.category} className="echo-item">
                        <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                        <div className="flex-1 text-sm font-bold capitalize">{item.category}</div>
                        <div className="text-xs font-bold opacity-60">{item.count}</div>
                      </div>
                    ))}
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
