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

export const sendFriendRequest = async (req, res) => {
    const { targetUserId } = req.body;
    const senderId = req.user.id; // Assuming you have auth middleware

    // Check if users exist
    const [sender, receiver] = await Promise.all([
        User.findById(senderId),
        User.findById(targetUserId)
    ]);

    if (!sender || !receiver) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if friend request already exists
    const existingRequest = sender.friends.find(
        friend => friend.user.toString() === targetUserId
    );

    if (existingRequest) {
        return res.status(400).json({
            success: false,
            message: 'Friend request already exists'
        });
    }

    // Add friend request
    sender.friends.push({
        user: targetUserId,
        status: 'pending',
        isIncoming: false  // Sender's perspective
    });
    receiver.friends.push({
        user: senderId,
        status: 'pending',
        isIncoming: true   // Receiver's perspective
    });

    await Promise.all([sender.save(), receiver.save()]);

    res.json({ success: true, message: 'Friend request sent' });
};

export const respondToFriendRequest = async (req, res) => {
    const { requestId, accept } = req.body;
    const userId = req.user.id; // Assuming you have auth middleware

    const user = await User.findById(userId);
    const friendRequest = user.friends.id(requestId);

    if (!friendRequest) {
        return res.status(404).json({
            success: false,
            message: 'Friend request not found'
        });
    }

    // Check if this user is authorized to respond (must be the receiver)
    if (!friendRequest.isIncoming) {
        return res.status(403).json({
            success: false,
            message: 'You can only respond to incoming friend requests'
        });
    }

    if (accept) {
        friendRequest.status = 'accepted';
        // Update the other user's friend status
        await User.findByIdAndUpdate(
            friendRequest.user,
            {
                'friends.$[elem].status': 'accepted'
            },
            {
                arrayFilters: [{ 'elem.user': userId }]
            }
        );
    } else {
        // Remove the friend request from both users
        user.friends = user.friends.filter(f => f._id !== requestId);
        await User.findByIdAndUpdate(
            friendRequest.user,
            {
                $pull: { friends: { user: userId } }
            }
        );
    }

    await user.save();
    res.json({
        success: true,
        message: accept ? 'Friend request accepted' : 'Friend request rejected'
    });

};

export const getFriendsList = async (req, res) => {
    const userId = req.user.id; // Assuming you have auth middleware

    const user = await User.findById(userId)
        .populate('friends.user', 'username avatar rank');

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    const friends = user.friends
        .filter(friend => friend.status === 'accepted')
        .map(friend => ({
            id: friend.user._id,
            username: friend.user.username,
            avatar: friend.user.avatar,
            rank: friend.user.rank,
            since: friend.since
        }));

    res.json({ success: true, friends });
};

export const getPendingFriendRequests = async (req, res) => {
    const userId = req.user.id; // Assuming you have auth middleware

    const user = await User.findById(userId)
        .populate('friends.user', 'username avatar');

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Separate incoming and outgoing requests
    const incomingRequests = user.friends
        .filter(friend => friend.status === 'pending' && friend.isIncoming)
        .map(friend => ({
            id: friend._id,
            user: {
                id: friend.user._id,
                username: friend.user.username,
                avatar: friend.user.avatar
            },
            since: friend.since
        }));

    const outgoingRequests = user.friends
        .filter(friend => friend.status === 'pending' && !friend.isIncoming)
        .map(friend => ({
            id: friend._id,
            user: {
                id: friend.user._id,
                username: friend.user.username,
                avatar: friend.user.avatar
            },
            since: friend.since
        }));

    res.json({
        success: true,
        pendingRequests: {
            incoming: incomingRequests,
            outgoing: outgoingRequests
        }
    });
};