import express from 'express';
import { requireAuth } from '../lib/auth.js';
import { getScore } from '../controllers/scoreController.js';

const router = express.Router();

router.use(requireAuth());

router.get('/:userId', getScore);

export default router;
