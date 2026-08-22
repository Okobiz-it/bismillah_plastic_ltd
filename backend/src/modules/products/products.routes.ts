import express from 'express';
import { getAll, getProductById, createProduct, updateProduct, deleteProduct } from './products.controller.js';
import { protect } from '../../core/middleware/auth.js';
import { upload } from '../../core/middleware/upload.js';

const router = express.Router();

const cpUpload = upload.fields([
  { name: 'image', maxCount: 5 },
  { name: 'images', maxCount: 15 }
]);

router.get('/', getAll);
router.get('/:id', getProductById);
router.post('/', protect, cpUpload, createProduct);
router.put('/:id', protect, cpUpload, updateProduct);
router.delete('/:id', protect, deleteProduct);

export default router;
