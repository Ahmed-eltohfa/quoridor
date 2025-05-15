import User from '../models/User.js';

// GET /api/palyer/:id/profile
export const getUserProfile = async (req, res) => {
    const { id } = req.params;

    const user = await User.findOne({ _id: id }).select('-password -__v');

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { username, wins, losses, totalGames, rank, avatar, history, playerSince } = user;

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

export const getLeaderboard = async (req, res) => {
    const users = await User.find({ isGuest: false })
        .sort({ rank: -1 })
        .limit(10)
        .select('username avatar rank wins totalGames _id');

    if (!users) {
        return res.status(404).json({ success: false, message: 'No users found' });
    }

    res.json({
        success: true,
        leaderboard: users.map(user => ({
            username: user.username,
            rank: user.rank,
            wins: user.wins,
            losses: user.losses,
            totalGames: user.totalGames,
        })),
    });
}