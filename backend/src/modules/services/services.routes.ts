import express from 'express';
import {
  getAll,
  getHeaders,
  updateHeader,
  create,
  update,
  remove,
  getPartners,
  createPartner,
  updatePartner,
  deletePartner,
  getCategoryItems,
  createCategoryItem,
  updateCategoryItem,
  deleteCategoryItem
} from './services.controller.js';
import { protect } from '../../core/middleware/auth.js';
import { upload } from '../../core/middleware/upload.js';

const router = express.Router();

router.get('/', getAll);
router.get('/headers', getHeaders);
router.put('/headers/:category', protect, updateHeader);

router.get('/partners', getPartners);
router.post('/partners', protect, upload.single('image'), createPartner);
router.put('/partners/:id', protect, upload.single('image'), updatePartner);
router.delete('/partners/:id', protect, deletePartner);

router.get('/category-items', getCategoryItems);
router.post('/category-items', protect, upload.single('image'), createCategoryItem);
router.put('/category-items/:id', protect, upload.single('image'), updateCategoryItem);
router.delete('/category-items/:id', protect, deleteCategoryItem);

router.post('/', protect, create);
router.put('/:id', protect, update);
router.delete('/:id', protect, remove);

export default router;
