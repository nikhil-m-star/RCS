import express from 'express';
import { loginWithPassword, registerWithPassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerWithPassword);
router.post('/login', loginWithPassword);

export default router;
