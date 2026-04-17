import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import habitRoutes from './routes/habits.js';
import scoreRoutes from './routes/score.js';
import leaderboardRoutes from './routes/leaderboard.js';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import { ensureAuthTables } from './lib/initDb.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
if (process.env.CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY) {
  app.use(clerkMiddleware());
} else {
  console.log('[Footprints] No Clerk keys found - running server in Demo Mode');
  app.use((req, res, next) => {
    req.auth = { userId: 'demo_user_001' };
    next();
  });
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Footprints Backend is running' });
});

// Footprints Routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/score', scoreRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/users', userRoutes);

ensureAuthTables()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('[Footprints] Failed to initialize auth tables', error);
    process.exit(1);
  });
