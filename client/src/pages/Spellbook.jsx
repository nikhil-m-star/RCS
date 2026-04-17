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
                  Today&apos;s cast history,
                  <span className="block" style={{ color: '#a78bfa' }}>
                    organized like a real ledger.
                  </span>
                </h1>

                <p className="mt-4 max-w-2xl text-body">
                  {profileName}&apos;s latest eco-actions live here with timestamps, category streaks, and a cleaner
                  breakdown of how today&apos;s points were earned.
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

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <div className="text-label">Cast Timeline</div>
                      <div className="text-title mt-2">Every action, in order.</div>
                    </div>
                    <div className="text-sm" style={{ color: '#94a3b8' }}>
                      {isLoading ? 'Loading archive...' : `${habits.length} entries for today`}
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="mt-8 space-y-4">
                      {[0, 1, 2].map((item) => (
                        <div key={item} className="metric-panel" style={{ opacity: 0.5 }}>
                          <div className="h-4 w-32 rounded-full bg-white/8" />
                          <div className="mt-4 h-10 rounded-2xl bg-white/6" />
                        </div>
                      ))}
                    </div>
                  ) : habits.length === 0 ? (
                    <div className="mt-8 metric-panel flex-center" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                      <div>
                        <div className="text-2xl font-bold tracking-[-0.04em]" style={{ color: '#f5f3ff' }}>
                          No spells cast yet.
                        </div>
                        <div className="mx-auto mt-3 max-w-md text-sm leading-6" style={{ color: '#94a3b8' }}>
                          Log your first habit from the cauldron and it will appear here with its time, points, and school.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="spellbook-timeline mt-8">
                      <div className="timeline-line" />

                      {habits.map((habit, index) => {
                        const color = categoryColors[habit.category] || '#a78bfa';

                        return (
                          <motion.article
                            key={habit.id}
                            className="relative"
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.22 }}
                            transition={{ duration: 0.32, delay: index * 0.04 }}
                          >
                            <div className="timeline-node" style={{ background: color, boxShadow: `0 0 12px ${color}` }} />

                            <div className="spellbook-card">
                              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex items-start gap-4">
                                  <div
                                    className="glass-pill p-3"
                                    style={{
                                      borderColor: `${color}33`,
                                      background: `${color}14`,
                                      color,
                                    }}
                                  >
                                    <CategoryIcon category={habit.category} size={24} />
                                  </div>

                                  <div>
                                    <div className="text-lg font-bold capitalize tracking-[-0.03em]" style={{ color: '#f5f3ff' }}>
                                      {habit.category}
                                    </div>
                                    <div className="mt-1 text-sm leading-6" style={{ color: '#94a3b8' }}>
                                      Logged {formatRelativeTime(habit.loggedAt)} at {formatClockTime(habit.loggedAt)}
                                    </div>
                                  </div>
                                </div>

                                <div className="self-start">
                                  <span
                                    className="glass-pill px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em]"
                                    style={{
                                      color,
                                      borderColor: `${color}3d`,
                                      background: `${color}10`,
                                    }}
                                  >
                                    {habit.points} pts
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.article>
                        );
                      })}
                    </div>
                  )}
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
                    <div className="text-label">Reading Notes</div>
                    <div className="mt-4 flex flex-col gap-3">
                      <div className="activity-card text-sm leading-6" style={{ color: '#cbd5e1' }}>
                        The spellbook now loads cleanly with real data first and drops to demo history only if the backend
                        is unavailable.
                      </div>
                      <div className="activity-card text-sm leading-6" style={{ color: '#cbd5e1' }}>
                        Entries are sorted newest first so your latest action is always visible at the top.
                      </div>
                      <div className="activity-card text-sm leading-6" style={{ color: '#cbd5e1' }}>
                        Summary tiles and school totals make the page useful even before you scroll through the full
                        timeline.
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
