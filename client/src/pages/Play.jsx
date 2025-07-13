import React from 'react'
import { useEffect, useState } from 'react';
import { Game } from 'quoridor-game-engine'
import Cell from './../components/Cell';
import WallNode from '../components/WallNode';

function Play() {
    
    // console.log(JSON.stringify(newGame));
    
    // return (
    // <div>Play</div>
    // )
    const newGame = new Game({
        p1: { name: 'testone' },
        p2: { name: 'testtwo' },
        boardSize: 9,
    });
    const [game, setGame] = useState(newGame);
    game.move('p1_2-5');
    game.move('p2_8-5');
    game.move('p1_2-6');
    console.log(game.board);
    game.move('w2_ac-b');
    console.log(game.board);
    
    
    const size = game.boardSize;
    const renderGrid = () => {
        game.board.reverse();
        game.walls.reverse();
        const grid = [];
        for (let i = 0; i < size+1; i++) {
            game.walls[i].forEach((wall, j) => {
                const key = `w-${i}-${j}`;
                grid.push(<WallNode key={key} walls={wall} />);
            });
            if (i === size) break; // Skip the last row for walls
            for (let j = 0; j < size; j++) {
                const key = `c-${i}-${j}`;
                grid.push(<Cell key={key} player={game.board[i][j]} offset={j} size={size}/>);
            }
            grid.push(<div key={`end-${i}`} className="w-0 h-0" />); // Empty cell at the end of each row
        }
        game.board.reverse();
        game.walls.reverse();
        return grid;
    };

    return (
        <div className="min-h-screen bg-[#0e0e11] text-white py-12 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-6">Quoridor Game</h1>
            <WallNode walls={{up:true,down:true,right:true,left:true}} />
            <div
                className="grid gap-0 bg-[#2b2b2b] p-3 rounded-lg"
                style={{
                    gridTemplateColumns: `repeat(${size + 1}, auto)`
                }}
                >
                {renderGrid()}
            </div>
        </div>
    );
}

export default Play