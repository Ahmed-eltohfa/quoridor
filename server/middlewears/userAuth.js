import jwt from 'jsonwebtoken';

// userAuth.js
// Middleware function to check the user's token
const userAuth = (req, res, next) => {
    // Get the token from the request headers
    let token = req.headers.authorization || req.headers.Authorization;
    token = token.split(' ')[1];
    // console.log(token);


    // Check if the token is provided
    if (!token) {
        return res.status(401).json({ succes: false, message: 'No token provided' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);

        // Attach the decoded user information to the request object
        req.user = decoded;
        // Call the next middleware
        next();
    } catch (error) {
        return res.status(401).json({ succes: false, message: 'Invalid token' });
    }
};

// Export the middleware function
export default userAuth;