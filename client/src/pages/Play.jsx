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
import { socket } from '../utils/socket';
import { useNavigate } from 'react-router-dom';
import moveSound from '../assets/move.mp3';

function Play() {

    window.addEventListener("beforeunload", function (e) {
        if (window.location.pathname === "/waiting" || window.location.pathname === "/play") {
            socket.emit('unwaitPlayer'); // Notify the server to remove this player from waiting if they were waiting
        }
        e.preventDefault();
        e.returnValue = ""; // required for Chrome
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const gameInfo = useSelector((state => state.game.gameInfo));
    const gameSettings = useSelector(state => state.settings.gameMode);
    const playerNum = useSelector(state => state.settings.playerNumifOnline);
    useEffect(()=>{
        console.log(gameInfo);
        console.log(gameSettings);
    },[gameInfo]);
    let winnerIfDisconnect = null;
    
    
    const game = useRef(new Game(gameInfo));

    useEffect(() => {
        socket.on("invalidMove", (data) => {
            console.log("Server says:", data);
        });
        
        socket.on("gameOver", (data) => {
            console.log("Server says:", data);
        });
        
        socket.on("gameUpdated", (data) => {
            console.log("Server says:", data);
            if (data.success) {
                if (data.gameState.move && data.gameState.move.length !== game.current.moves[game.current.moves.length - 1]) {
                    const move = data.gameState.move;
                    game.current.move(move);
                    playMoveSound();
                    triggerRender();
                }
            }
        });

        socket.on("opponentDisconnected", (data) => {
            console.log("Server says:", data);
            game.current.isGameOver = true;
            winnerIfDisconnect = true;
            triggerRender();
        }
        );
        return () => {
            socket.off("invalidMove");
            socket.off("gameOver");
            socket.off("gameUpdated");
            socket.off("opponentDisconnected");
        };
    }, []);
    
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
                grid.push(<WallNode key={key} walls={wall} position={{i,j}} size={size} game={game} triggerRender={triggerRender} playMoveSound={playMoveSound} />);
            });
            if (i === size) break; // Skip the last row for walls
            for (let j = 0; j < size; j++) {
                const key = `c-${i}-${j}`;
                grid.push(<Cell key={key} player={game.current.board[i][j]} offset={j} size={size} game={game} position={ {i, j} } triggerRender={triggerRender} playMoveSound={playMoveSound} />);
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
        // navigate to home
        navigate('/');
    }

    const playMoveSound = () => {
        const audio = new Audio(moveSound);
        audio.volume = 0.5;
        audio.play().catch(err => console.log('Sound play failed:', err));
    }

    return (
        <div className="min-h-screen bg-[#0e0e11] text-white py-6 flex flex-col items-center">
            {game.current.isGameOver && (() => {
                const isPlayerWinner = winnerIfDisconnect ? true : (game.current.winner === playerNum || game.current.winner === 1);
                // console.log("Game over! Winner is player", game.current.winner);
                const isOnlineGame = gameSettings === 'quick';
                return (
                    <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-[1000] backdrop-blur-sm">
                        {/* Animated background effect */}
                        <div className={`absolute inset-0 opacity-20 ${isPlayerWinner ? 'bg-gradient-to-br from-green-500 via-transparent to-transparent animate-pulse' : 'bg-gradient-to-br from-red-500 via-transparent to-transparent animate-pulse'}`}></div>
                        
                        <div className={`gameOverCard relative rounded-3xl shadow-2xl p-12 text-center border-2 
                            ${isPlayerWinner 
                                ? 'border-green-400 bg-gradient-to-b from-[#1a1a1f] to-[#0e0e11] victory-glow' 
                                : 'border-red-400 bg-gradient-to-b from-[#1a1a1f] to-[#0e0e11] defeat-glow'
                            } max-w-md w-full mx-4 animate-scaleIn`}>
                            
                            {/* Victory/Defeat Badge */}
                            <div className={`inline-block mb-4 px-6 py-2 rounded-full text-sm font-bold tracking-widest
                                ${isPlayerWinner 
                                    ? 'bg-green-500 bg-opacity-20 text-green-300 border border-green-400' 
                                    : 'bg-red-500 bg-opacity-20 text-red-300 border border-red-400'
                                }`}>
                                {isPlayerWinner ? '🎉 VICTORY! 🎉' : '💔 DEFEAT 💔'}
                            </div>
                            
                            {/* Main Title */}
                            <h1 className={`text-6xl font-black mb-2 drop-shadow-lg ${
                                isPlayerWinner ? 'text-green-300' : 'text-red-300'
                            }`}>
                                {isPlayerWinner ? 'YOU WIN!' : 'GAME OVER'}
                            </h1>
                            
                            {/* Winner Name */}
                            <p className="text-xl text-text-secondary font-semibold mb-8">
                                <span className={`font-bold ${isPlayerWinner ? 'text-green-400' : 'text-red-400'}`}>
                                    Winner: {game.current.winner === 1 ? game.current.p1.name : game.current.p2.name}
                                </span>
                            </p>

                            {/* Stats Section */}
                            <div className="bg-[#252530] bg-opacity-60 rounded-xl p-6 mb-8 border border-[#3a3a42]">
                                <p className="text-text-muted text-xs uppercase tracking-wider mb-4">Match Statistics</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-text-muted text-sm mb-1">Walls Used</p>
                                        <p className="text-2xl font-bold text-text-primary">
                                            {game.current.p1.nWalls}
                                        </p>
                                        <p className="text-xs text-text-muted">{game.current.p1.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-text-muted text-sm mb-1">Walls Used</p>
                                        <p className="text-2xl font-bold text-text-primary">
                                            {game.current.p2.nWalls}
                                        </p>
                                        <p className="text-xs text-text-muted">{game.current.p2.name}</p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-[#3a3a42]">
                                    <p className="text-text-muted text-sm mb-2">Total Moves</p>
                                    <p className="text-lg font-semibold text-badge-lock">{game.current.moves.length}</p>
                                </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3">
                                {!isOnlineGame && (
                                    <button
                                        onClick={onPlayAgain}
                                        className={`w-full px-6 py-3 rounded-lg font-bold text-white text-lg transition-all duration-200
                                            ${isPlayerWinner 
                                                ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 shadow-lg hover:shadow-green-500/50 hover:shadow-2xl' 
                                                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-lg hover:shadow-blue-500/50 hover:shadow-2xl'
                                            }`}
                                    >
                                        Rematch
                                    </button>
                                )}
                                <button
                                    onClick={onExit}
                                    className="w-full px-6 py-3 bg-btn-secondary hover:bg-secondary-hover rounded-lg font-bold text-white text-lg transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                    Return Home
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}
            
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