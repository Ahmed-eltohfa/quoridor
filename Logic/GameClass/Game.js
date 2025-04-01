class Game{
    constructor(info){
        this.p1=info.p1;
        this.p2=info.p2;
        this.boardSize=info.boardSize|9;
        this.board=[];
        this.mod=info.mod|{};
        this.t1=0;
        this.t2=0;
        this.startTime= Date.now();
        this.isP1Turn=true;
        this.isGameOver=false;
    }
    print(){
        console.log("lol");
    }
    checkMove(move){
        console.log("Valid Move");
        return true;
    }
    move(move){
        if(this.checkMove){
            console.log("Moving");
        }
    }
    timeOver(){
        console.log("Time Is Over");
    }
    isWin(){
        console.log("Winning");
    }
}



export default Game;