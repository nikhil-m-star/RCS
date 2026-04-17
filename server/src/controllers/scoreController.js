import prisma from '../lib/prisma.js';

export const getScore = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate today's score
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const todayHabits = await prisma.habit.findMany({
      where: {
        userId: user.id,
        loggedAt: { gte: todayStart },
      },
    });

    const todayScore = todayHabits.reduce((sum, h) => sum + h.points, 0);

    res.json({
      pathScore: user.pathScore,
      todayScore: Math.min(todayScore, 100),
      streak: user.streak,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
