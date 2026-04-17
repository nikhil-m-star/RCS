import express from 'express';
import { requireAuth } from '@clerk/express';
import { getScore } from '../controllers/scoreController.js';

const router = express.Router();

router.use(requireAuth());

router.get('/:userId', getScore);

export default router;
