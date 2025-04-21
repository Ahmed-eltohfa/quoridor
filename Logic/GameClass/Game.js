import Player from "./Player.js";


class Game {
    constructor(info) {
        this.init(info);
    }

    init(info) {
        // attributes
        // console.log(info);
        this.p1 = new Player(info.p1.name, 1, info.p1.isComputer, info.p1.difficulty, info.p1.nWalls);
        this.p2 = new Player(info.p2.name, 2, info.p2.isComputer, info.p2.difficulty, info.p2.nWalls);
        this.boardSize = info.boardSize || 9;
        this.mod = info.mod || {};
        this.t1 = 0;
        this.t2 = 0;
        this.winner = null; // 1 or 2
        this.startTime = Date.now();
        this.lastMoveTime = Date.now();
        this.isP1Turn = true;
        this.moves = [];
        this.isGameOver = false;
        // initialize the board and walls
        this.board = Array(this.boardSize).fill('e'.repeat(this.boardSize));
        this.walls = Array.from({ length: this.boardSize + 1 }, () =>
            Array.from({ length: this.boardSize + 1 }, () => ({
                up: false,
                down: false,
                left: false,
                right: false
            }))
        );

        this.p1.position = info.p1.position || [0, Math.floor(this.boardSize / 2)];
        this.p2.position = info.p2.position || [this.boardSize - 1, Math.floor(this.boardSize / 2)];
        this.board[this.p1.position[0]] = this.board[this.p1.position[0]].substring(0, this.p1.position[1]) + '1' + this.board[this.p1.position[0]].substring(this.p1.position[1] + 1);
        this.board[this.p2.position[0]] = this.board[this.p2.position[0]].substring(0, this.p2.position[1]) + '2' + this.board[this.p2.position[0]].substring(this.p2.position[1] + 1);
        // console.log(this.p1, this.p2);
    }

    restartGame() {
        this.init({
            p1: { name: this.p1.name, position: null },
            p2: { name: this.p2.name, position: null },
            boardSize: this.boardSize,
        });
        this.printAllBoard();
    }

    getWallSymbol(wall) {
        const { up, down, left, right } = wall;
        if (up && down && left && right) return '┼';
        else if (up && down && left) return '┤';
        else if (up && down && right) return '├';
        else if (left && right && up) return '┴';
        else if (left && right && down) return '┬';
        else if (left && right) return '─';
        else if (up && down) return '│';
        else if (up && left) return '┘';
        else if (up && right) return '└';
        else if (down && right) return '┌';
        else if (down && left) return '┐';
        else if (up) return '╵';
        else if (down) return '╷';
        else if (left) return '╴';
        else if (right) return '╶';
        else return '.'; // Empty space, no walls
    }

    print() {
        this.board.reverse();
        this.board.forEach((row, index) => {
            console.log(`${this.boardSize - index} - ${row.split('').join(' ')}`);
        })
        console.log("- ".repeat(3 + this.boardSize))
        console.log('  - ' + Array.from({ length: this.boardSize }, (_, i) => i + 1).join(' '));
        this.board.reverse();
    }

    printWalls() {
        this.walls.reverse();
        this.walls.forEach((row, index) => {
            process.stdout.write('  | ');
            row.forEach(({ up, down, left, right }) => {
                let symbol = this.getWallSymbol({ up, down, left, right });
                process.stdout.write(symbol + ' ');
            })
            console.log(`| ${String.fromCharCode(this.boardSize - index + 97)}`);
        })
        console.log("| ".repeat(3 + this.boardSize))
        console.log('  | ' + Array.from({ length: this.boardSize + 1 }, (_, i) => String.fromCharCode(i + 1 + 96)).join(' '));
        this.walls.reverse();
    }

