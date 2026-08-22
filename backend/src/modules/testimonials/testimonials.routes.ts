import { Router } from 'express';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from './testimonials.controller.js';
import { protect } from '../../core/middleware/auth.js';

const router = Router();

router.get('/', getTestimonials);
router.post('/', protect, createTestimonial);
router.put('/:id', protect, updateTestimonial);
router.delete('/:id', protect, deleteTestimonial);

export default router;
