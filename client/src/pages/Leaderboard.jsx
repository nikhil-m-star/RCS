import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth.js';
import { motion } from 'framer-motion';
import { NavBar } from '../components/NavBar';
import { TetrisFall } from '../components/TetrisFall';
import { FogBackground } from '../components/FogBackground';
import { getLeaderboard, setAuthToken } from '../lib/api';

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
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getToken();
        setAuthToken(token);
        const res = await getLeaderboard();
        setLeaders(res.data);
      } catch (err) {
        console.warn('[Footprints] API unavailable, using demo data');
        setLeaders(DEMO_LEADERS);
      }
    };
    load();
  }, []);

  const getGlow = (rank) => {
    const intensity = Math.max(0.6 - rank * 0.05, 0.08);
    return `0 0 ${Math.max(28 - rank * 2, 6)}px rgba(124, 58, 237, ${intensity})`;
  };

  return (
    <div className="min-h-screen relative pb-24" style={{ background: '#0a0a0f' }}>
      <FogBackground />

      <div className="relative z-10 max-w-[430px] mx-auto px-4 pt-10">
        <TetrisFall delay={0.1}>
          <h1 className="text-2xl font-bold mb-8 text-center" style={{ color: '#a78bfa' }}>
            Coven
          </h1>
        </TetrisFall>

        <div className="space-y-3">
          {leaders.map((leader, i) => {
            const isCurrentUser = leader.clerkId === userId;
            return (
              <motion.div
                key={leader.id}
                className="flex items-center gap-4 rounded-xl p-4"
                style={{
                  background: isCurrentUser ? 'rgba(124, 58, 237, 0.1)' : '#12121a',
                  border: `1px solid ${isCurrentUser ? 'rgba(124, 58, 237, 0.4)' : 'rgba(124, 58, 237, 0.08)'}`,
                  boxShadow: i < 3 ? getGlow(i) : 'none',
                }}
                initial={{ y: '-120vh', opacity: 0, rotate: Math.random() * 6 - 3 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  damping: 14,
                  stiffness: 80,
                  delay: 0.15 + i * 0.08,
                }}
              >
                {/* Rank */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{
                    background: i === 0 ? '#7c3aed' : i < 3 ? 'rgba(124, 58, 237, 0.2)' : 'rgba(124, 58, 237, 0.08)',
                    color: i === 0 ? '#e2e8f0' : '#a78bfa',
                    boxShadow: i < 3 ? getGlow(i) : 'none',
                  }}
                >
                  {i + 1}
                </div>

                {/* Username */}
                <span
                  className="flex-1 font-semibold truncate"
                  style={{ color: isCurrentUser ? '#a78bfa' : '#e2e8f0' }}
                >
                  {leader.username}
                </span>

                {/* Score */}
                <span className="font-bold text-lg" style={{ color: '#a78bfa' }}>
                  {leader.pathScore}
                </span>
              </motion.div>
            );
          })}

          {leaders.length === 0 && (
            <TetrisFall delay={0.2}>
              <div className="text-center py-20 text-sm" style={{ color: '#64748b' }}>
                The coven is empty
              </div>
            </TetrisFall>
          )}
        </div>
      </div>

      <NavBar />
    </div>
  );
}
