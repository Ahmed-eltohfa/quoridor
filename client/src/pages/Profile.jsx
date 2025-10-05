import { FaEdit, FaTrophy, FaGamepad, FaChartLine, FaUserAlt, FaCalendarAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import avatar1 from '../assets/avatar1.png';
import avatar2 from '../assets/avatar2.png'; 
import avatar3 from '../assets/avatar3.png';
import avatar4 from '../assets/avatar4.png';
import avatar5 from '../assets/avatar5.png';
import avatar6 from '../assets/avatar6.png';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../rtk/slices/authSlice.js';
import axios from 'axios';

export default function Profile() {
  const user = useSelector((state) => state.auth.user);
  useEffect(()=>{
    if (!user) {
      // Redirect to login if user is not logged in
      navigate('/login');
    }
  }, [user]);
  const avatars = [
    avatar1, avatar2, avatar3, avatar4, avatar5, avatar6
  ];
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  useEffect(() =>{
    // refetch user data 
    if (!token) return;

    const getUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const userData = response.data.user;
        dispatch(setUser(userData));
        localStorage.setItem("user", JSON.stringify(userData));
        console.log("User data fetched successfully:", userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUser();
  },[])
  
  return (
    <div className="min-h-screen bg-[#0e0e11] text-white py-12 px-6 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col items-center mb-8">
          <img
            src={avatars[user?.avatar] || avatar1} // Fallback to avatar1 if no avatarIndex
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-gray-700 shadow-lg"
          />
          <h2 className="text-2xl font-bold mt-4">{user.username}</h2>
          <button className="mt-3 px-4 py-1 rounded-full bg-gray-700 hover:bg-gray-600 text-sm flex items-center gap-2 cursor-pointer" onClick={()=>{navigate('/settings')}}>
            <FaEdit /> Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mb-10">
          <div className="bg-btn-secondary hover:bg-secondary-hover rounded-lg p-4 flex flex-col items-center">
            <FaGamepad className="text-xl mb-2 text-blue-400" />
            <div className="text-2xl font-bold">{user.totalGames}</div>
            <div className="text-gray-400">Games Played</div>
          </div>
          <div className="bg-btn-secondary hover:bg-secondary-hover rounded-lg p-4 flex flex-col items-center">
            <FaChartLine className="text-xl mb-2 text-green-400" />
            <div className="text-2xl font-bold">{user.totalGames > 0 ? (Math.floor((user.wins / user.totalGames)*100)) : '-'}</div>
            <div className="text-gray-400">Win Rate</div>
          </div>
          <div className="bg-btn-secondary hover:bg-secondary-hover rounded-lg p-4 flex flex-col items-center">
            <FaTrophy className="text-xl mb-2 text-yellow-400" />
            <div className="text-2xl font-bold">{user.rank > 0 ? user.rank : 'WTF Dude'}</div>
            <div className="text-gray-400">Rank</div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Recent Games</h3>
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
                {user.history.map((game, index) => (
                  <tr key={index} className="border-b border-gray-800 hover:bg-[#1c1c22]">
                    <td className="p-3"><span className="inline-flex items-center gap-2"><FaGamepad /> Quoridor</span></td>
                    <td className="p-3 flex items-center gap-2"><FaUserAlt /> {game.opponent}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-xs font-medium ${
                          game.result === 'Win' || game.result === 'win'
                            ? 'bg-green-600'
                            : game.result === 'Loss' || game.result === 'loss'
                            ? 'bg-red-600'
                            : 'bg-yellow-600'
                        }`}
                      >
                        {game.result}
                      </span>
                    </td>
                    <td className="p-3 flex items-center gap-2"><FaCalendarAlt /> {new Date(game.timestamp).toISOString().split("T")[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
