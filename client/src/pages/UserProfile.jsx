import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { avatars } from '../utils/avatars';
import { useSelector } from 'react-redux';


function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [sendingFriend, setSendingFriend] = useState(false);
  const [sendingInvite, setSendingInvite] = useState(false);
  const [actionMsg, setActionMsg] = useState(null); // {type: 'success'|'error', text: string}

  const currentUser = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  
    const handleSendFriendRequest = async () => {
  };

  const handleSendGameInvite = async () => {

  };

  useEffect(() => {
    // get user id from url
    const userId = window.location.pathname.split('/').pop();
    console.log(userId);
    
    const fetchUserData = async () => {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/players/${userId}/profile`);
      setUserData(response.data.profile);
      console.log(response.data.profile);
        // profile: {
        //     username,
        //     avatar,
        //     rank,
        //     wins,
        //     losses,
        //     totalGames,
        //     playerSince,
        //     recentHistory: history.slice(0, 10), // last 10 games
        // }
    }
    fetchUserData();
  }, []);
  
    const {
    username,
    avatar,
    rank,
    wins,
    losses,
    totalGames,
    playerSince,
    recentHistory = []
  } = userData || {};
    const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : '-';

  return (
    <div>
      {userData ? (
        <div className="min-h-screen bg-[#0e0e11] text-white py-12 px-6 flex justify-center">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left card: big avatar + basic */}
        <div className="bg-[#0f1724] rounded-lg p-6 flex flex-col items-center gap-4 shadow-lg">
          <img src={avatars[avatar] || avatars[0]} alt="Avatar" className="w-40 h-40 rounded-full border-4 border-gray-700 shadow-xl" />
          <h1 className="text-3xl font-bold">{username}</h1>
          <div className="text-gray-400">Member since: {new Date(playerSince).toISOString().split('T')[0]}</div>

          <div className="w-full mt-4 grid grid-cols-3 gap-3">
            <div className="bg-btn-secondary rounded-lg p-3 text-center">
              <div className="text-sm text-gray-300">Games</div>
              <div className="text-2xl font-bold">{totalGames}</div>
            </div>
            <div className="bg-btn-secondary rounded-lg p-3 text-center">
              <div className="text-sm text-gray-300">Rank</div>
              <div className="text-2xl font-bold">{rank}</div>
            </div>
            <div className="bg-btn-secondary rounded-lg p-3 text-center">
              <div className="text-sm text-gray-300">Win %</div>
              <div className="text-2xl font-bold">{winRate}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="w-full mt-4 flex flex-col gap-2">
            {currentUser && String(currentUser._id) !== String(window.location.pathname.split('/').pop()) ? (
              <>
                <button
                  onClick={handleSendFriendRequest}
                  disabled={sendingFriend}
                  className="w-full py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                >
                  {sendingFriend ? 'Sending...' : 'Add Friend'}
                </button>
                <button
                  onClick={handleSendGameInvite}
                  disabled={sendingInvite}
                  className="w-full py-2 rounded-full bg-green-600 hover:bg-green-500 text-white font-semibold"
                >
                  {sendingInvite ? 'Inviting...' : 'Invite to Play'}
                </button>
              </>
            ) : (
              <div className="text-center text-gray-400 text-sm">Login to interact with this player</div>
            )}
          </div>

          {actionMsg && (
            <div className={`mt-3 text-center px-3 py-2 rounded ${actionMsg.type === 'error' ? 'bg-red-700' : 'bg-green-700'}`}>
              {actionMsg.text}
            </div>
          )}
        </div>

        {/* Middle card: stats and history (wider) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0f1724] rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Performance</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#0b1220] p-4 rounded">
                <div className="text-sm text-gray-400">Wins</div>
                <div className="text-2xl font-bold">{wins}</div>
              </div>
              <div className="bg-[#0b1220] p-4 rounded">
                <div className="text-sm text-gray-400">Losses</div>
                <div className="text-2xl font-bold">{losses}</div>
              </div>
              <div className="bg-[#0b1220] p-4 rounded">
                <div className="text-sm text-gray-400">Total Games</div>
                <div className="text-2xl font-bold">{totalGames}</div>
              </div>
            </div>
          </div>

          <div className="bg-[#0f1724] rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Recent Games</h2>
            <div className="w-full overflow-x-auto">
              <table className="w-full table-auto border-collapse text-left text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th className="p-3">Game</th>
                    <th className="p-3">Opponent</th>
                    <th className="p-3">Result</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentHistory.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-4 text-center text-gray-400">No recent games</td>
                    </tr>
                  )}
                  {recentHistory.map((game, index) => (
                    <tr key={index} className="border-b border-gray-800 hover:bg-[#1c1c22]">
                      <td className="p-3">Quoridor</td>
                      <td className="p-3 flex items-center gap-2">{game.opponent}</td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-white text-xs font-medium ${
                            (game.result === 'Win' || game.result === 'win') ? 'bg-green-600'
                              : (game.result === 'Loss' || game.result === 'loss') ? 'bg-red-600'
                              : 'bg-yellow-600'
                          }`}
                        >
                          {game.result}
                        </span>
                      </td>
                      <td className="p-3">{new Date(game.timestamp).toISOString().split('T')[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-[#0f1724] rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">About</h2>
            <p className="text-gray-300">This is a public profile. If you want to play or add this player, use the buttons on the left. The profile shows recent games and statistics.</p>
          </div>
        </div>
      </div>
    </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default UserProfile