import prisma from '../lib/prisma.js';
import { demoStore } from '../lib/demoData.js';

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
    const { userId } = req.auth;

    if (!CATEGORY_POINTS[category]) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const points = CATEGORY_POINTS[category];

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found. Sync first.' });
    }

    const habit = await prisma.habit.create({
      data: {
        userId: user.id,
        category,
        label: category,
        points,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { pathScore: { increment: points } },
    });

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);

    const existingTodayHabit = await prisma.habit.findFirst({
      where: {
        userId: user.id,
        loggedAt: { gte: todayStart },
        id: { not: habit.id },
      },
    });

    if (!existingTodayHabit) {
      const yesterdayHabit = await prisma.habit.findFirst({
        where: {
          userId: user.id,
          loggedAt: { gte: yesterdayStart, lt: todayStart },
        },
      });

      const newStreak = yesterdayHabit ? user.streak + 1 : 1;
      await prisma.user.update({
        where: { id: user.id },
        data: { streak: newStreak },
      });
    }

    res.status(201).json(habit);
  } catch (error) {
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

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const habits = await prisma.habit.findMany({
      where: {
        userId: user.id,
        loggedAt: { gte: todayStart },
      },
      orderBy: { loggedAt: 'desc' },
    });

    res.json(habits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
