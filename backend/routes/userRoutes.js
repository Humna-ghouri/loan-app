// backend/routes/userRoutes.js
import express from 'express';
import { login, register, changePassword, getCurrentUser } from '../controllers/authController.js';
import authenticate from '../Middlewares/authenticate.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/change-password', changePassword);
router.get('/me', authenticate, getCurrentUser);

export default router;
