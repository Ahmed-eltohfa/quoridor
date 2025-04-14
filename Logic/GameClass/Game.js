const pointGenerator = () => {
    return {
        up: false,
        down: false,
        left: false,
        right: false
    }
}
const x = pointGenerator();



class Game {
    constructor(info) {
        console.log(info);
        this.p1 = info.p1;
        this.p2 = info.p2;
        this.boardSize = info.boardSize || 9;
        this.board = Array(this.boardSize).fill('e'.repeat(this.boardSize));
        this.walls = Array.from({ length: this.boardSize + 1 }, () =>
            Array.from({ length: this.boardSize + 1 }, () => ({
                up: false,
                down: false,
                left: false,
                right: false
            }))
        );
        this.mod = info.mod || {};
        this.t1 = 0;
        this.t2 = 0;
        this.startTime = Date.now();
        this.isP1Turn = true;
        this.moves = [];
        this.isGameOver = false;
        this.p1.position = this.p1.position || [0, Math.floor(this.boardSize / 2)];
        this.p2.position = this.p2.position || [this.boardSize - 1, Math.floor(this.boardSize / 2)];
        this.board[this.p1.position[0]] = this.board[this.p1.position[0]].substring(0, this.p1.position[1]) + '1' + this.board[this.p1.position[0]].substring(this.p1.position[1] + 1);
        this.board[this.p2.position[0]] = this.board[this.p2.position[0]].substring(0, this.p2.position[1]) + '2' + this.board[this.p2.position[0]].substring(this.p2.position[1] + 1);
        console.log(this.p1, this.p2);
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
        else if (down && left) return '┌';
        else if (down && right) return '┐';
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
        console.log(this.walls.length)
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
        console.log('  -   ' + Array.from({ length: this.boardSize }, (_, i) => i + 1).join('   '));
        this.board.reverse();
        this.walls.reverse();
    }

    checkMove(move) {

        const splitMove = move.split('_');
        const type = splitMove[0]; // p1_5-5 | w2_d-ac
        const opponent = this.isP1Turn ? this.p2 : this.p1;
        // console.log("op", opponent.position);
        const moveRegex = /^[p][1-4]_\d{1,2}-\d{1,2}$|^[w][1-4]_[a-zA-Z]{1,2}-[a-zA-Z]{1,2}$/;

        if (this.isGameOver) {
            console.log("Game Over");
            return false;
        } else if (!moveRegex.test(move)) {
            console.log("Invalid Move");
            return false;
        } else if ((this.isP1Turn && type[1] !== '1') || (!this.isP1Turn && type[1] !== '2')) {
            console.log("Not Your Turn");
            return false;
        } else if (this.p1.position.length === 0 || this.p2.position.length === 0) {
            console.log("Player Position Not Found");
            return false;
        } else if (type[0] === 'p') { // check pawn move ex. p1_2-6
            const from = this.isP1Turn ? this.p1.position : this.p2.position;
            const to = splitMove[1].split('-').map((e) => parseInt(e) - 1);
            // console.log(from, to);
            if (from[0] === to[0] && from[1] === to[1]) {
                console.log("Invalid Move: same position");
                return false;
            }
            else if ((Math.abs(from[0] - to[0]) > 1 && opponent.position[0] !== Math.abs(from[0] + to[0]) / 2) ||
                (Math.abs(from[1] - to[1]) > 1 && opponent.position[1] !== Math.abs(from[1] + to[1]) / 2)) { // stop the move more than one step execpt if the opponent is in the middle
                console.log("Invalid Move: out of range");
                return false;
            } else if ((Math.abs(from[0] - to[0]) >= 1 && Math.abs(from[1] - to[1]) >= 1)) { // stop the diagonal move
                console.log("Invalid Move: no diagonal moves");
                return false;
            }
            else if (to[0] === opponent.position[0] && to[1] === opponent.position[1]) {
                console.log("Invalid Move: opponent position");
                return false;
            }
        } else if (type[0] === 'w') { // check wall move ex. w1_ac-c
            const x = splitMove[1].split('-')[0].split('').map((e) => e.charCodeAt(0) - 97);
            const y = splitMove[1].split('-')[1].split('').map((e) => e.charCodeAt(0) - 97);
            x.sort((a, b) => a - b);
            y.sort((a, b) => a - b);
            const isVertical = y.length === 2;
            console.log(x, y);
            if (x.length + y.length !== 3 || x.length >= 3 || y.length >= 3) {
                console.log("Invalid Move: wall move");
                return false;
            } else if ((isVertical && Math.abs(y[0] - y[1]) !== 2) || (!isVertical && Math.abs(x[0] - x[1]) !== 2)) {
                console.log("Invalid wall length");
                return false;
            }

            if (isVertical) {
                const r = x[0];
                const c = y[0]; // assumes sorted

                // Vertical walls occupy: (r, c), (r, c+1)
                // You should also check (r, c+2) for overlap or junction conflicts
                const existing = [
                    this.getWallSymbol(this.walls?.[r]?.[c]),
                    this.getWallSymbol(this.walls?.[r]?.[c + 1]),
                    this.getWallSymbol(this.walls?.[r]?.[c + 2])
                ];

                if (existing.some(cell => cell && '│┼├┤╷╵'.includes(cell))) {
                    console.log("Invalid vertical wall placement: overlaps or connects to existing wall improperly");
                    return false;
                }
            } else {
                const c = y[0];
                const r = x[0]; // assumes sorted

                // Horizontal walls occupy: (r, c), (r+1, c)
                const existing = [
                    this.getWallSymbol(this.walls?.[r]?.[c]),
                    this.getWallSymbol(this.walls?.[r + 1]?.[c]),
                    this.getWallSymbol(this.walls?.[r + 2]?.[c])
                ];

                if (existing.some(cell => cell && '─┼┬┴╶╴'.includes(cell))) {
                    console.log("Invalid horizontal wall placement: overlaps or connects to existing wall improperly");
                    return false;
                }
            }
        }
        console.log("Move checked");
        return true;
    }