    printAllBoard() {
        this.board.reverse();
        this.walls.reverse();
        // console.log(this.walls.length)
        console.log('----' + Array.from({ length: this.boardSize + 1 }, (_, i) => String.fromCharCode(i + 97)).join('   ') + '----');
        for (let i = 0; i < this.boardSize + 1; i++) {
            process.stdout.write(`  | `);
            this.walls[i].forEach(({ up, down, left, right }, index) => {
                let symbol = this.getWallSymbol({ up, down, left, right });
                process.stdout.write(symbol);
                process.stdout.write(index === this.boardSize ? ' ' : '   ');
            });
            console.log(`| ${String.fromCharCode(this.boardSize - i + 97)}`);
            if (i === this.boardSize) break;
            console.log(`${this.boardSize - i}${(this.boardSize - 1 - i) >= 9 ? "" : " "}|   ${this.board[i].split('').join('   ')}   |`);
        }
        console.log("  " + "|   ".repeat(2 + this.boardSize))
        console.log('  -  ' + Array.from({ length: this.boardSize }, (_, i) => i > 9 ? i + 1 : ' ' + (i + 1)).join('  '));
        this.board.reverse();
        this.walls.reverse();
    }

    // fucntion that check if the wall will block a cell or no
    checkNotWallBlock = (from, to) => {
        const [fx, fy] = from;
        const [tx, ty] = to;

        let wallL, wallR;

        // Move Down
        if (tx > fx) {
            wallL = this.walls[fx + 1][fy];
            wallR = this.walls[fx + 1][fy + 1];
            return !(wallL.right || wallR.left);
        }
        // Move Up
        if (tx < fx) {
            wallL = this.walls[fx][fy];
            wallR = this.walls[fx][fy + 1];
            return !(wallL.right || wallR.left);
        }
        // Move Right
        if (ty > fy) {
            wallL = this.walls[fx][fy + 1];
            wallR = this.walls[fx + 1][fy + 1];
            return !(wallL.up || wallR.down);
        }
        // Move Left
        if (ty < fy) {
            wallL = this.walls[fx][fy];
            wallR = this.walls[fx + 1][fy];
            return !(wallL.up || wallR.down);
        }

        return false; // same tile, or diagonal — not allowed
    }

