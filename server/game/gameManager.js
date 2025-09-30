// socket/gameManager.js
import { Game } from 'quoridor-game-engine';
import { v4 as uuidv4 } from 'uuid'; // for room IDs
import { updatePlayerStats } from '../utils/updateStates.js';

class GameManager {
    constructor() {
        this.games = new Map(); // roomId -> { game, players: [ { socket, user } ] }
        this.waitingPlayer = null; // { socket, user }
    }

    /**
     * Called when a new player wants to join a game
     */
    handleNewPlayer(socket, user) {
        // console.log('waitingPlayer', this.waitingPlayer);

        if (this.waitingPlayer && this.waitingPlayer.socket.id !== socket.id) {
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
            this.waitingPlayer.socket.roomId = roomId;
            socket.roomId = roomId;

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
                players: [this.waitingPlayer.user, user],
            });
            // console.log("suiiii");


            this.waitingPlayer = null; // reset
            return roomId;
        } else {
            // No one waiting yet
            this.waitingPlayer = { socket, user };
            return null;
        }
    }

    unwaitPlayer(socket) {
        if (this.waitingPlayer && this.waitingPlayer.socket.id === socket.id) {
            this.waitingPlayer = null;
            return true;
        }
        return false;
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

    getGameBySocket(socket) {
        for (const [roomId, gameData] of this.games.entries()) {
            if (gameData.players.some(player => player.socket.id === socket.id)) {
                return { roomId, ...gameData };
            }
        }
        return null;
    }

    handleMove(socket, { move }) {
        // console.log(socket, move);

        const gameData = this.getGameBySocket(socket);
        if (!gameData) {
            socket.emit("error", { success: false, message: "Game not found." });
            return;
        }

        const { game } = gameData;
        // get if the player is the first or second
        const playerIndex = gameData.players.findIndex(player => player.socket.id === socket.id);
        if (playerIndex === -1) {
            socket.emit("error", { success: false, message: "Player not found." });
            return;
        }
        if (playerIndex + 1 != parseInt(move[1])) {
            socket.emit("error", { success: false, message: "Not your turn." });
            return;
        }
        if (game.isGameOver) {
            socket.emit("error", { success: false, message: "Game is already over." });
            const user1 = gameData.players[0].user;
            const user2 = gameData.players[1].user;
            const winner = game.winner;
            const game = gameData.game;
            updatePlayerStats(user1, user2, winner, game);
            this.removeGame(gameData.roomId);
            return;
        }
        // game.printAllBoard();
        const result = game.move(move);
        // console.log(result);
        // game.printAllBoard();


        if (!result) {
            this.broadcastToRoom(gameData.roomId, "invalidMove", {
                success: false,
                message: "Invalid move",
            });
            return;
        }

        if (game.isGameOver) {
            this.broadcastToRoom(gameData.roomId, "gameOver", {
                success: true,
                message: "Game Over",
                states: game.getGameState(),
            });
            const user1 = gameData.players[0].user;
            const user2 = gameData.players[1].user;
            const winner = game.winner;
            const current = gameData.game;
            updatePlayerStats(user1, user2, winner, current);
            this.removeGame(gameData.roomId);

        }

        // Broadcast the updated state
        this.broadcastToRoom(gameData.roomId, "gameUpdated", {
            success: true,
            gameState: {
                move,
            },
        });
    }

    removeGame(roomId) {
        this.games.delete(roomId);
    }


}

export default new GameManager();
