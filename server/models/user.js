import mongoose from 'mongoose';

const GameSummarySchema = new mongoose.Schema({
    opponent: String,
    result: { type: String, enum: ['win', 'loss', 'draw'], required: true },
    moves: [String],
    timestamp: { type: Date, default: Date.now },
}, { _id: false });

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true }, // sparse for guests
    password: { type: String }, // not required for guests
    isGuest: { type: Boolean, default: false },

    avatar: { type: Number, default: 0 }, // index in frontend avatar list
    playerSince: { type: Date, default: Date.now },

    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    totalGames: { type: Number, default: 0 },
    rank: { type: Number, default: 1000 }, // default ELO or custom scale

    history: {
        type: [GameSummarySchema],
        default: [],
        validate: [arr => arr.length <= 100, '{PATH} exceeds limit of 100'],
    },

    lastLogin: { type: Date, default: Date.now },
}, {
    timestamps: true
});

export default mongoose.model('User', UserSchema);
