import { Router } from 'express';
import { getCertifications, createCertification, updateCertification, deleteCertification } from './certifications.controller.js';
import { protect } from '../../core/middleware/auth.js';
import { upload } from '../../core/middleware/upload.js';

const router = Router();

router.get('/', getCertifications);
router.post('/', protect, upload.single('image'), createCertification);
router.put('/:id', protect, upload.single('image'), updateCertification);
router.delete('/:id', protect, deleteCertification);

export default router;
