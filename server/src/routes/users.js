import express from 'express';
import { requireAuth } from '../lib/auth.js';
import { syncUser } from '../controllers/userController.js';

const router = express.Router();

router.use(requireAuth());

router.post('/sync', syncUser);

export default router;
