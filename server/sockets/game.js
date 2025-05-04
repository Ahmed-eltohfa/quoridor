// sockets/game.js
const setupGameSocket = (io, socket) => {
    console.log('in setup');

    socket.on('joinGame', (data) => {
        console.log(`${data.username} joined a game`);
        // Future: matchmaking + GameSession
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
