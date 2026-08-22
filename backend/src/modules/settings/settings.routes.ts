import { Router } from 'express';
import { getSettings, updateSettings } from './settings.controller.js';
import { protect } from '../../core/middleware/auth.js';
import { upload } from '../../core/middleware/upload.js';

const router = Router();

router.get('/:key', getSettings);
// Accept 'logo' field for logo uploads, optional
router.put('/:key', protect, upload.single('logo'), updateSettings);

export default router;
