import jwt from "jsonwebtoken";
import User from "../models/User.js";

const socketAuth = async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        console.log(socket);

        if (!token) {
            console.log('no token');
        };
        if (!token) return next(new Error("Authentication required"));

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            console.log('no user');
        };
        if (!user) return next(new Error("User not found"));

        socket.user = {
            id: user._id.toString(),
            username: user.username,
        };

        next();
    } catch (err) {
        next(new Error("Invalid token"));
    }
};

export default socketAuth;