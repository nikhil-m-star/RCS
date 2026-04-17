import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { UserButton } from '../lib/auth.jsx';
import { useAuth, useUser } from '../lib/authHooks.js';
import { CategoryIcon } from '../components/CategoryIcons';
import { FogBackground } from '../components/FogBackground';
import { NavBar } from '../components/NavBar';
import { PageShell } from '../components/PageShell';
import { TetrisFall } from '../components/TetrisFall';
import { categoryColors } from '../lib/categories.js';
import { api, getApiErrorMessage, setAuthToken, syncUser } from '../lib/api';

const DEMO_HABITS = [
  { id: '1', category: 'transport', points: 15, loggedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
  { id: '2', category: 'water', points: 10, loggedAt: new Date(Date.now() - 85 * 60 * 1000).toISOString() },
  { id: '3', category: 'energy', points: 20, loggedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: '4', category: 'food', points: 10, loggedAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString() },
  { id: '5', category: 'nature', points: 10, loggedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
];

const getCategoryCount = (habits, category) => habits.filter((habit) => habit.category === category).length;

const formatRelativeTime = (dateValue) => {
  const diffMs = Date.now() - new Date(dateValue).getTime();
  const diffMinutes = Math.max(Math.round(diffMs / 60000), 0);

  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return `${Math.floor(diffHours / 24)}d ago`;
};

const formatClockTime = (dateValue) =>
  new Date(dateValue).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

export function Spellbook() {
  const { getToken, userId } = useAuth();
  const { user } = useUser();
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!userId) {
      return undefined;
    }

    let isActive = true;

    const load = async () => {
      setIsLoading(true);
      setLoadError('');

      try {
        const token = await getToken();
        setAuthToken(token);
        await syncUser(user?.username || user?.firstName || 'wanderer');
        const res = await api.get(`/habits/${userId}`);

        if (!isActive) {
          return;
        }

        setHabits(
          [...res.data].sort(
            (a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime(),
          ),
        );
      } catch (error) {
        if (!isActive) {
          return;
        }

        console.warn('[Footprints] Spellbook API unavailable, using demo data', error);
        setAuthToken(null);
        setHabits(DEMO_HABITS);
        setLoadError(getApiErrorMessage(error, 'Live spell history unavailable'));
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isActive = false;
    };
  }, [getToken, user?.firstName, user?.username, userId]);

  const profileName = user?.username || user?.firstName || 'Wanderer';
  const totalPoints = habits.reduce((sum, habit) => sum + habit.points, 0);
  const categorySummary = useMemo(() => {
    const activeCategories = [...new Set(habits.map((habit) => habit.category))];

    return activeCategories
      .map((category) => ({
          category,
          count: getCategoryCount(habits, category),
          color: categoryColors[category] || '#a78bfa',
          points: habits
            .filter((habit) => habit.category === category)
            .reduce((sum, habit) => sum + habit.points, 0),
        }))
      .sort((a, b) => b.count - a.count || b.points - a.points);
  }, [habits]);

  const activeCategories = categorySummary.map((item) => item.category);
  const mostRecentHabit = habits[0] || null;
  const highlightedCategory = categorySummary[0] || null;

  return (
    <PageShell>
      <div className="container" style={{ paddingTop: '1.25rem' }}>
        <div className="dashboard-grid">
          <NavBar />

          <div className="relative z-10 flex flex-col pt-2">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <TetrisFall delay={0.08} className="max-w-3xl">
                <div className="glass-pill px-3 py-1.5 inline-flex items-center gap-2">
                  <span
                    className="status-dot"
                    style={{ background: '#a78bfa', boxShadow: '0 0 18px rgba(167,139,250,0.9)' }}
                  />
                  <span className="text-label" style={{ color: '#c4b5fd' }}>Spellbook Archive</span>
                </div>

                <h1 className="text-display mt-5" style={{ fontSize: 'min(12vw, 4rem)' }}>
                  Cast History.
                </h1>

                <p className="mt-4 max-w-2xl text-body">
                  Your eco-actions, tracked and verified.
                </p>
              </TetrisFall>

              <TetrisFall delay={0.15}>
                <div className="flex items-center justify-between gap-3 lg:justify-end">
                  <div className="glass-pill px-4 py-2 text-sm font-semibold">
                    {mostRecentHabit ? `Last cast ${formatRelativeTime(mostRecentHabit.loggedAt)}` : 'Ready to log'}
                  </div>
                  <div className="glass-pill p-1">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </div>
              </TetrisFall>
            </div>

            <TetrisFall delay={0.22} className="mt-12">
              <div className="activity-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                {[
                  { label: 'Points today', value: totalPoints, accent: '#c4b5fd' },
                  { label: 'Casts logged', value: habits.length, accent: '#f5f3ff' },
                  { label: 'Schools active', value: activeCategories.length, accent: '#93c5fd' },
                  {
                    label: 'Top school',
                    value: highlightedCategory ? highlightedCategory.category : 'None',
                    accent: highlightedCategory?.color || '#fca5a5',
                  },
                ].map((card) => (
                  <div key={card.label} className="metric-panel">
                    <div className="text-label">{card.label}</div>
                    <div
                      className="mt-4 text-3xl font-bold capitalize tracking-[-0.05em]"
                      style={{ color: card.accent }}
                    >
                      {card.value}
                    </div>
                  </div>
                ))}
              </div>
            </TetrisFall>

            {loadError && (
              <TetrisFall delay={0.28} className="mt-5">
                <div className="error-banner" style={{ borderColor: 'rgba(251, 191, 36, 0.18)', background: 'rgba(54, 35, 10, 0.24)', color: '#fde68a' }}>
                  {loadError}. Demo entries are filling the page so the spellbook still stays usable while the backend
                  is down.
                </div>
              </TetrisFall>
            )}

            <div className="mt-12 grid flex-1 gap-8 xl:grid-cols-[minmax(0,1.35fr)_360px]">
              <TetrisFall delay={0.32}>
                <div className="cauldron-panel" style={{ padding: '2rem' }}>
                  <div className="cauldron-panel-glow" />

                <div className="ledger-container">
                  <div className="ledger-header hidden md-grid">
                    <div className="text-label">Time</div>
                    <div className="text-label">Habit Category</div>
                    <div className="text-label text-right">Credits</div>
                  </div>

                  {isLoading ? (
                    <div className="p-8 space-y-4">
                      {[0, 1, 2].map((item) => (
                        <div key={item} className="h-12 w-full rounded-2xl bg-white/5 animate-pulse" />
                      ))}
                    </div>
                  ) : habits.length === 0 ? (
                    <div className="py-20 text-center">
                      <div className="text-xl font-bold opacity-40">No entries recorded.</div>
                    </div>
                  ) : (
                    habits.map((habit, index) => {
                      const color = categoryColors[habit.category] || '#a78bfa';
                      return (
                        <motion.div
                          key={habit.id}
                          className="ledger-row"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <div className="ledger-time">
                            {formatClockTime(habit.loggedAt)}
                          </div>
                          <div className="ledger-category">
                            <div 
                              className="p-1.5 rounded-lg" 
                              style={{ background: `${color}15`, color: color }}
                            >
                              <CategoryIcon category={habit.category} size={18} />
                            </div>
                            {habit.category}
                          </div>
                          <div className="ledger-points" style={{ color: color }}>
                            +{habit.points}
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
                </div>
              </TetrisFall>

              <div className="flex flex-col gap-5">
                <TetrisFall delay={0.38}>
                  <div className="metric-panel">
                    <div className="text-label">School Breakdown</div>

                    <div className="category-echoes">
                      {categorySummary.length === 0 ? (
                        <div className="activity-card flex-center" style={{ padding: '2rem 1rem', color: '#94a3b8', textAlign: 'center' }}>
                          Category totals will appear after your first cast.
                        </div>
                      ) : (
                        categorySummary.map((item) => (
                          <div key={item.category} className="echo-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                            <div className="flex-between w-full">
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div className="status-dot" style={{ background: item.color, boxShadow: `0 0 14px ${item.color}` }} />
                                <div className="text-sm font-medium capitalize" style={{ color: '#f5f3ff' }}>{item.category}</div>
                              </div>
                              <div className="text-sm font-semibold" style={{ color: '#c4b5fd' }}>{item.points} pts</div>
                            </div>

                            <div className="echo-bar-container w-full">
                              <div
                                className="echo-bar"
                                style={{
                                  width: `${Math.max((item.count / Math.max(habits.length, 1)) * 100, 18)}%`,
                                  background: `linear-gradient(90deg, ${item.color}, ${item.color}66)`,
                                }}
                              />
                            </div>

                            <div className="text-xs uppercase tracking-[0.24em]" style={{ color: '#64748b' }}>
                              {item.count} cast{item.count === 1 ? '' : 's'}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </TetrisFall>

                <TetrisFall delay={0.44}>
                  <div className="metric-panel">
                    <div className="text-label">Archive Notes</div>
                    <div className="mt-4 flex flex-col gap-3">
                      <div className="activity-card text-sm font-medium">
                        Real-time verification active.
                      </div>
                      <div className="activity-card text-sm font-medium">
                        Newest entries at top.
                      </div>
                      <div className="activity-card text-sm font-medium">
                        Points audit complete.
                      </div>
                    </div>
                  </div>
                </TetrisFall>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
