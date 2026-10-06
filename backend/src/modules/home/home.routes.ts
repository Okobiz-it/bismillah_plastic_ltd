import express from 'express';
import { getBanners, createBanner, deleteBanner, updateBannersOrder, toggleBannerActive, getAll } from './home.controller.js';
import { protect } from '../../core/middleware/auth.js';
import { upload } from '../../core/middleware/upload.js';

const router = express.Router();

router.get('/', getAll); // keep for backward compatibility if any
router.get('/banners', getBanners);
router.post('/banners', protect, upload.single('image'), createBanner);
router.delete('/banners/:id', protect, deleteBanner);
router.put('/banners/reorder', protect, updateBannersOrder);
router.patch('/banners/:id/toggle', protect, toggleBannerActive);

export default router;
