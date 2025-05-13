// sockets/game.js
import gameManager from "../game/gameManager.js";
import { updatePlayerStats } from "../utils/updateStates.js";

const setupGameSocket = (io, socket) => {
    // console.log('in setup');

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
            username,
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
