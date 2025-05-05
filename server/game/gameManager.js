// socket/gameManager.js
import { Game } from 'quoridor-game-engine';
import { v4 as uuidv4 } from 'uuid'; // for room IDs

class GameManager {
    constructor() {
        this.games = new Map(); // roomId -> { game, players: [ { socket, user } ] }
        this.waitingPlayer = null; // { socket, user }
    }

    /**
     * Called when a new player wants to join a game
     */
    handleNewPlayer(socket, user) {
        if (this.waitingPlayer) {
            // Match found!
            const roomId = uuidv4();
            const game = new Game({
                p1: { name: this.waitingPlayer.user.username },
                p2: { name: user.username },
                boardSize: 9,
            });

            this.games.set(roomId, {
                game,
                players: [this.waitingPlayer, { socket, user }],
            });

            // Join both players to the same room
            this.waitingPlayer.socket.join(roomId);
            socket.join(roomId);

            // Notify both players that the game is starting
            const gameState = game.moves; // or whatever your API provides
            this.broadcastToRoom(roomId, 'startGame', {
                success: true,
                message: 'Match found',
                roomId,
                gameState,
            });
            console.log("suiiii");


            this.waitingPlayer = null; // reset
            return roomId;
        } else {
            // No one waiting yet
            this.waitingPlayer = { socket, user };
            return null;
        }
    }

    broadcastToRoom(roomId, event, data) {
        const gameData = this.games.get(roomId);
        if (!gameData) return;
        for (const player of gameData.players) {
            player.socket.emit(event, data);
        }
    }

    getGame(roomId) {
        return this.games.get(roomId);
    }

    removeGame(roomId) {
        this.games.delete(roomId);
    }
}

export default new GameManager();
