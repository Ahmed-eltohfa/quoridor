import React from 'react'
import { useEffect, useState, useRef } from 'react';
import { Game } from 'quoridor-game-engine'
import Cell from './../components/Cell';
import WallNode from '../components/WallNode';

function Play() {
    
    // console.log(JSON.stringify(newGame));
    
    // return (
    // <div>Play</div>
    // )
    // const newGame = new Game({
    //     p1: { name: 'testone' },
    //     p2: { name: 'testtwo' },
    //     boardSize: 9,
    // });
    // const [game, setGame] = useState(newGame);
    // console.log(game);

    const game = useRef(new Game({
        p1: { name: 'testone' },
        p2: { name: 'testtwo' },
        boardSize: 9,
    }));
    console.log(game);
    
    const [, forceUpdate] = useState(0);

    // To trigger re-render manually after updates
    const triggerRender = () => forceUpdate(n => n + 1);
    
    
    const size = game.current.boardSize;
    const renderGrid = () => {
        game.current.board.reverse();
        game.current.walls.reverse();
        const grid = [];
        for (let i = 0; i < size+1; i++) {
            game.current.walls[i].forEach((wall, j) => {
                const key = `w-${i}-${j}`;
                grid.push(<WallNode key={key} walls={wall} />);
            });
            if (i === size) break; // Skip the last row for walls
            for (let j = 0; j < size; j++) {
                const key = `c-${i}-${j}`;
                grid.push(<Cell key={key} player={game.current.board[i][j]} offset={j} size={size}/>);
            }
            grid.push(<div key={`end-${i}`} className="w-0 h-0" />); // Empty cell at the end of each row
        }
        game.current.board.reverse();
        game.current.walls.reverse();
        return grid;
    };
    console.log('render')
    return (
        <div className="min-h-screen bg-[#0e0e11] text-white py-12 flex flex-col items-center">
            
            <h1 className="text-2xl font-bold mb-6">Quoridor Game</h1>
            <WallNode walls={{up:true,down:true,right:true,left:true}} />
            <div
                className="grid gap-0 bg-[#2b2b2b] p-1 md:p-8 rounded-lg board_background bg-cover"
                style={{
                    gridTemplateColumns: `repeat(${size + 1}, auto)`
                }}
                >
                {renderGrid()}
            </div>
            <input
                type="text"
                placeholder="Enter your move"
                className="mt-4 p-2 rounded"
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        // Handle the move submission logic here
                        console.log(`Move entered: ${e.target.value}`);
                        game.current.move(`${e.target.value}`)
                        triggerRender();
                        console.log(game);
                        console.log(game.current.shortestPath(1));
                        
                        e.target.value = ''; // Clear the input after submission
                    }
                }}
            />
        </div>
    );
}

export default Play