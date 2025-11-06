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
    if (!req.body) {
        return res.status(400).json({ success: false, message: "Request body required" });
    }
    if (!req.body.targetUserId) {
        return res.status(400).json({ success: false, message: "targetUserId required" });
    }
    if (typeof req.body.targetUserId !== 'string') {
        return res.status(400).json({ success: false, message: "targetUserId must be strings" });
    }

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

    if (!req.body) {
        return res.status(400).json({ success: false, message: "Request body required" });
    }
    if (!req.body.requestId || !req.body.accept) {
        return res.status(400).json({ success: false, message: "requestId required" });
    }
    if (typeof req.body.requestId !== 'string') {
        return res.status(400).json({ success: false, message: "requestId must be strings" });
    }

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

export const searchUsers = async (req, res) => {
    // Require auth so we can return friend/request status relative to the viewer
    const viewerId = req.user?.id;
    if (!viewerId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const q = String(req.query.q || '').trim();
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(5, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    // helper to safely build regex from user input
    const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // If no query, return empty list (avoid returning huge datasets). Frontend can request leaderboard separately.
    if (!q) {
        return res.json({ success: true, users: [], page, totalPages: 0, total: 0 });
    }

    const regex = new RegExp(escapeRegex(q), 'i');

    // Build search filter: match by username (and optionally by _id if user pasted an id)
    const searchFilter = {
        $and: [
            { _id: { $ne: viewerId } },       // exclude self
            { isGuest: false },               // exclude guest accounts from search results
            {
                $or: [
                    { username: regex },
                    { _id: q.match(/^[0-9a-fA-F]{24}$/) ? q : undefined } // allow direct id search
                ].filter(Boolean)
            }
        ]
    };

    // Get viewer's friend list once to compute status flags
    const viewer = await User.findById(viewerId).select('friends').lean();
    const friendsMap = new Map(); // userId -> friend subdoc
    if (viewer && Array.isArray(viewer.friends)) {
        for (const f of viewer.friends) {
            friendsMap.set(String(f.user), f);
        }
    }

    const total = await User.countDocuments(searchFilter);
    const totalPages = Math.ceil(total / limit);

    const found = await User.find(searchFilter)
        .select('username avatar rank _id')
        .sort({ rank: -1, username: 1 })
        .skip(skip)
        .limit(limit)
        .lean();

    const users = found.map(u => {
        const fid = String(u._id);
        const rel = friendsMap.get(fid);
        const isFriend = !!(rel && rel.status === 'accepted');
        const requestSent = !!(rel && rel.status === 'pending' && rel.isIncoming === false);
        const requestReceived = !!(rel && rel.status === 'pending' && rel.isIncoming === true);

        return {
            id: fid,
            username: u.username,
            avatar: u.avatar,
            rank: u.rank,
            isFriend,
            requestSent,
            requestReceived,
            canSendRequest: !isFriend && !requestSent && !requestReceived // frontend helper
        };
    });

    return res.json({
        success: true,
        users,
        page,
        totalPages,
        total
    });
};
