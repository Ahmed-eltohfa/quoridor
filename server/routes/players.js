import express from 'express';
import { getUserProfile } from '../controllers/playerController.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';

const router = express.Router();

// GET /api/users/:username/profile
router.get('/users/:id/profile', asyncWrapper(getUserProfile));

export default router;