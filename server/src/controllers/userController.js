import prisma from '../lib/prisma.js';

export const syncUser = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { username } = req.body;

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
