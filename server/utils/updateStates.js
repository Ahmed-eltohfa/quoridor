import User from "../models/User.js";

export const updatePlayerStats = async (user1, user2, winner, game) => {
    const [p1, p2] = await Promise.all([
        User.findOne({ _id: user1.id }),
        User.findOne({ _id: user2.id }),
    ]);
    console.log('game', game.moves);


    const p1Won = winner === 1;
    const p2Won = winner === 2;

    if (p1) {
        p1.totalGames += 1;
        p1.wins += p1Won ? 1 : 0;
        p1.losses += p1Won ? 0 : 1;
        p1.history.unshift({
            opponent: user2.username,
            result: p1Won ? "win" : "loss",
            moves: game.moves,
        });
        p1.rank = p1.rank + (p1Won ? 10 : -10); // Example ELO adjustment
        p1.history = p1.history.slice(0, 100); // limit
        await p1.save();
    }

    if (p2) {
        p2.totalGames += 1;
        p2.wins += p2Won ? 1 : 0;
        p2.losses += p2Won ? 0 : 1;
        p2.history.unshift({
            opponent: user1.username,
            result: p2Won ? "win" : "loss",
            moves: game.moves,
        });
        p2.rank = p2.rank + (p2Won ? 10 : -10); // Example ELO adjustment
        p2.history = p2.history.slice(0, 100);
        await p2.save();
    }
}