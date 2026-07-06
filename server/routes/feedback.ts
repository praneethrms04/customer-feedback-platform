import { Router } from 'express';
import {
  createFeedback,
  deleteFeedback,
  getAllFeedback,
  getFeedbackById,
  updateFeedback
} from '../controllers/feedbackController';
import { validateRequest } from '../middlewares/validate';
import { authenticate } from '../middlewares/auth';
import { feedbackPostLimiter } from '../middlewares/rateLimiter';
import { createFeedbackSchema, updateFeedbackSchema } from '../validators/feedback';

const router = Router();

router.post('/', feedbackPostLimiter, validateRequest(createFeedbackSchema), createFeedback);
router.get('/', authenticate, getAllFeedback);
router.get('/:id', authenticate, getFeedbackById);
router.patch('/:id', authenticate, validateRequest(updateFeedbackSchema), updateFeedback);
router.delete('/:id', authenticate, deleteFeedback);

export default router;
