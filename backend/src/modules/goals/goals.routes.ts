import { Router } from 'express';
import { getGoals, createGoal, updateGoal, deleteGoal } from './goals.controller.js';
import { protect } from '../../core/middleware/auth.js';

const router = Router();

router.get('/', getGoals);
router.post('/', protect, createGoal);
router.put('/:id', protect, updateGoal);
router.delete('/:id', protect, deleteGoal);

export default router;
