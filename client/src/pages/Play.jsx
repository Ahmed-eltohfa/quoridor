import React from 'react'
import { FaUserShield, FaHourglassHalf, FaUndoAlt, FaLightbulb, FaFlag } from 'react-icons/fa';
import { GiStoneWall } from "react-icons/gi";
import { useEffect, useState, useRef } from 'react';
import { Game } from 'quoridor-game-engine'
import Cell from './../components/Cell';
import WallNode from '../components/WallNode';
import avatar from '../assets/avatar1.png'
import { useDispatch, useSelector } from 'react-redux';
import { updateValidMoves } from '../rtk/slices/gameSlice';

function Play() {

    window.addEventListener("beforeunload", function (e) {
        e.preventDefault();
        e.returnValue = ""; // required for Chrome
    });

    const dispatch = useDispatch();
    const gameInfo = useSelector((state => state.game.gameInfo));
    useEffect(()=>{
        console.log(gameInfo);
    },[gameInfo]);
    

    const game = useRef(new Game(gameInfo));
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
                grid.push(<WallNode key={key} walls={wall} position={{i,j}} size={size} game={game} triggerRender={triggerRender} />);
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

    const undo = () => {
        console.log('undo');
        return;
        console.log(game.current);
        game.current.undo();
        triggerRender();
        console.log(game.current);
    }

    const onPlayAgain = ()=>{
        console.log('restart');
        // game.current.restartGame();
        game.current.init(gameInfo);
        triggerRender();
        console.log(game)
    }

    const onExit = ()=>{
        console.log('exit');
    }

    return (
        <div className="min-h-screen bg-[#0e0e11] text-white py-6 flex flex-col items-center">
            {game.current.isGameOver && (
                <div className="fixed inset-0 bg-[#00000087] bg-opacity-70 flex flex-col items-center justify-center z-[1000]">
                    <div className="winner-card rounded-2xl shadow-2xl p-8 text-center border-4 border-amber-900">
                        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mb-4">
                            GAME OVER
                        </h1>
                        <p className="text-2xl text-text-secondary font-semibold mb-6">
                            Winner: <span className="">{game.current.winner === 1 ? game.current.p1.name : game.current.p2.name }</span>
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={onPlayAgain}
                                className="px-6 py-3 bg-btn-primary hover:bg-btn-hover rounded-lg font-bold text-white shadow-md"
                            >
                                Restart
                            </button>
                            <button
                                onClick={onExit}
                                className="px-6 py-3 bg-btn-secondary hover:bg-secondary-hover rounded-lg font-bold text-white shadow-md"
                            >
                                Exit
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Top Player Info 2 */}
            <div className={`${game.current.isP1Turn ? 'off' : 'on'} flex justify-between items-center px-4 py-1 bg-btn-secondary text-badge-lock rounded-xl shadow-inner w-4/5 md:w-3/5 max-w-[400px] gap-5 md:gap-1`}>
                <div className="flex items-center gap-0.5 text-badge-lock text-xl md:text-3xl min-w-18 md:min-w-24">
                    <FaHourglassHalf />
                    <span>
                    {Math.floor(game.current.t2 / 1000 / 60)}:{(game.current.t2 / 1000 % 60).toFixed(0).toString().padStart(2, '0')}
                    </span>
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

            {/* main */}
            <div className="cont flex justify-between w-full max-h-[550px] gap-2 xl:max-h-[700px]">
                {/* Controls */}
                <div className="mt-4 hidden lg:flex gap-4 justify-center flex-col">
                    <button className="bg-green-600 px-4 py-2 rounded shadow hover:bg-green-700 flex items-center gap-2"><FaFlag />Surrender</button>
                    <button className="bg-yellow-600 px-4 py-2 rounded shadow hover:bg-yellow-700 flex items-center gap-2 disabled:" onClick={undo}><FaUndoAlt />Undo</button>
                    <button className="bg-blue-600 px-4 py-2 rounded shadow hover:bg-blue-700 flex items-center gap-2"><FaLightbulb />Hint</button>
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
                {/* moves */}
                <div className="moves hidden mt-4 lg:flex flex-wrap w-38 h-fit border border-btn-secondary p-2 min-h-20">
                    <div className='w-full border-b-gray-300 text-text-muted text-center border mb-1'>
                        Moves
                    </div>
                    {game.current.moves.map((element,i)=>(
                        <span className={`${i%2 === 0 ? 'text-green-500' : 'text-blue-500'} w-[calc(50% - 4px)] mr-1`} key={i}>{element},</span>
                    ))} 
                </div>
            </div>
            
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
                <div className="flex items-center gap-0.5 text-badge-lock text-xl md:text-3xl min-w-18 md:min-w-24">
                    <FaHourglassHalf />
                    <span>
                    {Math.floor(game.current.t1 / 1000 / 60)}:{(game.current.t1 / 1000 % 60).toFixed(0).toString().padStart(2, '0')}
                    </span>
                </div>
            </div>
                {/* Controls */}
                <div className="mt-4 flex lg:hidden gap-4 justify-center">
                    <button className="bg-green-600 px-4 py-2 rounded shadow hover:bg-green-700 flex items-center gap-2"><FaFlag />Surrender</button>
                    <button className="bg-yellow-600 px-4 py-2 rounded shadow hover:bg-yellow-700 flex items-center gap-2"><FaUndoAlt />Undo</button>
                    <button className="bg-blue-600 px-4 py-2 rounded shadow hover:bg-blue-700 flex items-center gap-2"><FaLightbulb />Hint</button>
                </div>

        </div>
    );
}

export default Play