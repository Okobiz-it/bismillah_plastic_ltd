import express from 'express';
import { getAll, createClient, updateClient, deleteClient } from './clients.controller.js';
import { protect } from '../../core/middleware/auth.js';
import { upload } from '../../core/middleware/upload.js';

const router = express.Router();

router.get('/', getAll);
router.post('/', protect, upload.single('image'), createClient);
router.put('/:id', protect, upload.single('image'), updateClient);
router.delete('/:id', protect, deleteClient);

export default router;
