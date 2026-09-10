import { Router } from 'express';
import {
  getPhotos,
  addPhotos,
  updatePhoto,
  deletePhoto,
  reorderPhotos,
  getVideos,
  createVideo,
  updateVideo,
  deleteVideo,
  reorderVideos,
  uploadVideoAsset,
} from './media.controller.js';
import { protect } from '../../core/middleware/auth.js';
import { upload, videoUpload } from '../../core/middleware/upload.js';

const router = Router();

// Photos Routes
router.get('/photos', getPhotos);
router.post('/photos', protect, upload.array('images', 20), addPhotos);
router.put('/photos/reorder', protect, reorderPhotos);
router.put('/photos/:id', protect, upload.single('image'), updatePhoto);
router.delete('/photos/:id', protect, deletePhoto);

// Videos Routes
router.get('/videos', getVideos);
router.post('/videos/upload', protect, videoUpload.single('video'), uploadVideoAsset);
router.post('/videos', protect, upload.single('thumbnail'), createVideo);
router.put('/videos/reorder', protect, reorderVideos);
router.put('/videos/:id', protect, upload.single('thumbnail'), updateVideo);
router.delete('/videos/:id', protect, deleteVideo);

export default router;
