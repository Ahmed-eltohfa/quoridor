// server.js
import express from 'express';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import playerRouter from './routes/players.js'
import setupGameSocket from './sockets/game.js';
import connectDB from './config/connectdb.js';
import socketAuth from './middlewears/socketMiddlewear.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// Middlewares
app.use(cors());
app.use(express.json());
io.use(socketAuth); // authenticate socket connections

// db connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/players', playerRouter);

// Socket.io setup
io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    setupGameSocket(io, socket);
});

// global api point
app.get('/', (req, res) => {
    res.send("hello from server");
})
// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
