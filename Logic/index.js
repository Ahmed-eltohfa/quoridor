import Game from "./GameClass/Game.js";

const g1=new Game({
    p1:"youssef",
    p2:"Ahmed",
});
g1.print();
g1.checkMove("move");
g1.isWin();
g1.move("move");