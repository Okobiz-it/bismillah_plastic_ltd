import { Router } from 'express';
import { login, forgotPassword, verifyOtp, resetPassword, getAdminProfile, updateAdminEmail, updateAdminPassword } from './auth.controller.js';
import { protect } from '../../core/middleware/auth.js';
const router = Router();

router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

router.get('/me', protect, getAdminProfile);
router.put('/update-email', protect, updateAdminEmail);
router.put('/update-password', protect, updateAdminPassword);

export default router;
