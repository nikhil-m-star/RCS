import { demoStore } from '../lib/demoData.js';
import { query } from '../lib/db.js';

export const getLeaderboard = async (req, res) => {
  // Demo mode fallback
  if (!process.env.DATABASE_URL) {
    return res.json(demoStore.getLeaderboard());
  }

  try {
    const result = await query(
      `
        select "id", "clerkId", "username", "pathScore", "streak"
        from "User"
        order by "pathScore" desc, "createdAt" asc
        limit 10
      `
    );

    res.json(result.rows);
  } catch (error) {
    console.error('[getLeaderboard] failed', error);
    res.status(500).json({ error: error.message });
  }
};
