import User from '../models/User.js';

// GET /api/users/:username/profile
export const getUserProfile = async (req, res) => {
    const { id } = req.params;

    const user = await User.findOne({ _id: id }).select('-password -__v');

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { wins, losses, totalGames, rank, avatar, history, playerSince } = user;

    res.json({
        success: true,
        profile: {
            username,
            avatar,
            rank,
            wins,
            losses,
            totalGames,
            playerSince,
            recentHistory: history.slice(0, 10), // last 10 games
        },
    });
};
