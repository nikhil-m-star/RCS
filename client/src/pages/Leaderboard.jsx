import { useState, useEffect } from 'react';
import { useAuth, useUser } from '../lib/authHooks.js';
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
      <div className="container" style={{ paddingTop: '1.25rem' }}>
        <div className="dashboard-grid">
          <NavBar />

          <div className="relative z-10 pt-4 lg:pt-2">
            <TetrisFall delay={0.1}>
              <h1 className="text-label mb-8 text-center lg:text-left">
                Coven
              </h1>
            </TetrisFall>

            {loadError && (
              <TetrisFall delay={0.16} className="mb-5">
                <div
                  className="error-banner"
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

            <div className="leaderboard-list">
              {leaders.map((leader, i) => {
                const isCurrentUser = leader.clerkId === userId;
                const initialRotate = ((i + 1) % 6) - 3;
                const isTopThree = i < 3;

                return (
                  <motion.div
                    key={leader.id}
                    className={`leaderboard-item ${isCurrentUser ? 'active' : ''}`}
                    initial={{ y: '-120vh', opacity: 0, rotate: initialRotate }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    transition={{
                      type: 'spring',
                      damping: 14,
                      stiffness: 80,
                      delay: 0.15 + i * 0.08,
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`rank-badge ${isTopThree ? 'top' : ''}`}>
                        {i + 1}
                      </div>

                      <span
                        className="truncate font-semibold"
                        style={{ color: isCurrentUser ? '#a78bfa' : '#e2e8f0' }}
                      >
                        {leader.username}
                      </span>
                    </div>

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
      </div>
    </PageShell>
  );
}
