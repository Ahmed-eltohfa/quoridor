import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { FaBolt, FaUsers, FaRobot } from 'react-icons/fa';
import boardImg from '../assets/board.png'
import { updateMode } from '../rtk/slices/settingsSlice';

export default function Game() {
  const [localConfig, setLocalConfig] = useState({
    player1: '',
    player2: '',
    boardSize: 9,
    walls: 10,
  });
  const [aiLevel, setAiLevel] = useState('medium');

  const handleStartQuickMatch = () => alert('Starting Quick Match...');
  const handleStartLocalGame = () => alert('Starting local game...');
  const handleStartAiGame = () => alert(`Starting AI game on ${aiLevel} difficulty...`);

  const settingsState = useSelector(state=>state.settings.gameMode);
  const dispatch = useDispatch();


  return (
    <div className="text-white min-h-screen flex flex-col justify-between bg-[#0e0e11] px-4 py-8">
      <div className="flex flex-col items-center space-y-6">
        {/* Top Game Mode Buttons */}
        <div className="flex flex-wrap justify-center gap-8">
          <button
            onClick={() => dispatch(updateMode('quick'))}
            className="bg-blue-600 hover:bg-blue-700 transition-all w-32 h-32 rounded-xl flex flex-col items-center justify-center gap-2 shadow-lg cursor-pointer text-white text-sm"
          >
            <FaBolt size={28} />
            <span className="text-center">Quick Match</span>
          </button>

          <button
            onClick={() => dispatch(updateMode('local'))}
            className="bg-purple-600 hover:bg-purple-700 transition-all w-32 h-32 rounded-xl flex flex-col items-center justify-center gap-2 shadow-lg cursor-pointer text-white text-sm"
          >
            <FaUsers size={28} />
            <span className="text-center">Local Match</span>
          </button>

          <button
            onClick={() => dispatch(updateMode('ai'))}
            className="bg-yellow-600 hover:bg-yellow-700 transition-all w-32 h-32 rounded-xl flex flex-col items-center justify-center gap-2 shadow-lg cursor-pointer text-white text-sm"
          >
            <FaRobot size={28} />
            <span className="text-center">Play vs AI</span>
          </button>
        </div>

        {/* Bottom Panel - Dynamic Content */}
        <div className="w-full max-w-2xl mt-10 p-6 bg-[#1c1c1f] rounded-xl shadow-xl transition-all duration-500 animate-fade-in">
          {!settingsState && (
            <div className="text-center text-gray-400">
              <h2 className="text-xl font-semibold text-white mb-2">Choose a Game Mode</h2>
              <p>Select how you want to play: online with others, locally, or against AI.</p>
            </div>
          )}

          {settingsState === 'quick' && (
            <div className="space-y-4 animate-fade-in transition-opacity duration-500">
              <h2 className="text-xl font-semibold">Quick Match</h2>
              <p className="text-gray-400">Join a public game instantly with a random player.</p>
              <button
                onClick={handleStartQuickMatch}
                className="bg-green-600 hover:bg-green-700 w-full px-4 py-2 rounded-lg cursor-pointer transition-all"
              >
                Start Matchmaking
              </button>
            </div>
          )}

          {settingsState === 'local' && (
            <div className="space-y-4 animate-fade-in transition-opacity duration-500">
              <h2 className="text-xl font-semibold">Local Multiplayer Setup</h2>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm text-gray-400">Player 1 Name</label>
                  <input
                    type="text"
                    className="w-full bg-gray-800 rounded p-2 text-white"
                    value={localConfig.player1}
                    onChange={(e) => setLocalConfig({ ...localConfig, player1: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Player 2 Name</label>
                  <input
                    type="text"
                    className="w-full bg-gray-800 rounded p-2 text-white"
                    value={localConfig.player2}
                    onChange={(e) => setLocalConfig({ ...localConfig, player2: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div>
                  <label className="block text-sm text-gray-400">Board Size</label>
                  <select
                    value={localConfig.boardSize}
                    onChange={(e) => setLocalConfig({ ...localConfig, boardSize: parseInt(e.target.value) })}
                    className="bg-gray-800 rounded px-3 py-2"
                  >
                    <option value={7}>7x7</option>
                    <option value={9}>9x9</option>
                    <option value={11}>11x11</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Walls per Player</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={localConfig.walls}
                    onChange={(e) => setLocalConfig({ ...localConfig, walls: parseInt(e.target.value) })}
                    className="bg-gray-800 rounded p-2 w-20"
                  />
                </div>
              </div>
              <button
                onClick={handleStartLocalGame}
                className="mt-4 bg-green-600 hover:bg-green-700 w-full px-4 py-2 rounded-lg cursor-pointer transition-all"
              >
                Start Local Game
              </button>
            </div>
          )}

          {settingsState === 'ai' && (
            <div className="space-y-4 animate-fade-in transition-opacity duration-500">
              <h2 className="text-xl font-semibold">Play vs AI</h2>
              <p className="text-gray-400">Select AI difficulty and start the game.</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['easy', 'medium', 'hard', 'expert'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setAiLevel(level)}
                    className={`capitalize px-4 py-2 rounded-lg w-full transition-all cursor-pointer ${
                      aiLevel === level
                        ? 'bg-yellow-600 text-white'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <button
                onClick={handleStartAiGame}
                className="mt-4 bg-green-600 hover:bg-green-700 w-full px-4 py-2 rounded-lg cursor-pointer"
              >
                Start Game vs AI
              </button>
            </div>
          )}
        </div>

        {/* Placeholder for Board View */}
        <div className="mt-12 w-full max-w-4xl aspect-square bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center text-gray-500">
          <img src={boardImg} alt="Board Image" />
        </div>
      </div>
      
    </div>
  );
}
