class Player {
    constructor(name, pNum, isComputer = false, difficulty = null, nWalls = 10) {
        this.name = name;
        this.position = null;
        this.isComputer = isComputer;
        this.difficulty = difficulty;
        this.nWalls = nWalls; // default number of walls
        this.pNum = pNum; // player number (1 or 2)
    }

    makeMove(game) {
        if (this.isComputer) {
            // basic placeholder for AI move logic
            if (this.difficulty === "easy") {
                return this.randomMove(game);
            } else if (this.difficulty === "hard") {
                return this.smartMove(game);
            }
        }
        return null; // humans don’t make moves from here
    }

    randomMove(game) { // generate a legal random move
        const validMoves = [];

        const directions = [
            [0, 1],  // right
            [1, 0],  // down
            [0, -1], // left
            [-1, 0],  // up
            // two moves in one direction
            [0, 2],  // right
            [2, 0],  // down
            [0, -2], // left
            [-2, 0]  // up
        ];

        const from = this.position;
        const boardSize = game.boardSize;

        // 1. Pawn Moves
        for (let [dx, dy] of directions) {
            const to = [from[0] + dx, from[1] + dy];
            if (
                to[0] >= 0 && to[0] < boardSize &&
                to[1] >= 0 && to[1] < boardSize
            ) {
                const moveStr = `p${this.pNum}_${to[0] + 1}-${to[1] + 1}`;
                if (game.checkMove(moveStr)) {
                    validMoves.push(moveStr);
                }
            }
        }

        // 2. Wall placements (just a few near the player)
        if (this.nWalls > 0) {
            const wallTypes = ["h", "v"];
            const offsets = [-1, 0, 1]; // only two positions to try near current player
            const op = this.pNum === 1 ? game.p2.position : game.p1.position;

            const colStart = op[1];
            const rowStart = op[0];

            for (let dRow of offsets) {
                for (let dCol of offsets) {
                    for (let type of wallTypes) {
                        const row = rowStart + dRow;
                        const col = colStart + dCol;

                        if (row >= 0 && col >= 0 && row < boardSize - 1 && col < boardSize - 1) {
                            const rowChar = String.fromCharCode(97 + row + 1);        // 'a' + row index
                            const nextRowChar = String.fromCharCode(97 + row + 3);
                            const colChar = String.fromCharCode(97 + col);
                            const nextColChar = String.fromCharCode(97 + col + 2);

                            let moveStr;
                            if (type === "h") {
                                // Horizontal: w1_xx-x (eg-g)
                                moveStr = `w${this.pNum}_${colChar}${nextColChar}-${rowChar}`;
                            } else {
                                // Vertical: w1_x-xx (g-gi)
                                moveStr = `w${this.pNum}_${colChar}-${rowChar}${nextRowChar}`;
                            }

                            if (game.checkMove(moveStr)) {
                                validMoves.push(moveStr);
                            }
                        }
                    }
                }
            }
        }

        // 3. Pick one randomly
        if (validMoves.length === 0) return null;

        const choice = validMoves[Math.floor(Math.random() * validMoves.length)];
        return choice;
    }

    smartMove(game) {
        // implement a smarter AI strategy (e.g., BFS, minimax)
        if (this.difficulty === "easy") {
            // Placeholder for easy AI logic
            return this.randomMove(game); // Replace with actual logic
        } else if (this.difficulty === "medium") {
            // Placeholder for medium AI logic
            return this.randomMove(game); // Replace with actual logic
        }
        else if (this.difficulty === "hard") {
            // Placeholder for hard AI logic
            return this.randomMove(game); // Replace with actual logic
        }
    }
}

export default Player;