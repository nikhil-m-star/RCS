import prisma from '../lib/prisma.js';
import { demoStore } from '../lib/demoData.js';

export const getLeaderboard = async (req, res) => {
  // Demo mode fallback
  if (!process.env.DATABASE_URL) {
    return res.json(demoStore.getLeaderboard());
  }

  try {
    const top10 = await prisma.user.findMany({
      orderBy: { pathScore: 'desc' },
      take: 10,
      select: {
        id: true,
        clerkId: true,
        username: true,
        pathScore: true,
        streak: true,
      },
    });

    res.json(top10);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
