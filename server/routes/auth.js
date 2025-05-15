import express from 'express';
import {
    signup,
    login,
    guestRegister,
    guestlogin,
    logout,
    userChange,
    deleteAccount,
    getMe,
} from '../controllers/authController.js';
import userAuth from './../middlewears/userAuth.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';

const router = express.Router();

router.post('/signup', asyncWrapper(signup));
router.post('/login', asyncWrapper(login));
router.post('/guest-register', asyncWrapper(guestRegister));      // creates guest
router.post('/guest-login', asyncWrapper(guestlogin));            // logs back in
router.post('/logout', asyncWrapper(logout));                     // logs out user
router.patch('/update', userAuth, asyncWrapper(userChange));      // updates user info
router.delete('/delete', userAuth, asyncWrapper(deleteAccount));  // deletes user account
router.get('/me', userAuth, asyncWrapper(getMe));                  // gets user info

export default router;
