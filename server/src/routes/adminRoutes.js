import { Router } from 'express';
import { body } from 'express-validator';
import { createDepartment, departments, stats, updateDepartment } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();
router.use(protect, authorize('admin'));
router.get('/stats', stats);
router.get('/departments', departments);
router.post('/departments', [body('name').trim().notEmpty(), body('code').trim().notEmpty()], validateRequest, createDepartment);
router.put('/departments/:id', updateDepartment);
export default router;