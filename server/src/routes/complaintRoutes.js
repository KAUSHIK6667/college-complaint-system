import { Router } from 'express';
import { body } from 'express-validator';
import { assign, comment, create, detail, feedback, list, status } from '../controllers/complaintController.js';
import { authorize, protect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();
const complaintFields = [
  body('title').trim().isLength({ min: 4, max: 160 }),
  body('description').trim().isLength({ min: 10, max: 5000 }),
  body('category').isIn(['Classroom', 'Laboratory', 'Hostel', 'Wi-Fi', 'Infrastructure', 'Transportation', 'Cleanliness', 'Other']),
  body('priority').optional().isIn(['Low', 'Medium', 'High', 'Critical']),
  body('location.building').trim().notEmpty()
];

router.use(protect);
router.get('/', list);
router.post('/', complaintFields, validateRequest, create);
router.get('/:id', detail);
router.put('/:id/status', authorize('staff', 'admin'), [body('status').isIn(['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'])], validateRequest, status);
router.put('/:id/assign', authorize('admin'), [body('departmentId').isMongoId(), body('staffId').optional().isMongoId()], validateRequest, assign);
router.post('/:id/comments', [body('message').trim().isLength({ min: 1, max: 3000 })], validateRequest, comment);
router.post('/:id/feedback', [body('rating').isInt({ min: 1, max: 5 })], validateRequest, feedback);
export default router;