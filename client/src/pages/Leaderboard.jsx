import { useState, useEffect } from 'react';
import { useAuth, useUser } from '../lib/auth.js';
import { motion } from 'framer-motion';
import { NavBar } from '../components/NavBar';
import { TetrisFall } from '../components/TetrisFall';
import { FogBackground } from '../components/FogBackground';
import { PageShell } from '../components/PageShell';
import { getApiErrorMessage, getLeaderboard, setAuthToken, syncUser } from '../lib/api';

// Demo fallback
const DEMO_LEADERS = [
  { id: '1', clerkId: 'demo_user_001', username: 'wanderer', pathScore: 320, streak: 5 },
  { id: '2', clerkId: 'u2', username: 'shadowmage', pathScore: 285, streak: 8 },
  { id: '3', clerkId: 'u3', username: 'nightbloom', pathScore: 250, streak: 3 },
  { id: '4', clerkId: 'u4', username: 'emberfox', pathScore: 210, streak: 6 },
  { id: '5', clerkId: 'u5', username: 'crystalveil', pathScore: 180, streak: 4 },
  { id: '6', clerkId: 'u6', username: 'thornweaver', pathScore: 155, streak: 2 },
  { id: '7', clerkId: 'u7', username: 'mistwalker', pathScore: 130, streak: 7 },
  { id: '8', clerkId: 'u8', username: 'ashwhisper', pathScore: 100, streak: 1 },
];

export function Leaderboard() {
  const { getToken, userId } = useAuth();
  const { user } = useUser();
  const [leaders, setLeaders] = useState([]);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoadError('');
        const token = await getToken();
        setAuthToken(token);
        await syncUser(user?.username || user?.firstName || 'wanderer');
        const res = await getLeaderboard();
        setLeaders(res.data);
      } catch (error) {
        console.warn('[Footprints] API unavailable, using demo data', error);
        setLeaders(DEMO_LEADERS);
        setLoadError(getApiErrorMessage(error, 'Live leaderboard unavailable'));
      }
    };
    void load();
  }, [getToken, user?.firstName, user?.username]);

  const getGlow = (rank) => {
    const intensity = Math.max(0.6 - rank * 0.05, 0.08);
    return `0 0 ${Math.max(28 - rank * 2, 6)}px rgba(124, 58, 237, ${intensity})`;
  };

  return (
    <PageShell>
      <FogBackground />

      <div className="relative lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
        <NavBar />

        <div className="relative z-10 pt-4 lg:pt-2">
          <TetrisFall delay={0.1}>
            <h1 className="mb-8 text-center text-[11px] font-bold uppercase tracking-[0.42em] lg:text-left" style={{ color: '#a78bfa' }}>
              Coven
            </h1>
          </TetrisFall>

          {loadError && (
            <TetrisFall delay={0.16} className="mb-5">
              <div
                className="rounded-[24px] border px-5 py-4 text-sm"
                style={{
                  borderColor: 'rgba(251, 191, 36, 0.18)',
                  background: 'rgba(54, 35, 10, 0.24)',
                  color: '#fde68a',
                }}
              >
                {loadError}
              </div>
            </TetrisFall>
          )}

          <div className="space-y-3">
            {leaders.map((leader, i) => {
              const isCurrentUser = leader.clerkId === userId;
              const initialRotate = ((i + 1) % 6) - 3;
              return (
                <motion.div
                  key={leader.id}
                  className="flex items-center gap-4 rounded-[24px] p-4 lg:p-5"
                  style={{
                    background: isCurrentUser
                      ? 'linear-gradient(180deg, rgba(62,28,104,0.36), rgba(25,18,40,0.92))'
                      : 'linear-gradient(180deg, rgba(19,19,29,0.98), rgba(16,16,24,0.98))',
                    border: `1px solid ${isCurrentUser ? 'rgba(124, 58, 237, 0.4)' : 'rgba(124, 58, 237, 0.08)'}`,
                    boxShadow: i < 3 ? getGlow(i) : '0 14px 28px rgba(0,0,0,0.22)',
                  }}
                  initial={{ y: '-120vh', opacity: 0, rotate: initialRotate }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  transition={{
                    type: 'spring',
                    damping: 14,
                    stiffness: 80,
                    delay: 0.15 + i * 0.08,
                  }}
                >
                  <div
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold"
                    style={{
                      background: i === 0 ? '#7c3aed' : i < 3 ? 'rgba(124, 58, 237, 0.2)' : 'rgba(124, 58, 237, 0.08)',
                      color: i === 0 ? '#e2e8f0' : '#a78bfa',
                      boxShadow: i < 3 ? getGlow(i) : 'none',
                    }}
                  >
                    {i + 1}
                  </div>

                  <span
                    className="flex-1 truncate font-semibold"
                    style={{ color: isCurrentUser ? '#a78bfa' : '#e2e8f0' }}
                  >
                    {leader.username}
                  </span>

                  <span className="font-bold text-lg" style={{ color: '#a78bfa' }}>
                    {leader.pathScore}
                  </span>
                </motion.div>
              );
            })}

            {leaders.length === 0 && (
              <TetrisFall delay={0.2}>
                <div className="py-20 text-center text-sm lg:text-left" style={{ color: '#64748b' }}>
                  The coven is empty
                </div>
              </TetrisFall>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
