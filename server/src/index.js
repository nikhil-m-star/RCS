import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import habitRoutes from './routes/habits.js';
import scoreRoutes from './routes/score.js';
import leaderboardRoutes from './routes/leaderboard.js';
import userRoutes from './routes/users.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Footprints Backend is running' });
});

// Footprints Routes
app.use('/api/habits', habitRoutes);
app.use('/api/score', scoreRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
