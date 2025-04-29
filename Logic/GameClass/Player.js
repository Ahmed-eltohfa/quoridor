class Player {
    constructor(name, pNum, isComputer = false, difficulty = 0, nWalls = 10) {
        this.name = name;
        this.position = null;
        this.isComputer = isComputer;
        this.difficulty = difficulty;
        this.nWalls = nWalls; // default number of walls
        this.pNum = pNum; // player number (1 or 2)
    }

    smartMove(game) {
        const rank = this.difficulty * Math.random() * 125;
        console.log(rank);

        if (rank <= 100) {
            return this.randomMove(game);
        } else if (rank <= 200) {
            return this.getEasyMove(game);
        } else if (rank <= 300) {
            return this.mediumMove(game);
        } else if (rank <= 500) {
            return this.hardMove(game);
        } else if (rank <= 750) {
            return this.mediumMove(game, 11);
        } else {
            return this.theBestMove(game);
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
        if (game.isGameOver) {
            return null;
        }
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
        if (game.isGameOver) {
            return null;
        }
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

    mediumMove(game, wallDepth = 3) {
        if (game.isGameOver) {
            return null;
        }
        const pathSelfBefore = game.shortestPath(this.pNum);
        const pathOpBefore = game.shortestPath(this.pNum === 1 ? 2 : 1);

        const lenSelfBefore = pathSelfBefore?.length;
        const lenOpBefore = pathOpBefore?.length;

        let bestMove = null;
        let bestScore = -Infinity;

        // 1. Try moving forward
        if (pathSelfBefore?.length > 1) {
            const nextPos = pathSelfBefore[1];
            const moveStr = `p${this.pNum}_${nextPos[0] + 1}-${nextPos[1] + 1}`;
            if (game.checkMove(moveStr)) {
                const clone = game.clone();
                clone.move(moveStr);
                if (clone.isGameOver) {
                    return moveStr; // win
                }
                const newSelf = clone.shortestPath(this.pNum);
                if (newSelf?.length === 1) {
                    return moveStr; // win
                }
                const newOp = clone.shortestPath(this.pNum === 1 ? 2 : 1);
                // clone.printAllBoard();

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
            const offsets = [];
            const wallsit = Math.floor((wallDepth - 1) / 2);
            for (let i = -wallsit; i <= wallsit; i++) {
                offsets.push(i);
            }
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
                                // console.log(wallMove);

                                const clone = game.clone();
                                clone.move(wallMove);

                                const newSelf = clone.shortestPath(this.pNum);
                                const newOp = clone.shortestPath(this.pNum === 1 ? 2 : 1);

                                const newLenSelf = newSelf?.length;
                                const newLenOp = newOp?.length;

                                const score = 1.2 * (newLenOp - lenOpBefore) - (newLenSelf - lenSelfBefore);
                                // console.log(newLenOp, lenOpBefore, newLenSelf, lenSelfBefore, score, bestScore, this.pNum);
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

    hardMove(game) {
        return this.mediumMove(game, 5) ?? this.randomMove(game);
    }

    getValidMoves(game, wallRange = 9) {
        const validMoves = [];
        const op = this.pNum === 1 ? game.p2.position : game.p1.position;

        // 1. Try moving one step forward on shortest path
        const path = game.shortestPath(this.pNum);

        if (path && path.length > 1) {
            for (let i = 0; i < path.length; i++) {
                const [row, col] = path[i];
                const moveStr = `p${this.pNum}_${row + 1}-${col + 1}`;

                if (game.checkMove(moveStr)) {
                    validMoves.push(moveStr);
                }
            }
        }

        // 2. Try placing walls if we still have any
        if (this.nWalls > 0) {
            const wallTypes = ['h', 'v'];
            const offsets = [];

            const halfRange = Math.floor(wallRange / 2);
            for (let i = -halfRange; i <= halfRange; i++) {
                offsets.push(i);
            }

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

                            if (game.checkMove(wallMove, [], [], false)) {
                                validMoves.push(wallMove);
                            }
                        }
                    }
                }
            }
        }

        return validMoves;
    }

    evauateBoard(game) {
        const myPath = game.shortestPath(this.pNum);

        const opponentNum = this.pNum === 1 ? 2 : 1;
        const opPath = game.shortestPath(opponentNum);

        if (game.isGameOver) {
            if (game.winner === this.pNum) return 10000;
            else return -10000;
        }

        const myLen = myPath ? myPath.length : 100;
        const opLen = opPath ? opPath.length : 100;

        let score = (opLen - myLen);

        // Optional: Wall count weighting
        const myWalls = this.nWalls;
        const opWalls = this.pNum === 1 ? game.p2.nWalls : game.p1.nWalls;

        score += (myWalls - opWalls) * .5;

        return score;
    }

    theBestMove(game, depth = 3) {
        if (game.isGameOver) return null;

        const self = this;
        const opponent = self.pNum === 1 ? game.p2 : game.p1;

        function minimax(node, d, alpha, beta, isMaximizing) {
            if (node.isGameOver || d === 0) {
                return self.evauateBoard(node);
            }

            const currentPlayer = isMaximizing ? self : opponent;
            const moves = currentPlayer.getValidMoves(node, 3);

            if (isMaximizing) {
                let maxeva = -Infinity;
                for (const move of moves) {
                    const clone = node.clone();
                    clone.move(move);

                    const eva = minimax(clone, d - 1, alpha, beta, false);
                    maxeva = Math.max(maxeva, eva);
                    alpha = Math.max(alpha, eva);
                    if (beta <= alpha) break; // pruning
                }
                return maxeva;
            } else {
                let mineva = Infinity;
                for (const move of moves) {
                    const clone = node.clone();
                    clone.move(move);
                    const eva = minimax(clone, d - 1, alpha, beta, true);
                    mineva = Math.min(mineva, eva);
                    beta = Math.min(beta, eva);
                    if (beta <= alpha) break; // pruning
                }
                return mineva;
            }
        }

        let bestMove = null;
        let bestScore = -Infinity;
        const possibleMoves = this.getValidMoves(game, 3);

        for (const move of possibleMoves) {
            const clone = game.clone();
            clone.move(move);

            const score = minimax(clone, depth - 1, -Infinity, Infinity, false);

            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }

        console.log("Best move:", bestMove);
        return bestMove ?? this.randomMove(game);
    }


}

export default Player;