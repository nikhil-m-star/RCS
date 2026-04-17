import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProjects = async (req, res) => {
  try {
    const { userId } = req.auth;
    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    // Ensure user exists in our DB (Sync from Clerk)
    // In a real app, you might use Webhooks, but this is a fail-safe.
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { 
        id: userId,
        email: req.auth.sessionClaims?.email || 'user@example.com', // fallback
      },
    });

    const project = await prisma.project.create({
      data: {
        name,
        description,
        userId,
      },
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project || project.userId !== userId) {
      return res.status(404).json({ error: 'Project not found or unauthorized' });
    }

    await prisma.project.delete({
      where: { id },
    });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
