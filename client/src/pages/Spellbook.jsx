import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth, useUser, UserButton } from '../lib/auth.js';
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
      <FogBackground />

      <div className="relative lg:grid lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
        <NavBar />

        <div className="relative z-10 flex min-h-[calc(100vh-6rem)] flex-col pt-2 lg:min-h-0 lg:pt-0">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <TetrisFall delay={0.08} className="max-w-3xl">
              <div
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.34em]"
                style={{
                  color: '#c4b5fd',
                  borderColor: 'rgba(167,139,250,0.2)',
                  background: 'rgba(16, 16, 24, 0.72)',
                  boxShadow: '0 14px 28px rgba(0,0,0,0.22)',
                }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: '#a78bfa', boxShadow: '0 0 18px rgba(167,139,250,0.9)' }}
                />
                Spellbook Archive
              </div>

              <h1
                className="mt-5 text-4xl font-bold tracking-[-0.07em] sm:text-5xl lg:text-6xl"
                style={{ color: '#f5f3ff' }}
              >
                Today&apos;s cast history,
                <span className="block" style={{ color: '#a78bfa' }}>
                  organized like a real ledger.
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 sm:text-base" style={{ color: '#94a3b8' }}>
                {profileName}&apos;s latest eco-actions live here with timestamps, category streaks, and a cleaner
                breakdown of how today&apos;s points were earned.
              </p>
            </TetrisFall>

            <TetrisFall delay={0.15}>
              <div className="flex items-center justify-between gap-3 lg:justify-end">
                <div
                  className="rounded-full border px-4 py-2 text-sm font-semibold"
                  style={{
                    color: '#e2e8f0',
                    borderColor: 'rgba(167,139,250,0.2)',
                    background: 'rgba(16, 16, 24, 0.76)',
                  }}
                >
                  {mostRecentHabit ? `Last cast ${formatRelativeTime(mostRecentHabit.loggedAt)}` : 'Ready to log'}
                </div>
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
              </div>
            </TetrisFall>
          </div>

          <TetrisFall delay={0.22} className="mt-8">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
                <div
                  key={card.label}
                  className="relative overflow-hidden rounded-[28px] border p-5"
                  style={{
                    borderColor: 'rgba(167,139,250,0.14)',
                    background: 'linear-gradient(180deg, rgba(18,18,27,0.92), rgba(10,10,16,0.9))',
                    boxShadow: '0 18px 42px rgba(0,0,0,0.24)',
                  }}
                >
                  <div className="text-[11px] uppercase tracking-[0.32em]" style={{ color: '#64748b' }}>
                    {card.label}
                  </div>
                  <div
                    className="mt-4 text-3xl font-bold capitalize tracking-[-0.05em] sm:text-4xl"
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
              <div
                className="rounded-[26px] border px-5 py-4 text-sm leading-6"
                style={{
                  borderColor: 'rgba(251, 191, 36, 0.18)',
                  background: 'rgba(54, 35, 10, 0.24)',
                  color: '#fde68a',
                }}
              >
                {loadError}. Demo entries are filling the page so the spellbook still stays usable while the backend
                is down.
              </div>
            </TetrisFall>
          )}

          <div className="mt-8 grid flex-1 gap-5 xl:grid-cols-[minmax(0,1.35fr)_360px]">
            <TetrisFall delay={0.32}>
              <section
                className="relative overflow-hidden rounded-[32px] border p-5 sm:p-6"
                style={{
                  borderColor: 'rgba(167,139,250,0.16)',
                  background: 'linear-gradient(180deg, rgba(17,17,25,0.92), rgba(10,10,15,0.96))',
                  boxShadow: '0 26px 60px rgba(0,0,0,0.34)',
                }}
              >
                <div className="pointer-events-none absolute inset-x-8 top-0 h-20 bg-gradient-to-b from-[#7c3aed12] to-transparent" />

                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.34em]" style={{ color: '#64748b' }}>
                      Cast Timeline
                    </div>
                    <div className="mt-2 text-2xl font-bold tracking-[-0.05em]" style={{ color: '#f5f3ff' }}>
                      Every action, in order.
                    </div>
                  </div>
                  <div className="text-sm" style={{ color: '#94a3b8' }}>
                    {isLoading ? 'Loading archive...' : `${habits.length} entries for today`}
                  </div>
                </div>

                {isLoading ? (
                  <div className="mt-6 space-y-4">
                    {[0, 1, 2].map((item) => (
                      <div
                        key={item}
                        className="rounded-[24px] border p-5"
                        style={{
                          borderColor: 'rgba(255,255,255,0.05)',
                          background: 'rgba(255,255,255,0.02)',
                        }}
                      >
                        <div className="h-4 w-32 rounded-full bg-white/8" />
                        <div className="mt-4 h-10 rounded-2xl bg-white/6" />
                      </div>
                    ))}
                  </div>
                ) : habits.length === 0 ? (
                  <div
                    className="mt-6 rounded-[28px] border px-6 py-16 text-center"
                    style={{
                      borderColor: 'rgba(255,255,255,0.06)',
                      background: 'rgba(255,255,255,0.015)',
                    }}
                  >
                    <div className="text-2xl font-bold tracking-[-0.04em]" style={{ color: '#f5f3ff' }}>
                      No spells cast yet.
                    </div>
                    <div className="mx-auto mt-3 max-w-md text-sm leading-6" style={{ color: '#94a3b8' }}>
                      Log your first habit from the cauldron and it will appear here with its time, points, and school.
                    </div>
                  </div>
                ) : (
                  <div className="relative mt-6">
                    <div
                      className="absolute bottom-5 left-[18px] top-5 w-px"
                      style={{ background: 'linear-gradient(180deg, rgba(167,139,250,0.18), rgba(96,165,250,0.06))' }}
                    />

                    <div className="space-y-4">
                      {habits.map((habit, index) => {
                        const color = categoryColors[habit.category] || '#a78bfa';

                        return (
                          <motion.article
                            key={habit.id}
                            className="relative pl-12"
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.22 }}
                            transition={{ duration: 0.32, delay: index * 0.04 }}
                          >
                            <span
                              className="absolute left-[11px] top-6 h-4 w-4 rounded-full border-2"
                              style={{
                                borderColor: color,
                                background: '#0a0a0f',
                                boxShadow: `0 0 18px ${color}55`,
                              }}
                            />

                            <div
                              className="rounded-[28px] border p-5 sm:p-6"
                              style={{
                                borderColor: 'rgba(167,139,250,0.12)',
                                background:
                                  'linear-gradient(180deg, rgba(19,19,29,0.98), rgba(13,13,21,0.98))',
                                boxShadow: '0 16px 32px rgba(0,0,0,0.22)',
                              }}
                            >
                              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex items-start gap-4">
                                  <div
                                    className="rounded-2xl border p-3"
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

                                <div className="flex items-center gap-2 self-start sm:justify-end">
                                  <span
                                    className="rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em]"
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
                  </div>
                )}
              </section>
            </TetrisFall>

            <div className="space-y-5">
              <TetrisFall delay={0.38}>
                <section
                  className="rounded-[30px] border p-5"
                  style={{
                    borderColor: 'rgba(167,139,250,0.16)',
                    background: 'linear-gradient(180deg, rgba(16,16,24,0.9), rgba(10,10,15,0.95))',
                  }}
                >
                  <div className="text-[11px] uppercase tracking-[0.34em]" style={{ color: '#64748b' }}>
                    School Breakdown
                  </div>

                  <div className="mt-5 space-y-4">
                    {categorySummary.length === 0 ? (
                      <div
                        className="rounded-[24px] border px-4 py-8 text-sm leading-6"
                        style={{
                          borderColor: 'rgba(255,255,255,0.06)',
                          background: 'rgba(255,255,255,0.015)',
                          color: '#94a3b8',
                        }}
                      >
                        Category totals will appear after your first cast.
                      </div>
                    ) : (
                      categorySummary.map((item) => (
                        <div key={item.category} className="space-y-2">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div
                                className="h-3 w-3 rounded-full"
                                style={{ background: item.color, boxShadow: `0 0 14px ${item.color}` }}
                              />
                              <div className="text-sm font-medium capitalize" style={{ color: '#f5f3ff' }}>
                                {item.category}
                              </div>
                            </div>
                            <div className="text-sm font-semibold" style={{ color: '#c4b5fd' }}>
                              {item.points} pts
                            </div>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-white/6">
                            <div
                              className="h-full rounded-full"
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
                </section>
              </TetrisFall>

              <TetrisFall delay={0.44}>
                <section
                  className="rounded-[30px] border p-5"
                  style={{
                    borderColor: 'rgba(167,139,250,0.16)',
                    background: 'linear-gradient(180deg, rgba(16,16,24,0.9), rgba(10,10,15,0.95))',
                  }}
                >
                  <div className="text-[11px] uppercase tracking-[0.34em]" style={{ color: '#64748b' }}>
                    Reading Notes
                  </div>
                  <div className="mt-4 space-y-3 text-sm leading-6" style={{ color: '#cbd5e1' }}>
                    <div className="rounded-[22px] border px-4 py-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      The spellbook now loads cleanly with real data first and drops to demo history only if the backend
                      is unavailable.
                    </div>
                    <div className="rounded-[22px] border px-4 py-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      Entries are sorted newest first so your latest action is always visible at the top.
                    </div>
                    <div className="rounded-[22px] border px-4 py-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      Summary tiles and school totals make the page useful even before you scroll through the full
                      timeline.
                    </div>
                  </div>
                </section>
              </TetrisFall>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
