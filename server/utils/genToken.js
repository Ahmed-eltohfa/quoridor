import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '365d' } // expires in 1 year
    );
};