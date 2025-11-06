import express from 'express';
import {
    getLeaderboard,
    getUserProfile,
    sendFriendRequest,
    respondToFriendRequest,
    getFriendsList,
    getPendingFriendRequests,
    searchUsers
} from '../controllers/playerController.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import userAuth from '../middlewears/userAuth.js';

const router = express.Router();

// Public routes
router.get('/:id/profile', asyncWrapper(getUserProfile));
router.get('/leaderboard', asyncWrapper(getLeaderboard));

// Protected friend-related routes
router.post('/friends/request', userAuth, asyncWrapper(sendFriendRequest));
router.post('/friends/respond', userAuth, asyncWrapper(respondToFriendRequest));
router.get('/friends/list', userAuth, asyncWrapper(getFriendsList));
router.get('/friends/pending', userAuth, asyncWrapper(getPendingFriendRequests));
router.get('/friends/search', userAuth, asyncWrapper(searchUsers));

export default router;