import { Router } from 'express';
import { getCountries, createCountry, updateCountry, deleteCountry } from './countries.controller.js';
import { protect } from '../../core/middleware/auth.js';

const router = Router();

router.get('/', getCountries);
router.post('/', protect, createCountry);
router.put('/:id', protect, updateCountry);
router.delete('/:id', protect, deleteCountry);

export default router;
