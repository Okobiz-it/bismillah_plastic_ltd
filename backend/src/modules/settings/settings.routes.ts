import { Router } from 'express';
import { getSettings, updateSettings, uploadSettingsImage } from './settings.controller.js';
import { protect } from '../../core/middleware/auth.js';
import { upload } from '../../core/middleware/upload.js';

const router = Router();

router.post('/upload', protect, upload.single('image'), uploadSettingsImage);
router.get('/:key', getSettings);
// Accept 'logo' field for logo uploads, optional
router.put('/:key', protect, upload.single('logo'), updateSettings);

export default router;
