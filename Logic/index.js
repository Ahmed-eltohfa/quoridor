import Game from "./GameClass/Game.js";
import Player from "./GameClass/Player.js";
import readline from 'readline';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function displayMenu() {
    rl.question(
        "=== Welcome to Quoridor Game ===\n1. Start New Game\n2. Print Current Game Status\n3. Make a Move\n4. Exit\nChoose an option (1-4): ",
        (choice) => {
            switch (choice) {
                case "1":
                    startNewGame();
                    break;
                case "2":
                    printGameStatus();
                    break;
                case "3":
                    makeMove();
                    break;
                case "4":
                    console.log("Thanks for playing!");
                    rl.close();
                    break;
                default:
                    console.log("Invalid choice. Please try again.");
                    displayMenu();
                    break;
            }
        }
    );
}

function startNewGame() {
    rl.question("Enter Player 1's name: ", (p1Name) => {
        rl.question("Enter Player 2's name: ", (p2Name) => {
            rl.question("Enter board size (e.g., 9): ", (boardSize) => {
                g1 = new Game({
                    p1: { name: p1Name, position: null },
                    p2: { name: p2Name, position: null },
                    boardSize: Number(boardSize),
                });

                g1.print();
                console.log("=========================");
                g1.printWalls();
                console.log("======================================");
                g1.printAllBoard();
                displayMenu();
            });
        });
    });
}

function printGameStatus() {
    if (!g1) {
        console.log("No game in progress.");
        displayMenu();
        return;
    }

    console.log("Current Game Status:");
    g1.print();
    g1.printWalls();
    g1.printAllBoard();
    displayMenu();
}

function makeMove() {
    if (!g1) {
        console.log("No game in progress.");
        displayMenu();
        return;
    } else if (g1.isWin()) {
        console.log("Game is over. Please start a new game.");
        displayMenu();
        return;
    }
    else if (g1.isGameOver) {
        console.log("Game is over. Please start a new game.");
        displayMenu();
        return;
    }
    rl.question("Enter your move (e.g., p1_2-5 or w1_ac-g): ", (move) => {
        if (move.startsWith('p1') || move.startsWith('p2') || move.startsWith('w1') || move.startsWith('w2')) {
            g1.move(move);
        } else {
            console.log("Invalid move format.");
        }
        displayMenu();
    });
}

// Initialize the game menu on start
let g11 = null;

function gameMenu(game) {
    g11 = game;  // Store the game object for later use
    displayMenu();
}


// displayMenu();



const g1 = new Game({
    p1: { name: "Player 1", nWalls: 15 },
    p2: { name: "Player 2", difficulty: "horror" },
    boardSize: 5,
});

while (g1.isGameOver === false) {
    g1.move(g1.p1.randomMove(g1));
    g1.move(g1.p2.randomMove(g1));
}
// g1.printAllBoard();


// g1.print();
// console.log("=========================");
// g1.printWalls();
// console.log("======================================");
// g1.printAllBoard();
// // console.log(g1.walls)
// // g1.checkMove("p1_2-5");
// // g1.isWin();
// // g1.move("p1_2-5");
// // g1.move("p2_8-5");
// // g1.printAllBoard();
// g1.move("w1_ac-g");
// g1.move("w2_ce-g");
// g1.move("w1_eg-g");
// g1.move("w2_hj-g");
// g1.move("w1_gi-i");
// g1.move("w2_g-gi");
// g1.move("w1_j-gi");
// g1.move("w2_e-ac");
// g1.move("w1_eg-b");
// g1.move("w2_g-ac");
// g1.move("w1_ce-f");
// g1.move("w1_eg-a");
// g1.move("p1_8-7");
// g1.move("p2_9-4");
// g1.move("p1_8-8");
// g1.move("p2_9-5");
// g1.move("p1_8-9");
// g1.move("p2_9-4");
// g1.move("p1_9-9");
// g1.move("w2_g-ca");
// setTimeout(() => {
//     g1.move("p1_2-5");
//     console.log(g1.t1);
// }, 3000);
// g1.restartGame();
// g1.move("p2_4-6");