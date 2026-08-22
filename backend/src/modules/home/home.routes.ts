import express from 'express';
import { getAll } from './home.controller.js';

const router = express.Router();

router.get('/', getAll);
// router.post('/', protect, create);
// router.put('/:id', protect, update);
// router.delete('/:id', protect, remove);

export default router;
