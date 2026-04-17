import express from 'express';
import { requireAuth } from '@clerk/express';
import { syncUser } from '../controllers/userController.js';

const router = express.Router();

router.use(requireAuth());

router.post('/sync', syncUser);

export default router;
