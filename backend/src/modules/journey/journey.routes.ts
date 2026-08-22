import express from 'express';
import { getAll, createJourney, updateJourney, deleteJourney } from './journey.controller.js';
import { protect } from '../../core/middleware/auth.js';

const router = express.Router();

router.get('/', getAll);
router.post('/', protect, createJourney);
router.put('/:id', protect, updateJourney);
router.delete('/:id', protect, deleteJourney);

export default router;
