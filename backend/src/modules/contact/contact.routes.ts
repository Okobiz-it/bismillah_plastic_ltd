import express from 'express';
import { getContact, updateContact } from './contact.controller.js';
import { protect } from '../../core/middleware/auth.js';

const router = express.Router();

router.get('/', getContact);
router.put('/', protect, updateContact);

export default router;
