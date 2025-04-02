import Game from "./GameClass/Game.js";

const g1 = new Game({
    p1: { name: "youssef", position: null },
    p2: { name: "ahmed", position: null },
    boardSize: 9,
});

g1.print();
// g1.checkMove("p1_2-5");
// g1.isWin();
g1.move("p1_2-5");
// g1.move("p2_8-5");
// g1.move("p1_3-5");
// g1.move("p2_6-5");