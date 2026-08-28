import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';
import { login, me, profile, register } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();
const authLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, message: { message: 'Too many authentication attempts.' } });
const credentials = [body('email').isEmail().normalizeEmail(), body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')];

router.post('/register', authLimit, [...credentials, body('name').trim().notEmpty(), body('studentId').trim().notEmpty()], validateRequest, register);
router.post('/login', authLimit, credentials, validateRequest, login);
router.get('/me', protect, me);
router.put('/profile', protect, profile);
export default router;
