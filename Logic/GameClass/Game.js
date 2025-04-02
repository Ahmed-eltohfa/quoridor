class Game {
    constructor(info) {
        console.log(info);
        this.p1 = info.p1;
        this.p2 = info.p2;
        this.boardSize = info.boardSize || 9;
        this.board = Array(this.boardSize).fill('e'.repeat(this.boardSize));
        this.mod = info.mod || {};
        this.t1 = 0;
        this.t2 = 0;
        this.startTime = Date.now();
        this.isP1Turn = true;
        this.isGameOver = false;
        this.p1.position = this.p1.position || [0, Math.floor(this.boardSize / 2)];
        this.p2.position = this.p2.position || [this.boardSize - 1, Math.floor(this.boardSize / 2)];
        this.board[this.p1.position[0]] = this.board[this.p1.position[0]].substring(0, this.p1.position[1]) + '1' + this.board[this.p1.position[0]].substring(this.p1.position[1] + 1);
        this.board[this.p2.position[0]] = this.board[this.p2.position[0]].substring(0, this.p2.position[1]) + '2' + this.board[this.p2.position[0]].substring(this.p2.position[1] + 1);
        console.log(this.p1, this.p2);
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
    checkMove(move) {
        const splitMove = move.split('_');
        const type = splitMove[0]; // p1_5-5 | w2_d-ac
        const opponent = this.isP1Turn ? this.p2 : this.p1;
        console.log("op", opponent.position);
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
        } else if (type[0] === 'p') { // check pawn move
            const from = this.isP1Turn ? this.p1.position : this.p2.position;
            const to = splitMove[1].split('-').map((e) => parseInt(e) - 1);
            console.log(from, to);
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
        }

        console.log("Move checked");
        return true;
    }

    move(move) {
        if (this.checkMove(move)) {
            const splitMove = move.split('_');
            const type = splitMove[0];
            if (type[0] === 'p') {
                const from = this.isP1Turn ? this.p1.position : this.p2.position;
                const to = splitMove[1].split('-').map((e) => parseInt(e) - 1);
                this.board[from[0]] = this.board[from[0]].substring(0, from[1]) + 'e' + this.board[from[0]].substring(from[1] + 1);
                this.board[to[0]] = this.board[to[0]].substring(0, to[1]) + (this.isP1Turn ? '1' : '2') + this.board[to[0]].substring(to[1] + 1);
                this.isP1Turn ? this.p1.position = to : this.p2.position = to;
                this.print();
                console.log("Moved");
                this.isP1Turn = !this.isP1Turn;
            }
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