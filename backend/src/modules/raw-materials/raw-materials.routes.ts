import express from 'express';
import { getAll, createRawMaterial, updateRawMaterial, deleteRawMaterial, reorderRawMaterials } from './raw-materials.controller.js';
import { protect } from '../../core/middleware/auth.js';
import { upload } from '../../core/middleware/upload.js';

const router = express.Router();

router.get('/', getAll);
router.post('/', protect, upload.single('image'), createRawMaterial);
router.put('/reorder', protect, reorderRawMaterials);
router.put('/:id', protect, upload.single('image'), updateRawMaterial);
router.delete('/:id', protect, deleteRawMaterial);

export default router;
