class Player {
    constructor(name, pNum, isComputer = false, difficulty = null, nWalls = 10) {
        this.name = name;
        this.position = null;
        this.isComputer = isComputer;
        this.difficulty = difficulty;
        this.nWalls = nWalls; // default number of walls
        this.pNum = pNum; // player number (1 or 2)
    }

    // return this.randomMove(game);
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

    move(game) {
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

    getEasyMove(game) {
        const opponent = this.pNum === 1 ? game.p2 : game.p1;
        const myPath = game.shortestPath(this.pNum);
        // const opPath = game.shortestPath(opponent.pNum);

        // 1. Decide: Wall or Move? (50/50 if wall count > 0)
        const canWall = this.nWalls > 0;
        const wallOrMove = canWall && Math.random() < 0.5;

        // 2. If wall: try placing near opponent’s path
        if (wallOrMove) {
            const wallMoves = [];
            const wallTypes = ["h", "v"];
            const offsets = [-1, 0, 1];

            const [opRow, opCol] = opponent.position;

            for (let dr of offsets) {
                for (let dc of offsets) {
                    for (let type of wallTypes) {
                        const row = opRow + dr;
                        const col = opCol + dc;

                        if (row >= 0 && col >= 0 && row < game.boardSize - 1 && col < game.boardSize - 1) {
                            const rowChar = String.fromCharCode(97 + row + 1);
                            const nextRowChar = String.fromCharCode(97 + row + 3);
                            const colChar = String.fromCharCode(97 + col);
                            const nextColChar = String.fromCharCode(97 + col + 2);

                            let moveStr;
                            if (type === "h") {
                                moveStr = `w${this.pNum}_${colChar}${nextColChar}-${rowChar}`;
                            } else {
                                moveStr = `w${this.pNum}_${colChar}-${rowChar}${nextRowChar}`;
                            }

                            if (game.checkMove(moveStr)) {
                                wallMoves.push(moveStr);
                            }
                        }
                    }
                }
            }

            if (wallMoves.length > 0) {
                return wallMoves[Math.floor(Math.random() * wallMoves.length)];
            }
        }

        // 3. Else: move forward along shortest path
        if (myPath && myPath.length > 1) {
            const [row, col] = myPath[1]; // next step
            const moveStr = `p${this.pNum}_${row + 1}-${col + 1}`;
            if (game.checkMove(moveStr)) return moveStr;
        }

        // 4. Fallback: try any valid move
        return this.randomMove(game);
    }

    mediumMove(game) {
        const pathSelfBefore = game.shortestPath(this.pNum);
        const pathOpBefore = game.shortestPath(this.pNum === 1 ? 2 : 1);

        const lenSelfBefore = pathSelfBefore?.length;
        const lenOpBefore = pathOpBefore?.length;

        let bestMove = null;
        let bestScore = -Infinity;

        // 1. Try moving forward
        if (pathSelfBefore.length > 1) {
            const nextPos = pathSelfBefore[1];
            const moveStr = `p${this.pNum}_${nextPos[0] + 1}-${nextPos[1] + 1}`;
            if (game.checkMove(moveStr)) {
                const clone = game.clone();
                clone.move(moveStr);
                const newSelf = clone.shortestPath(this.pNum);
                if (newSelf.length === 1) {
                    return moveStr; // win
                }
                const newOp = clone.shortestPath(this.pNum === 1 ? 2 : 1);
                clone.printAllBoard();

                const newLenSelf = newSelf?.length;
                const newLenOp = newOp?.length;


                const score = (newLenOp - lenOpBefore) - (newLenSelf - lenSelfBefore);
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = moveStr;
                }
            }
        }


        // 2. Try placing walls near opponent
        if (this.nWalls > 0) {
            const wallTypes = ['h', 'v'];
            const offsets = [-1, 0, 1];
            const op = this.pNum === 1 ? game.p2.position : game.p1.position;

            for (let dRow of offsets) {
                for (let dCol of offsets) {
                    for (let type of wallTypes) {
                        const row = op[0] + dRow;
                        const col = op[1] + dCol;

                        if (row >= 0 && col >= 0 && row < game.boardSize - 1 && col < game.boardSize - 1) {
                            const rowChar = String.fromCharCode(97 + row + 1);
                            const nextRowChar = String.fromCharCode(97 + row + 3);
                            const colChar = String.fromCharCode(97 + col);
                            const nextColChar = String.fromCharCode(97 + col + 2);

                            let wallMove;
                            if (type === 'h') {
                                wallMove = `w${this.pNum}_${colChar}${nextColChar}-${rowChar}`;
                            } else {
                                wallMove = `w${this.pNum}_${colChar}-${rowChar}${nextRowChar}`;
                            }

                            if (wallMove && game.checkMove(wallMove)) {
                                const clone = game.clone();
                                clone.move(wallMove);

                                const newSelf = clone.shortestPath(this.pNum);
                                const newOp = clone.shortestPath(this.pNum === 1 ? 2 : 1);

                                const newLenSelf = newSelf?.length;
                                const newLenOp = newOp?.length;

                                const score = (newLenOp - lenOpBefore) - (newLenSelf - lenSelfBefore);
                                if (score > bestScore) {
                                    bestScore = score;
                                    bestMove = wallMove;
                                }
                            }
                        }
                    }
                }
            }
        }

        return bestMove ?? this.randomMove(game);
    }

}

export default Player;