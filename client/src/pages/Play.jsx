import React from 'react'
import { useEffect, useState, useRef } from 'react';
import { Game } from 'quoridor-game-engine'
import Cell from './../components/Cell';
import WallNode from '../components/WallNode';
import avatar from '../assets/avatar1.png'
import { useDispatch } from 'react-redux';
import { updateValidMoves } from '../rtk/slices/gameSlice';

function Play() {
    const dispatch = useDispatch();

    const game = useRef(new Game({
        p1: { name: 'testone' },
        p2: { name: 'testtwo' },
        boardSize: 9,
    }));
    console.log(game);
    
    const [, forceUpdate] = useState(0);

    // To trigger re-render manually after updates
    const triggerRender = () => forceUpdate(n => n + 1);
    
    const renderHorizontalWallStack = (playerWalls, color) => (
        <div className="flex gap-2 justify-center mb-4">
            {Array.from({ length: playerWalls }).map((_, i) => (
            <div
                key={i}
                className={`w-6 h-2 rounded bg-[${color}]`}
                style={{ backgroundColor: color }}
            />
            ))}
        </div>
    );
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
                grid.push(<Cell key={key} player={game.current.board[i][j]} offset={j} size={size} game={game} position={ {i, j} } triggerRender={triggerRender} />);
            }
            grid.push(<div key={`end-${i}`} className="w-0 h-0" />); // Empty cell at the end of each row
        }
        game.current.board.reverse();
        game.current.walls.reverse();
        return grid;
    };
    console.log('render')

    return (
        <div className="min-h-screen bg-[#0e0e11] text-white py-6 flex flex-col items-center">
            {/* Player HUD */}
            <div className="w-full max-w-6xl flex justify-between items-center px-4">
                <div className="flex items-center gap-4">
                <img src={avatar} className="w-14 h-14 rounded-full border border-gray-500" alt="p1 avatar" />
                <div>
                    <div className="font-bold">{game.current.p1.name}</div>
                    <div className="text-sm text-gray-400">Walls: {game.current.p1.nWalls} | Time: {game.current.t1 / 1000}s</div>
                </div>
                </div>

                <div className="text-xl font-semibold text-gray-400">VS</div>

                <div className="flex items-center gap-4">
                <div className="text-right">
                    <div className="font-bold">{game.current.p2.name}</div>
                    <div className="text-sm text-gray-400">Walls: {game.current.p2.nWalls} | Time: {game.current.t2 / 1000}s</div>
                </div>
                <img src={avatar} className="w-14 h-14 rounded-full border border-gray-500" alt="p2 avatar" />
                </div>
            </div>

            {renderHorizontalWallStack(game.current.p2.nWalls, '#facc15')}
            {/* Game Board */}
            <div
                className="grid gap-0 bg-[#2b2b2b] px-1 py-3 md:px-6 md:py-6 rounded-lg board_background bg-cover mt-3 mb-6"
                style={{
                    gridTemplateColumns: `repeat(${size + 1}, auto)`
                }}
                >
                {renderGrid()}
            </div>
            {renderHorizontalWallStack(game.current.p1.nWalls, '#16a34a')}
            <input
                type="text"
                placeholder="Enter your move"
                className="mt-4 p-2 rounded"
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        // Handle the move submission logic here
                        console.log(`Move entered: ${e.target.value}`);
                        game.current.move(`${e.target.value}`)
                        dispatch(updateValidMoves([]));
                        triggerRender();
                        console.log(game);
                        
                        e.target.value = ''; // Clear the input after submission
                    }
                }}
            />
            
            {/* Controls or Footer (optional) */}
            <div className="mt-4 flex gap-4">
                <button className="bg-green-600 px-4 py-2 rounded shadow hover:bg-green-700">Surrender</button>
                <button className="bg-yellow-600 px-4 py-2 rounded shadow hover:bg-yellow-700">Undo</button>
                <button className="bg-blue-600 px-4 py-2 rounded shadow hover:bg-blue-700">Hint</button>
            </div>
        </div>
    );
}

export default Play