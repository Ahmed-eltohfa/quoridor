import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { generateToken } from '../utils/genToken.js';

// POST /signup
export const signup = async (req, res) => {
    const { username, email, password, avatar } = req.body;

    const exists = await User.findOne({ username });
    if (exists)
        return res.status(400).json({ success: false, message: 'Username already taken' });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email,
        password: hashed,
        isGuest: false,
        avatar: avatar || 0, // default avatar if not provided
    });

    const token = await generateToken(user);
    res.json({ success: true, token, username: user.username });
};

// POST /login
export const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
        return res.status(400).json({ success: false, message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
        return res.status(401).json({ success: false, message: 'Invalid password' });

    const token = await generateToken(user);
    user.lastLogin = Date.now();
    await user.save();

    res.json({ success: true, token, username: user.username });
};

// POST /guest
export const guestRegister = async (req, res) => {
    let username;
    while (true) {
        const temp = `Guest_${Math.floor(1000 + Math.random() * 90000)}`;
        const exists = await User.findOne({ username: temp });
        if (!exists) {
            username = temp;
            break;
        }
    }

    const guestKey = crypto.randomBytes(8).toString('hex'); // like 'a4f7b23c1a9d2f4e'
    const hashed = await bcrypt.hash(guestKey, 10);

    const user = await User.create({
        username,
        password: hashed,
        isGuest: true,
    });

    const token = await generateToken(user);

    res.json({
        success: true,
        token,
        username: user.username,
        guestKey, // show only once — store it on frontend
    });
};

export const guestlogin = async (req, res) => {
    const { username, guestKey } = req.body;

    const user = await User.findOne({ username, isGuest: true });
    if (!user)
        return res.status(404).json({ success: false, message: 'Guest not found' });

    const valid = await bcrypt.compare(guestKey, user.password);
    if (!valid)
        return res.status(401).json({ success: false, message: 'Invalid guest key' });

    const token = await generateToken(user);
    res.json({ success: true, token, username: user.username });
};

// POST /logout (optional)
export const logout = async (req, res) => {
    // Client should just delete the token
    res.json({ success: true, message: 'Logged out successfully' });
};

// PATCH /update
export const userChange = async (req, res) => {
    const { avatar, email, password } = req.body;
    // console.log(req);

    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (avatar !== undefined) user.avatar = avatar;

    if (email !== undefined && email !== user.email) {
        const emailTaken = await User.findOne({ email });
        if (emailTaken) return res.status(400).json({ success: false, message: "Email already in use" });
        user.email = email;
    }

    if (password) {
        const hashed = await bcrypt.hash(password, 10);
        user.password = hashed;
    }

    await user.save();

    res.json({ success: true, message: "Settings updated successfully" });
}

// DELETE /delete
export const deleteAccount = async (req, res) => {
    const userId = req.user.id;

    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Account deleted successfully" });
};

export const getMe = async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });
};