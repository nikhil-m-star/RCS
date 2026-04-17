import { demoStore } from '../lib/demoData.js';
import { pool, query } from '../lib/db.js';
import { randomUUID } from 'node:crypto';

const CATEGORY_POINTS = {
  transport: 15,
  food: 10,
  energy: 20,
  water: 10,
  waste: 15,
  nature: 10,
};

export const logHabit = async (req, res) => {
  const { category } = req.body;

  // Demo mode fallback
  if (!process.env.DATABASE_URL) {
    if (!CATEGORY_POINTS[category]) {
      return res.status(400).json({ error: 'Invalid category' });
    }
    const habit = demoStore.logHabit(category);
    return res.status(201).json(habit);
  }

  try {
    const { userId } = req.auth ?? {};

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: missing Clerk user ID' });
    }

    if (!CATEGORY_POINTS[category]) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const points = CATEGORY_POINTS[category];
    const client = await pool.connect();

    try {
      await client.query('begin');

      const userResult = await client.query(
        `select "id", "streak" from "User" where "clerkId" = $1 limit 1`,
        [userId]
      );

      if (userResult.rowCount === 0) {
        await client.query('rollback');
        return res.status(404).json({ error: 'User not found. Sync first.' });
      }

      const user = userResult.rows[0];

      const habitResult = await client.query(
        `
          insert into "Habit" ("id", "userId", "category", "label", "points")
          values ($1, $2, $3, $4, $5)
          returning "id", "userId", "category", "label", "points", "loggedAt"
        `,
        [randomUUID(), user.id, category, category, points]
      );

      const habit = habitResult.rows[0];

      await client.query(
        `update "User" set "pathScore" = "pathScore" + $1 where "id" = $2`,
        [points, user.id]
      );

      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterdayStart = new Date(todayStart);
      yesterdayStart.setDate(yesterdayStart.getDate() - 1);

      const existingTodayResult = await client.query(
        `
          select 1 from "Habit"
          where "userId" = $1 and "loggedAt" >= $2 and "id" <> $3
          limit 1
        `,
        [user.id, todayStart, habit.id]
      );

      if (existingTodayResult.rowCount === 0) {
        const yesterdayResult = await client.query(
          `
            select 1 from "Habit"
            where "userId" = $1 and "loggedAt" >= $2 and "loggedAt" < $3
            limit 1
          `,
          [user.id, yesterdayStart, todayStart]
        );

        const newStreak = yesterdayResult.rowCount > 0 ? user.streak + 1 : 1;
        await client.query(
          `update "User" set "streak" = $1 where "id" = $2`,
          [newStreak, user.id]
        );
      }

      await client.query('commit');
      return res.status(201).json(habit);
    } catch (error) {
      await client.query('rollback');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('[logHabit] failed', error);
    res.status(500).json({ error: error.message });
  }
};

export const getTodayHabits = async (req, res) => {
  // Demo mode fallback
  if (!process.env.DATABASE_URL) {
    return res.json(demoStore.getHabits());
  }

  try {
    const { userId } = req.params;

    const userResult = await query(
      `select "id" from "User" where "clerkId" = $1 limit 1`,
      [userId]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const habitsResult = await query(
      `
        select "id", "userId", "category", "label", "points", "loggedAt"
        from "Habit"
        where "userId" = $1 and "loggedAt" >= $2
        order by "loggedAt" desc
      `,
      [user.id, todayStart]
    );

    res.json(habitsResult.rows);
  } catch (error) {
    console.error('[getTodayHabits] failed', error);
    res.status(500).json({ error: error.message });
  }
};
