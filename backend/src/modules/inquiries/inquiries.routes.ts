import express from 'express';
import { createInquiry, getAllInquiries, updateInquiryStatus, deleteInquiry, replyToInquiry } from './inquiries.controller.js';
import { protect } from '../../core/middleware/auth.js';
import { upload } from '../../core/middleware/upload.js';

const router = express.Router();

router.post('/', upload.single('brochure'), createInquiry); // Public endpoint for contact forms & quote requests
router.get('/', protect, getAllInquiries); // Admin only
router.patch('/:id/status', protect, updateInquiryStatus); // Admin only
router.post('/:id/reply', protect, replyToInquiry); // Admin reply via email
router.delete('/:id', protect, deleteInquiry); // Admin only

export default router;