    // using bfs to check if the player can reach the other side
    checkPath(start) {
        const visited = Array.from({ length: this.boardSize }, () => Array(this.boardSize).fill(false));
        const queue = [start];
        visited[start[0]][start[1]] = true;
        let found = false;
        while (queue.length > 0) {
            const [x, y] = queue.shift();
            if ((this.isP1Turn && x === this.boardSize - 1) || (!this.isP1Turn && x === 0)) {
                found = true;
                break;
            }
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (Math.abs(i) !== Math.abs(j)) { // not diagonal
                        const newX = x + i;
                        const newY = y + j;
                        if (newX >= 0 && newX < this.boardSize && newY >= 0 && newY < this.boardSize && !visited[newX][newY] &&
                            this.checkNotWallBlock([x, y], [newX, newY])) {
                            visited[newX][newY] = true;
                            queue.push([newX, newY]);
                        }
                    }
                }
            }
        }
        if (!found) {
            return false;
        }
        return true;  //range works but not in turn again
    }

    checkMove(move, from = [], to = [], turnIsImportant = true) {
        // console.log('mo', move);

        const splitMove = move.split('_');
        const type = splitMove[0]; // p1_5-5 | w2_d-ac
        const opponent = this.isP1Turn ? this.p2 : this.p1;
        // console.log("op", opponent.position);
        const moveRegex = /^[p][1-4]_\d{1,2}-\d{1,2}$|^[w][1-4]_[a-zA-Z]{1,2}-[a-zA-Z]{1,2}$/;
        if (turnIsImportant) {
            if ((this.isP1Turn && type[1] !== '1') || (!this.isP1Turn && type[1] !== '2')) {
                // console.log("Not Your Turn");
                return false;
            }
        }

        if (this.isGameOver) {
            // console.log("Game Over");
            return false;
        } else if (!moveRegex.test(move)) {
            console.log("Invalid Move Format");
            return false;
        } else if (this.p1.position.length === 0 || this.p2.position.length === 0) {
            console.log("Player Position Not Found");
            return false;
        } else if (type[0] === 'p') { // check pawn move ex. p1_2-6
            if (from.length === 0) {
                from = this.isP1Turn ? this.p1.position : this.p2.position;
            }
            if (to.length === 0) {
                to = splitMove[1].split('-').map((e) => parseInt(e) - 1);
            }

            if (turnIsImportant) {
                if (this.board[to[0]][to[1]] !== 'e') { // check if the cell is empty
                    // console.log("Invalid Move: cell not empty");
                    return false;
                } else if (to[0] === opponent.position[0] && to[1] === opponent.position[1]) {
                    // console.log("Invalid Move: opponent position");
                    return false;
                }
            }

            // console.log("checkfrom", from, 'to', to, 'op', opponent.position);
            if (from[0] === to[0] && from[1] === to[1]) {
                // console.log("Invalid Move: same position");
                return false;
            }
            else if ((Math.abs(from[0] - to[0]) > 1) || (Math.abs(from[1] - to[1]) > 1)) {
                // stop the move more than one step execpt if the opponent is in the middle
                const move2 = (Math.abs(from[0] - to[0]) > 1 && opponent.position[0] === Math.abs(from[0] + to[0]) / 2 && opponent.position[1] === from[1] && opponent.position[1] === to[1])
                    || (Math.abs(from[1] - to[1]) > 1 && opponent.position[1] === Math.abs(from[1] + to[1]) / 2 && opponent.position[0] === from[0] && opponent.position[0] === to[0]);
                if (!move2 || this.checkNotWallBlock(opponent.position, to) === false) {
                    // console.log("Invalid Move: more than one step");
                    return false;
                }
            } else if ((Math.abs(from[0] - to[0]) >= 1 && Math.abs(from[1] - to[1]) >= 1)) { // stop the diagonal move
                // console.log("Invalid Move: no diagonal moves");
                return false;
            }
            else if (to[0] < 0 || to[0] >= this.boardSize || to[1] < 0 || to[1] >= this.boardSize) {
                // console.log("Invalid Move: out of board");
                return false;
            }

            // check if not blocked by walls
            const wallBlock = this.checkNotWallBlock(from, to);
            if (wallBlock === false) {
                //console.log("Invalid Move: wall in the way");
                return false;
            }
        } else if (type[0] === 'w') { // check wall move ex. w1_ac-c
            const x = splitMove[1].split('-')[0].split('').map((e) => e.charCodeAt(0) - 97);
            const y = splitMove[1].split('-')[1].split('').map((e) => e.charCodeAt(0) - 97);
            x.sort((a, b) => a - b);
            y.sort((a, b) => a - b);
            const isVertical = y.length === 2;
            // //console.log("hello");
            if (x.length + y.length !== 3 || x.length >= 3 || y.length >= 3) {
                //console.log("Invalid Move: wall move");
                return false;
            } else if ((isVertical && Math.abs(y[0] - y[1]) !== 2) || (!isVertical && Math.abs(x[0] - x[1]) !== 2)) {
                //console.log("Invalid wall length");
                return false;
            } else if (this.isP1Turn && this.p1.nWalls <= 0) {
                //console.log("Invalid Move: No walls left");
                return false;
            } else if (!this.isP1Turn && this.p2.nWalls <= 0) {
                //console.log("Invalid Move: No walls left");
                return false;
            } else if (isVertical && (x[0] < 0 || x[0] >= this.boardSize + 1 || y[0] < 0 || y[1] >= this.boardSize + 1)) {
                //console.log("Invalid Move: out of board");
                return false;
            } else if (!isVertical && (x[0] < 0 || x[1] >= this.boardSize + 1 || y[0] < 0 || y[0] >= this.boardSize + 1)) {
                //console.log("Invalid Move: out of board");
                return false;
            }

            // check for confilcts
            if (isVertical) {
                const r = x[0];
                const c = y[0] + 1; // assumes sorted

                // Vertical walls occupy: (r, c), (r, c+1)
                // You should also check (r, c+2) for overlap or junction conflicts
                const existing = [
                    this.getWallSymbol(this.walls?.[c]?.[r]),
                    this.getWallSymbol(this.walls?.[c + 1]?.[r]),
                    this.getWallSymbol(this.walls?.[c - 1]?.[r])
                ];
                // //console.log(existing);


                if (existing.some(cell => cell && '│┼├┤'.includes(cell)) || existing[0] == '─' || existing[1] == '╷' || existing[2] == '╵') {
                    //console.log("Invalid vertical wall placement: overlaps or connects to existing wall improperly");
                    return false;
                }
            } else {
                const c = y[0];
                const r = x[0] + 1; // assumes sorted

                // Horizontal walls occupy: (r, c), (r+1, c)
                const existing = [
                    this.getWallSymbol(this.walls?.[c]?.[r]),
                    this.getWallSymbol(this.walls?.[c]?.[r + 1]),
                    this.getWallSymbol(this.walls?.[c]?.[r - 1])
                ];
                // //console.log(existing);

                if (existing.some(cell => cell && '─┼┬┴'.includes(cell)) || existing[0] == '│' || existing[1] == '╴' || existing[2] == '╶') {
                    //console.log("Invalid horizontal wall placement: overlaps or connects to existing wall improperly");
                    return false;
                }
            }

            // check if the wall will block all the ways for the player using bfs
            const backup = this.walls.map(row => row.map(cell => ({ ...cell })));
            if (isVertical) {
                const row = x[0];
                const col1 = y[0];
                const col2 = y[1];

                this.walls[col1][row].up = true;
                this.walls[col1 + 1][row].down = true;
                this.walls[col2 - 1][row].up = true;
                this.walls[col2][row].down = true;
            } else {
                const row1 = x[0];
                const row2 = x[1];
                const col = y[0];
                this.walls[col][row1].right = true;
                this.walls[col][row1 + 1].left = true;
                this.walls[col][row2 - 1].right = true;
                this.walls[col][row2].left = true;
            }
            // check if the wall will block all the ways for the player using bfs
            const valid1 = this.checkPath(this.p1.position) && this.checkPath(this.p2.position);
            this.isP1Turn = !this.isP1Turn;
            const valid2 = this.checkPath(this.p1.position) && this.checkPath(this.p2.position);
            this.isP1Turn = !this.isP1Turn;

            this.walls = backup;
            if (!(valid1 && valid2)) {
                //console.log("Invalid Move: wall will block all ways");
                return false;
            }
        }
        //console.log("Move checked");
        return true;
    }

    move(move) {
        this.timeOver();
        if (this.isGameOver) {
            //console.log("Game Over no move");
            return false;
        }
        if (this.checkMove(move)) {
            // add the time to the player
            const now = Date.now();
            const elapsed = now - this.lastMoveTime; // in milliseconds
            if (this.isP1Turn) {
                this.t1 += elapsed;
            } else {
                this.t2 += elapsed;
            }
            this.lastMoveTime = now;
            if (this.timeOver()) {
                //console.log("sorry time is over");
                return false;
            }

            const splitMove = move.split('_');
            const type = splitMove[0];
            if (type[0] === 'p') {

                const from = this.isP1Turn ? this.p1.position : this.p2.position;
                const to = splitMove[1].split('-').map((e) => parseInt(e) - 1);
                this.board[from[0]] = this.board[from[0]].substring(0, from[1]) + 'e' + this.board[from[0]].substring(from[1] + 1);
                this.board[to[0]] = this.board[to[0]].substring(0, to[1]) + (this.isP1Turn ? '1' : '2') + this.board[to[0]].substring(to[1] + 1);
                this.isP1Turn ? this.p1.position = to : this.p2.position = to;
                // this.print();
                //console.log("Pawn Moved");
                // this.isP1Turn = !this.isP1Turn;
            } else if (type[0] === 'w') { // w1_ac-c
                const splitWall = splitMove[1].split('-');
                const start = splitWall[0].split('').map(e => e.charCodeAt(0) - 97); // 'a' → 0
                const end = splitWall[1].split('').map(e => e.charCodeAt(0) - 97);
                const isVertical = end.length === 2;
                start.sort((a, b) => a - b);
                end.sort((a, b) => a - b);
                //console.log(start, end);

                if (isVertical) {
                    // Vertical wall affects three wall cells: [row][col], [row][col+1], [row][col+2]
                    //console.log("vertical");

                    const row = start[0];
                    const col1 = end[0];
                    const col2 = end[1];

                    // wall goes from top to bottom between col1 and col2
                    // 2,46
                    this.walls[col1][row].up = true;
                    this.walls[col1 + 1][row].down = true;
                    this.walls[col2 - 1][row].up = true;
                    this.walls[col2][row].down = true;
                } else {
                    // Horizontal wall affects three wall cells: [row][col], [row+1][col], [row+2][col]
                    //console.log("horizontal");
                    const row1 = start[0];
                    const row2 = start[1];
                    const col = end[0];
                    this.walls[col][row1].right = true;
                    this.walls[col][row1 + 1].left = true;
                    this.walls[col][row2 - 1].right = true;
                    this.walls[col][row2].left = true;
                }
                //console.log("Wall Placed");
                this.isP1Turn ? this.p1.nWalls-- : this.p2.nWalls--;
            }

            // this.printAllBoard(); // Visualize updated wall placement
            this.moves.push(move);
            this.isP1Turn = !this.isP1Turn;
            if (this.isWin()) {
                //console.log("Game Over");
                this.isGameOver = true;
            }
            return true;
        } else {
            //console.log("Move not Made");
            return false;
        }
    }

    // check if the player time is out (10min)
    timeOver() {
        const currentTime = this.isP1Turn ? this.t1 : this.t2;
        const timeDiff = currentTime - this.startTime;
        if (timeDiff >= 10 * 60 * 1000) { // 10 minutes in milliseconds
            this.isGameOver = true;
            console.log("Time Is Over");
            return true;
        }
        return false;
    }

    // player win if he reached the other side
    isWin() {
        if (this.p1.position[0] === this.boardSize - 1) {
            this.isGameOver = true;
            this.winner = 1;
            // console.log("Player 1 Win");
            this.isGameOver = true;
            return true;
        } else if (this.p2.position[0] === 0) {
            this.isGameOver = true;
            this.winner = 2;
            // console.log("Player 2 Win");
            this.isGameOver = true;
            return true;
        }
        return false;
    }

    // funciton to get the shortest path for the player
    shortestPath(playerNum) {
        const start = playerNum === 1 ? this.p1.position : this.p2.position;
        const goalRow = playerNum === 1 ? this.boardSize - 1 : 0;


        const visited = new Set();
        const queue = [[start, [start]]]; // [position, path]

        const directions = [
            [0, 1],  // right
            [1, 0],  // down
            [0, -1], // left
            [-1, 0],  // up
        ];

        while (queue.length > 0) {
            const [current, path] = queue.shift();
            const key = `${current[0]}_${current[1]}`;
            if (visited.has(key)) continue;
            visited.add(key);
            const playerPosition = current;
            // console.log(current, path);

            // Check if reached goal row
            if (current[0] === goalRow) {
                return path;
            }

            for (let [dx, dy] of directions) {
                const next = [current[0] + dx, current[1] + dy];
                // Bounds check
                if (
                    next[0] >= 0 && next[0] < this.boardSize &&
                    next[1] >= 0 && next[1] < this.boardSize
                ) {
                    const moveStr = `p${playerNum}_${next[0] + 1}-${next[1] + 1}`;
                    if (this.checkMove(moveStr, playerPosition, next, false)) {
                        queue.push([next, [...path, next]]);
                    }
                }
            }
            // console.log("queue", (JSON.stringify(queue)), queue.length);
        }

        // No path found
        return null;
    }

    clone() {
        const newGame = new Game({
            p1: { name: this.p1.name, position: this.p1.position, nWalls: this.p1.nWalls },
            p2: { name: this.p2.name, position: this.p2.position, nWalls: this.p2.nWalls },
            boardSize: this.boardSize,
        });
        newGame.board = [...this.board]; // fully safe for string arrays
        newGame.walls = this.walls.map(row => row.map(cell => ({ ...cell })));
        newGame.isP1Turn = this.isP1Turn;
        newGame.t1 = this.t1;
        newGame.t2 = this.t2;
        newGame.startTime = this.startTime;
        newGame.lastMoveTime = this.lastMoveTime;
        return newGame;
    }
}



export default Game;