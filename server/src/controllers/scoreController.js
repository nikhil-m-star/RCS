import { demoStore } from '../lib/demoData.js';
import { query } from '../lib/db.js';

export const getScore = async (req, res) => {
  // Demo mode fallback
  if (!process.env.DATABASE_URL) {
    return res.json(demoStore.getScore());
  }

  try {
    const { userId } = req.params;

    const userResult = await query(
      `select "id", "pathScore", "streak" from "User" where "clerkId" = $1 limit 1`,
      [userId]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const habitsResult = await query(
      `select coalesce(sum("points"), 0) as "todayScore" from "Habit" where "userId" = $1 and "loggedAt" >= $2`,
      [user.id, todayStart]
    );

    const todayScore = Number(habitsResult.rows[0]?.todayScore ?? 0);

    res.json({
      pathScore: user.pathScore,
      todayScore: Math.min(todayScore, 100),
      streak: user.streak,
    });
  } catch (error) {
    console.error('[getScore] failed', error);
    res.status(500).json({ error: error.message });
  }
};
