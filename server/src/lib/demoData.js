// In-memory store for demo mode
let demoScore = { todayScore: 45, pathScore: 320, streak: 5 };
let demoHabits = [
  { id: 'demo1', category: 'transport', points: 15, loggedAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'demo2', category: 'water', points: 10, loggedAt: new Date(Date.now() - 7200000).toISOString() },
];

export const demoStore = {
  getScore: () => demoScore,
  getHabits: () => demoHabits,
  logHabit: (category) => {
    const points = 10; // Simple fixed points for demo
    const newHabit = {
      id: `demo-${Date.now()}`,
      category,
      points,
      loggedAt: new Date().toISOString()
    };
    demoHabits = [newHabit, ...demoHabits];
    demoScore.todayScore += points;
    demoScore.pathScore += points;
    return newHabit;
  },
  getLeaderboard: () => [
    { id: 'd1', clerkId: 'demo_user_001', username: 'wanderer', pathScore: demoScore.pathScore },
    { id: 'd2', clerkId: 'u2', username: 'shadowmage', pathScore: 285 },
    { id: 'd3', clerkId: 'u3', username: 'nightbloom', pathScore: 250 },
    { id: 'd4', clerkId: 'u4', username: 'emberfox', pathScore: 210 },
    { id: 'd5', clerkId: 'u5', username: 'crystalveil', pathScore: 180 },
  ],
  syncUser: (username) => ({
    clerkId: 'demo_user_001',
    username: username || 'wanderer',
    pathScore: demoScore.pathScore,
    streak: demoScore.streak
  })
};
