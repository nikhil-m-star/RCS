import express from 'express';
import { requireAuth } from '../lib/auth.js';
import { logHabit, getTodayHabits } from '../controllers/habitController.js';

const router = express.Router();

router.use(requireAuth());

router.post('/', logHabit);
router.get('/:userId', getTodayHabits);

export default router;