    move(move) {
        if (this.checkMove(move)) {
            console.log("flagggggggggggggggggggggg");
            const splitMove = move.split('_');
            const type = splitMove[0];
            if (type[0] === 'p') {

                const from = this.isP1Turn ? this.p1.position : this.p2.position;
                const to = splitMove[1].split('-').map((e) => parseInt(e) - 1);
                this.board[from[0]] = this.board[from[0]].substring(0, from[1]) + 'e' + this.board[from[0]].substring(from[1] + 1);
                this.board[to[0]] = this.board[to[0]].substring(0, to[1]) + (this.isP1Turn ? '1' : '2') + this.board[to[0]].substring(to[1] + 1);
                this.isP1Turn ? this.p1.position = to : this.p2.position = to;
                // this.print();
                console.log("Pawn Moved");
                // this.isP1Turn = !this.isP1Turn;
            } else if (type[0] === 'w') { // w1_ac-c
                const splitWall = splitMove[1].split('-');
                const start = splitWall[0].split('').map(e => e.charCodeAt(0) - 97); // 'a' → 0
                const end = splitWall[1].split('').map(e => e.charCodeAt(0) - 97);
                const isVertical = end.length === 2;
                start.sort((a, b) => a - b);
                end.sort((a, b) => a - b);
                console.log(start, end);

                if (isVertical) {
                    // Vertical wall affects three wall cells: [row][col], [row][col+1], [row][col+2]
                    console.log("vertical");

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
                    console.log("horizontal");
                    const row1 = start[0];
                    const row2 = start[1];
                    const col = end[0];
                    this.walls[col][row1].right = true;
                    this.walls[col][row1 + 1].left = true;
                    this.walls[col][row2 - 1].right = true;
                    this.walls[col][row2].left = true;
                }
                console.log("Wall Placed");
            }
            //     this.print(); // Visualize updated wall placement
            //     this.printWalls(); // Visualize updated wall placement
            this.printAllBoard(); // Visualize updated wall placement
            this.isP1Turn = !this.isP1Turn;
        }
    }

    timeOver() {
        console.log("Time Is Over");
    }

    isWin() {
        console.log("Winning");
    }
}



export default Game;