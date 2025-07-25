import React from 'react'
import { FaUserShield, FaHourglassHalf, FaUndoAlt, FaLightbulb, FaFlag } from 'react-icons/fa';
import { GiStoneWall } from "react-icons/gi";
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
    // console.log(game);
    
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
                grid.push(<WallNode key={key} walls={wall} position={{i,j}} size={size} game={game} />);
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

    return (
        <div className="min-h-screen bg-[#0e0e11] text-white py-6 flex flex-col items-center">
            {/* Top Player Info 2 */}
            <div className={`${game.current.isP1Turn ? 'off' : 'on'} flex justify-between items-center px-4 py-1 bg-btn-secondary text-badge-lock rounded-xl shadow-inner w-4/5 md:w-3/5 max-w-[400px] gap-5 md:gap-1`}>
                <div className="flex items-center gap-0.5 text-badge-lock text-xl md:text-3xl md:min-w-24">
                    <FaHourglassHalf />
                    <span>{(game.current.t2 / 1000 / 60).toFixed(1)}m</span>
                </div>
                <div className="flex items-center gap-2 ">
                    <div className={`flex flex-col justify-center items-center text-badge-lock relative`}>
                        <img src={avatar} className="w-10 h-10 rounded-full border border-gray-600" alt="P1 Avatar" />
                        <div className="px-3 py-1 bg-gradient-to-r from-btn-primary to-btn-secondary text-white text-xs rounded-full shadow-md animate-slideFade">
                            {game.current.p2.name}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-badge-lock text-3xl w-24 justify-center">
                    <span>{game.current.p2.nWalls}</span>
                    <GiStoneWall />
                </div>
            </div>

            {/* Game Board */}
            <div
                className="grid gap-0 bg-[#2b2b2b] px-1 py-3 md:px-6 md:py-6 rounded-lg board_background bg-cover mt-3 mb-6"
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
                        dispatch(updateValidMoves([]));
                        triggerRender();
                        // console.log(game);
                        
                        e.target.value = ''; // Clear the input after submission
                    }
                }}
            />
            
            {/* bottom Player Info 1 */}
            <div className={`${game.current.isP1Turn ? 'on' : 'off'} flex justify-between items-center px-4 py-1 bg-btn-secondary text-badge-lock rounded-xl shadow-inner w-4/5 md:w-3/5 max-w-[400px] gap-5 md:gap-1`}>
                <div className="flex items-center gap-1 text-badge-lock text-3xl w-24 justify-center">
                    <span>{game.current.p1.nWalls}</span>
                    <GiStoneWall />
                </div>
                <div className="flex items-center gap-2 ">
                    <div className={`flex flex-col justify-center items-center text-badge-lock relative`}>
                        <img src={avatar} className="w-10 h-10 rounded-full border border-gray-600" alt="P1 Avatar" />
                        <div className="px-3 py-1 bg-gradient-to-r to-btn-primary from-btn-secondary text-white text-xs rounded-full shadow-md animate-slideFade">
                            {game.current.p1.name}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-0.5 text-badge-lock text-xl md:text-3xl md:min-w-24">
                    <FaHourglassHalf />
                    <span>{(game.current.t1 / 1000 / 60).toFixed(1)}m</span>
                </div>
            </div>

            {/* Controls */}
            <div className="mt-4 flex gap-4 justify-center">
                <button className="bg-green-600 px-4 py-2 rounded shadow hover:bg-green-700">Surrender</button>
                <button className="bg-yellow-600 px-4 py-2 rounded shadow hover:bg-yellow-700">Undo</button>
                <button className="bg-blue-600 px-4 py-2 rounded shadow hover:bg-blue-700">Hint</button>
            </div>
        </div>
    );
}

export default Play