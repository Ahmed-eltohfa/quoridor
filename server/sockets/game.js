// sockets/game.js
import gameManager from "../game/gameManager.js";
import { updatePlayerStats } from "../utils/updateStates.js";
import { v4 as uuidv4 } from 'uuid';
import jwt from "jsonwebtoken";

const userSockets = new Map(); // userId -> { socket, user }
const pendingInvites = new Map(); // inviteId -> { fromId, toId, timeout }

const setupGameSocket = (io, socket) => {
    // console.log('in setup');

    socket.on('register', async ({ token }) => {
        try {
            const user = jwt.verify(token, process.env.JWT_SECRET);
            if (!user || !user.id) throw new Error('Invalid token payload');
            if (userSockets.has(String(user.id))) {
                socket.emit('register:failed', { success: false, message: 'User already connected' });
                return;
            }
            userSockets.set(String(user.id), { socket, user });
            socket.userId = String(user.id);
            socket.emit('register:success', { success: true, user });
        } catch (err) {
            socket.emit('register:failed', { success: false, message: 'Invalid token', error: err.message });
        }
    });

    socket.on('invite:send', ({ targetUserId }) => {
        const fromId = socket.userId;
        if (!fromId || !targetUserId) {
            socket.emit('invite:send:result', { success: false, message: 'Invalid data' });
            return;
        };

        const target = userSockets.get(String(targetUserId));
        if (!target) {
            socket.emit('invite:send:result', { success: false, message: 'User not online' });
            return;
        }

        // create invite record
        const inviteId = uuidv4();
        const timeout = setTimeout(() => {
            pendingInvites.delete(inviteId);
            // notify sender & target if still connected
            const senderConn = userSockets.get(fromId);
            if (senderConn) senderConn.socket.emit('invite:expired', { inviteId });
            const targetConn = userSockets.get(String(targetUserId));
            if (targetConn) targetConn.socket.emit('invite:expired', { inviteId });
        }, 60_000); // expire after 60s

        pendingInvites.set(inviteId, { fromId, toId: String(targetUserId), timeout });

        // forward invite to target
        target.socket.emit('invite:received', {
            inviteId,
            from: userSockets.get(fromId)?.user || { id: fromId }
        });

        socket.emit('invite:send:result', { success: true, inviteId });
    });

    // Target responds to invite
    socket.on('invite:respond', async ({ inviteId, accept }) => {
        const userID = socket.userId;
        if (!userID) return;

        const record = pendingInvites.get(inviteId);
        if (!record) {
            socket.emit('invite:respond:result', { success: false, message: 'Invite not found or expired' });
            return;
        }

        // only the invited user can respond
        if (String(socket.userId) !== String(record.toId)) {
            socket.emit('invite:respond:result', { success: false, message: 'Not authorized' });
            return;
        }

        clearTimeout(record.timeout);
        pendingInvites.delete(inviteId);

        const senderConn = userSockets.get(String(record.fromId));
        const receiverConn = userSockets.get(String(record.toId));
        if (!senderConn || !receiverConn) {
            socket.emit('invite:respond:result', { success: false, message: 'One of the players went offline' });
            if (senderConn) senderConn.socket.emit('invite:cancelled', { inviteId });
            return;
        }

        if (!accept) {
            // notify both
            senderConn.socket.emit('invite:rejected', { inviteId, by: record.toId });
            receiverConn.socket.emit('invite:rejected', { inviteId });
            return;
        }

        // accepted -> create in-memory match and attach sockets
        // gameManager.createMatchBetweenUsers expects user objects (minimal ok)
        const roomId = gameManager.createMatchBetweenUsers(senderConn.user, receiverConn.user);

        // attach sockets to created room and start game when both attached
        gameManager.attachSocketToRoom(senderConn.socket, roomId, senderConn.user.id || senderConn.user._id);
        gameManager.attachSocketToRoom(receiverConn.socket, roomId, receiverConn.user.id || receiverConn.user._id);

        // notify both clients about accepted invite and roomId
        senderConn.socket.emit('invite:accepted', { inviteId, roomId, opponent: receiverConn.user });
        receiverConn.socket.emit('invite:accepted', { inviteId, roomId, opponent: senderConn.user });
    });

    socket.on('joinGame', (data) => {
        console.log(`${data} joined a game`);
        console.log(data.username, data.userId);

        const { userId, username } = data;
        // Check if userId and username are provided
        if (!userId || !username) {
            socket.emit('error', { message: 'Invalid user data' });
            return;
        }
        const player = {
            id: userId,
            username: username,
            avatar: data.avatar || 0, // Use a default avatar if not provided
            rank: data.rank || 0, // Use a default rank if not provided
        };

        gameManager.handleNewPlayer(socket, player);
    });

    socket.on('unwaitPlayer', () => {
        gameManager.unwaitPlayer(socket);
    });

    socket.on('move', (data) => {
        console.log('move event received:', data);
        // Check if data is valid
        if (!data || !data.move) {
            socket.emit('error', { message: 'Invalid move data' });
            return;
        }
        gameManager.handleMove(socket, data);
    });

    socket.on('disconnect', async () => {
        console.log(`Disconnected: ${socket.id}`);
        if (socket.userId) userSockets.delete(String(socket.userId));
        for (const [inviteId, inv] of pendingInvites.entries()) {
            if (inv.fromId === socket.userId || inv.toId === socket.userId) {
                clearTimeout(inv.timeout);
                pendingInvites.delete(inviteId);
            }
        }
        const gameData = gameManager.getGameBySocket(socket);
        if (!gameData || gameData.isGameOver) return;
        if (gameData) {
            const otherPlayer = gameData.players.find(p => p.socket.id !== socket.id);
            if (otherPlayer) {
                const winner = otherPlayer.user.id === gameData.players[0].user.id ? 1 : 2;
                // console.log(otherPlayer, gameData.players);

                const user1 = gameData.players[0].user;
                const user2 = gameData.players[1].user;
                const current = gameData.game;
                try {
                    await updatePlayerStats(user1, user2, winner, current);
                } catch (err) {
                    console.error('Failed to update stats on disconnect:', err);
                }
                otherPlayer.socket.emit('opponentDisconnected', {
                    success: false,
                    message: 'Your opponent disconnected.',
                });
            }
            gameManager.removeGame(gameData.roomId);
        }
    });
};

export default setupGameSocket;
