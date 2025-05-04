import express from 'express';
import {
    signup,
    login,
    guestRegister,
    guestlogin,
    logout,
} from '../controllers/authController.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';

const router = express.Router();

router.post('/signup', asyncWrapper(signup));
router.post('/login', asyncWrapper(login));
router.post('/guest-register', asyncWrapper(guestRegister)); // creates guest
router.post('/guest-login', asyncWrapper(guestlogin));       // logs back in
router.post('/logout', asyncWrapper(logout));

export default router;
