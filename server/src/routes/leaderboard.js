import express from 'express';
import { requireAuth } from '@clerk/express';
import { getLeaderboard } from '../controllers/leaderboardController.js';

const router = express.Router();

router.use(requireAuth());

router.get('/', getLeaderboard);

export default router;
