import { demoStore } from '../lib/demoData.js';
import { query } from '../lib/db.js';
import { randomUUID } from 'node:crypto';

export const syncUser = async (req, res) => {
  const { userId } = req.auth ?? {};
  const { username } = req.body;

  // Check if we are in demo mode (no DB URL)
  if (!process.env.DATABASE_URL) {
    return res.json(demoStore.syncUser(username));
  }

  try {
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: missing Clerk user ID' });
    }

    const result = await query(
      `
        insert into "User" ("id", "clerkId", "username")
        values ($1, $2, $3)
        on conflict ("clerkId")
        do update set "username" = excluded."username"
        returning "id", "clerkId", "username", "pathScore", "streak", "createdAt"
      `,
      [randomUUID(), userId, username || 'wanderer']
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('[syncUser] failed', error);
    res.status(500).json({ error: error.message });
  }
};
