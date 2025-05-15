import express from 'express';
import { getLeaderboard, getUserProfile } from '../controllers/playerController.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';

const router = express.Router();

// GET /api/users/:id/profile
router.get('/:id/profile', asyncWrapper(getUserProfile));
// GET /api/users/leaderboard
router.get('/leaderboard', asyncWrapper(getLeaderboard));
export default router;