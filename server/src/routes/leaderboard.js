import express from 'express';
import { requireAuth } from '../lib/auth.js';
import { getLeaderboard } from '../controllers/leaderboardController.js';

const router = express.Router();

router.use(requireAuth());

router.get('/', getLeaderboard);

export default router;
