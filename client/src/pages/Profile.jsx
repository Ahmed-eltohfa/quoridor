import { FaEdit, FaTrophy, FaGamepad, FaChartLine, FaUserAlt, FaCalendarAlt, FaSignOutAlt, FaUsers } from 'react-icons/fa';
import { useSelector } from 'react-redux';
// import avatar1 from '../assets/avatar1.png';
// import avatar2 from '../assets/avatar2.png'; 
// import avatar3 from '../assets/avatar3.png';
// import avatar4 from '../assets/avatar4.png';
// import avatar5 from '../assets/avatar5.png';
// import avatar6 from '../assets/avatar6.png';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { clearToken, setUser } from '../rtk/slices/authSlice.js';
import axios from 'axios';
import { avatars } from '../utils/avatars.js';

export default function Profile() {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [friends, setFriends] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingAvatar, setUpdatingAvatar] = useState(false);

  useEffect(()=>{
    if (!token) {
      navigate('/login');
      return;
    }
    // initial load: refresh server user and small dashboard datasets
    const load = async () => {
      setLoading(true);
      try {
        const [meRes, friendsRes, lbRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}api/auth/me`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}api/players/friends/list`, { headers: { Authorization: `Bearer ${token}` } }).catch(()=>({ data: { friends: [] } })),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}api/players/leaderboard`).catch(()=>({ data: { leaderboard: [] } }))
        ]);

        if (meRes?.data?.user) {
          dispatch(setUser(meRes.data.user));
          localStorage.setItem('user', JSON.stringify(meRes.data.user));
        }

        setFriends(friendsRes?.data?.friends || []);
        setLeaderboard(lbRes?.data?.leaderboard || []);
      } catch (err) {
        console.error('Profile load error', err);
      } finally {
        setLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleEdit = () => navigate('/settings');

  const handleLogout = () => {
    dispatch(clearToken());
    dispatch(setUser(null));
    navigate('/login');
  };


  const handelFriendClick = (friendId) => {
    navigate(`/user/${friendId}`);
  }

  const recentGames = (user?.history || []).slice(0,6);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e0e11] text-white flex items-center justify-center">
        <div>Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#071018] text-white py-8 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: large header card */}
        <div className="bg-gradient-to-b from-[#0f1724] to-[#0b1220] rounded-xl p-6 flex flex-col items-center gap-4 shadow-xl">
          <div className="relative">
            <img src={avatars[user?.avatar] || avatars[0]} alt="Avatar" className="w-36 h-36 rounded-full border-4 border-black shadow-2xl" />

          </div>

          <h1 className="text-2xl font-extrabold">{user?.username}</h1>
          <div className="text-sm text-gray-300 text-center">Player ID: {user?._id}</div>
          <div className="text-sm text-gray-300">Joined {new Date(user?.playerSince).toLocaleDateString()}</div>

          <div className="w-full grid grid-cols-3 gap-3 mt-3">
            <div className="bg-[#07141d] rounded p-3 text-center">
              <div className="text-xs text-gray-400">Games</div>
              <div className="text-xl font-bold">{user?.totalGames}</div>
            </div>
            <div className="bg-[#07141d] rounded p-3 text-center">
              <div className="text-xs text-gray-400">Wins</div>
              <div className="text-xl font-bold">{user?.wins}</div>
            </div>
            <div className="bg-[#07141d] rounded p-3 text-center">
              <div className="text-xs text-gray-400">Rank</div>
              <div className="text-xl font-bold">{user?.rank}</div>
            </div>
          </div>

          <div className="w-full mt-4 flex gap-3">
            <button onClick={handleEdit} className="flex-1 py-2 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center gap-2">
              <FaEdit /> Edit
            </button>
            <button onClick={handleLogout} className="py-2 px-4 rounded-full bg-red-600 hover:bg-red-500 flex items-center gap-2">
              <FaSignOutAlt /> Logout
            </button>
          </div>

          <div className="w-full mt-4 text-sm text-gray-400 text-center">
            <div>Quick actions: share your profile or challenge friends from the friends panel.</div>
          </div>
        </div>

        {/* Middle column: detailed stats + recent games */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#07121a] rounded-xl p-6 shadow-md">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><FaChartLine /> Performance Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[#08131a] rounded">
                <div className="text-xs text-gray-400">Win Rate</div>
                <div className="text-2xl font-bold">{user?.totalGames > 0 ? Math.round((user.wins / user.totalGames) * 100) + '%' : '-'}</div>
                <div className="text-xs text-gray-500 mt-2">Last 10 games</div>
                <div className="mt-3 flex gap-1">
                  {(user.history || []).slice(0,10).map((g,i)=> (
                    <div key={i} className={`w-6 h-4 rounded ${g.result?.toLowerCase() === 'win' ? 'bg-green-500' : g.result?.toLowerCase() === 'loss' ? 'bg-red-500' : 'bg-yellow-500'}`} title={`${g.opponent} • ${g.result}`} />
                  ))}
                </div>
              </div>
              
              <div className="p-4 bg-[#08131a] rounded"> 
                {/* losses stats */}
                <div className="text-xs text-gray-400">Losses</div>
                <div className="text-2xl font-bold">{user?.losses}</div>
                <div className="text-xs text-gray-500 mt-2">
                  {user?.totalGames > 0 
                    ? `Losses • ${Math.round((user.losses / user.totalGames) * 100)}% of games` 
                    : 'Losses • -'}
                </div>
              </div>

              <div className="p-4 bg-[#08131a] rounded">
                <div className="text-xs text-gray-400">Top Opponents</div>
                <div className="mt-2 space-y-2">
                  {recentGames.length === 0 && <div className="text-sm text-gray-500">No recent opponents</div>}
                  {recentGames.map((g, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs">{(g.opponent || '?').slice(0,1)}</div>
                        <div className="text-sm">{g.opponent}</div>
                      </div>
                      <div className={`text-xs font-medium ${g.result?.toLowerCase() === 'win' ? 'text-green-400' : g.result?.toLowerCase() === 'loss' ? 'text-red-400' : 'text-yellow-400'}`}>
                        {g.result}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#07121a] rounded-xl p-6 shadow-md">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><FaGamepad /> Recent Games</h2>
            <div className="w-full overflow-auto">
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-800">
                    <th className="p-3 text-left">Opponent</th>
                    <th className="p-3">Result</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(user.history || []).slice(0, 10).map((game, idx) => (
                    <tr key={idx} className="border-b border-gray-800 hover:bg-[#071826]">
                      <td className="p-3">{game.opponent}</td>
                      <td className="p-3">
                        <span className={`px-3 py-1 rounded-full text-xs ${game.result?.toLowerCase() === 'win' ? 'bg-green-600' : game.result?.toLowerCase() === 'loss' ? 'bg-red-600' : 'bg-yellow-600'}`}>
                          {game.result}
                        </span>
                      </td>
                      <td className="p-3">{new Date(game.timestamp).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {(user.history || []).length === 0 && (
                    <tr><td colSpan="3" className="p-4 text-center text-gray-500">No games yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-[#07121a] rounded-xl p-6 shadow-md">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><FaUsers /> Friends & Quick Match</h2>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {friends.slice(0,12).map((f) => (
                    <div key={f.id} className="flex flex-col items-center text-center p-2 bg-[#06121a] rounded cursor-pointer" onClick={() => handelFriendClick(f.id)}>
                      <img src={avatars[f.avatar] || avatars[0]} alt={f.username} className="w-10 h-10 rounded-full" />
                      <div className="text-xs mt-1">{f.username}</div>
                    </div>
                  ))}
                  {friends.length === 0 && <div className="text-gray-400 col-span-6 p-3">You have no friends yet — add some!</div>}
                </div>
              </div>

              <div className="w-56 p-3 bg-[#06121a] rounded">
                <div className="text-xs text-gray-400">Leaderboard (top 3)</div>
                <ol className="mt-2 space-y-2">
                  {leaderboard.slice(0,3).map((p, i) => (
                    <li key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs">{p.username?.slice(0,1)}</div>
                        <div className="text-sm">{p.username}</div>
                      </div>
                      <div className="text-sm font-semibold">{p.rank}</div>
                    </li>
                  ))}
                  {leaderboard.length === 0 && <div className="text-gray-500 text-sm mt-2">No leaderboard data</div>}
                </ol>

                <button onClick={()=>navigate('/game')} className="mt-4 w-full py-2 rounded bg-green-600 hover:bg-green-500 text-sm">Quick Match</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
