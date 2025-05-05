// sockets/game.js
import gameManager from "../game/gameManager.js";

const setupGameSocket = (io, socket) => {
    console.log('in setup');

    socket.on('joinGame', (data) => {
        console.log(`${data.username} joined a game`);
        const { userId, username } = data;

        const player = {
            id: userId,
            username,
        };

        gameManager.handleNewPlayer(socket, player);
    });

    socket.on('movePawn', (data) => {
        console.log('MovePawn event received:', data);
        // Forward to your GameManager later
    });

    socket.on('disconnect', () => {
        console.log(`Disconnected: ${socket.id}`);
    });
};

export default setupGameSocket;
