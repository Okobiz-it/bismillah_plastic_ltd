import express from 'express';
import {
  getPageBanner,
  getAllPageBanners,
  upsertPageBanner,
  deletePageBanner,
} from './page-banner.controller.js';
import { protect } from '../../core/middleware/auth.js';
import { upload } from '../../core/middleware/upload.js';

const router = express.Router();

router.get('/', getAllPageBanners);

// Two-level routes (e.g. /about/mission-vision, /about/management)
router.get('/:category/:page', getPageBanner);
router.put('/:category/:page', protect, upload.single('image'), upsertPageBanner);
router.delete('/:category/:page', protect, deletePageBanner);

// Single-level routes (e.g. /about, /products, /business-operations, /impact, /photos-videos)
router.get('/:page', getPageBanner);
router.put('/:page', protect, upload.single('image'), upsertPageBanner);
router.delete('/:page', protect, deletePageBanner);

export default router;
