import Game from "./GameClass/Game.js";

const g1 = new Game({
    p1: { name: "youssef", position: null },
    p2: { name: "ahmed", position: null },
    boardSize: 9,
});

g1.print();
console.log("=========================");
g1.printWalls();
console.log("======================================");
g1.printAllBoard();
// console.log(g1.walls)
// g1.checkMove("p1_2-5");
// g1.isWin();
g1.move("p1_2-5");
g1.move("p2_8-5");
// g1.printAllBoard();
g1.move("w1_eg-h");
g1.move("w2_eg-c");
g1.move("w1_e-hj");
g1.move("p2_8-6");
g1.move("w1_g-hj");
g1.move("p2_7-6");
// g1.move("p1_3-5");
// g1.move("p2_4-4");
// g1.move("p1_4-5");
// g1.move("p2_4-6");