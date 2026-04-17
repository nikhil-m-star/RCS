import prisma from '../lib/prisma.js';
import { demoStore } from '../lib/demoData.js';

export const syncUser = async (req, res) => {
  const { userId } = req.auth;
  const { username } = req.body;

  // Check if we are in demo mode (no DB URL)
  if (!process.env.DATABASE_URL) {
    return res.json(demoStore.syncUser(username));
  }

  try {
    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: { username: username || 'wanderer' },
      create: {
        clerkId: userId,
        username: username || 'wanderer',
      },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
