import { Router } from 'express';
import { getTeam, createTeamMember, updateTeamMember, deleteTeamMember } from './team.controller.js';
import { protect } from '../../core/middleware/auth.js';
import { upload } from '../../core/middleware/upload.js';

const router = Router();

router.get('/', getTeam);
router.post('/', protect, upload.single('image'), createTeamMember);
router.put('/:id', protect, upload.single('image'), updateTeamMember);
router.delete('/:id', protect, deleteTeamMember);

export default router;
