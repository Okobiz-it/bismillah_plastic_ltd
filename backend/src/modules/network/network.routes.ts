import { Router } from 'express';
import {
  getNetwork,
  updateCategoryMap,
  addCountry,
  updateCountry,
  deleteCountry,
  addMarker,
  updateMarker,
  deleteMarker,
  getInfrastructureGallery,
  addInfrastructureImages,
  updateInfrastructureItem,
  reorderInfrastructureItems,
  deleteInfrastructureItem,
} from './network.controller.js';
import { protect } from '../../core/middleware/auth.js';
import { upload } from '../../core/middleware/upload.js';

const router = Router();

// Public routes
router.get('/', getNetwork);
router.get('/infrastructure', getInfrastructureGallery);

// Protected routes (Admin)
router.use(protect);

// Category Map Upload
router.put('/:categoryName/map', upload.single('mapImage'), updateCategoryMap);

// Country CRUD
router.post('/:categoryName/countries', addCountry);
router.put('/:categoryName/countries/:countryId', updateCountry);
router.delete('/:categoryName/countries/:countryId', deleteCountry);

// Marker CRUD
router.post('/:categoryName/countries/:countryId/markers', addMarker);
router.put('/:categoryName/countries/:countryId/markers/:markerId', updateMarker);
router.delete('/:categoryName/countries/:countryId/markers/:markerId', deleteMarker);

// Infrastructure & Logistics Gallery Protected Routes
router.post('/infrastructure', upload.array('images', 9), addInfrastructureImages);
router.put('/infrastructure/reorder', reorderInfrastructureItems);
router.put('/infrastructure/:id', upload.single('image'), updateInfrastructureItem);
router.delete('/infrastructure/:id', deleteInfrastructureItem);

export default router;
