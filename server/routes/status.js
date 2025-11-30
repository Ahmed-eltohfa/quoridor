import express from 'express';
import gameManager from '../game/gameManager.js';
import { getConnectedUsersCount } from '../sockets/game.js';

const router = express.Router();

/**
 * GET /api/status/metrics
 * Returns runtime metrics: number of connected users and number of active games.
 */
router.get('/metrics', (req, res) => {
    try {
        const connectedUsers = getConnectedUsersCount();
        // gameManager.games is a Map maintained by the in-memory GameManager
        const runningGames = gameManager && gameManager.games ? gameManager.games.size : 0;

        res.json({
            success: true,
            connectedUsers,
            runningGames
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;