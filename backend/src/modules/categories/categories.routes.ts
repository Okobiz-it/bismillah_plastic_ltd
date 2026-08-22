import express from 'express';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from './categories.controller.js';
import { protect } from '../../core/middleware/auth.js';
import { upload } from '../../core/middleware/upload.js';

const router = express.Router();

router.get('/', getAllCategories);
router.post('/', protect, upload.single('image'), createCategory);
router.put('/:id', protect, upload.single('image'), updateCategory);
router.delete('/:id', protect, deleteCategory);

export default router;
