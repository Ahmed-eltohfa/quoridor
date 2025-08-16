import { FaSpinner, FaUserFriends } from 'react-icons/fa';
import avatar1 from '../assets/avatar1.png';
import avatar2 from '../assets/avatar2.png'; 
import avatar3 from '../assets/avatar3.png';
import avatar4 from '../assets/avatar4.png';
import avatar5 from '../assets/avatar5.png';
import avatar6 from '../assets/avatar6.png';
import { useEffect, useState } from 'react';
import { socket } from '../utils/socket';
import { useDispatch, useSelector } from 'react-redux';
import { updateGameInfo } from '../rtk/slices/gameSlice';
import { useNavigate } from 'react-router-dom';
import { updatePlayerNum } from '../rtk/slices/settingsSlice';


const avatars = [avatar1,avatar2, avatar3, avatar4,avatar5, avatar6];

export default function Waiting() {
  const [currentAvatar, setCurrentAvatar] = useState(0);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("messageFromServer", (data) => {
      console.log("Server says:", data);
    });

    return () => {
      socket.off("messageFromServer");
    };
  }, []);

  useEffect(() => {
    const handleMatchFound = (matchData) => {
      console.log("Match found!", matchData);
      if (matchData.success === false) {
        console.error("Error finding match:", matchData.message);
        return;
      }
      else{
        // const opponent = matchData.players[0].id === user._id ? matchData.players[1] : matchData.players[0];
        dispatch(updateGameInfo({
          p1: { name: matchData.players[0].username, nWalls: 10, avatar: matchData.players[0].avatar }, // Player 1 info
          p2: { name: matchData.players[1].username, nWalls: 10, avatar: matchData.players[1].avatar, }, // Player 2 info
          boardSize: 9,
        }))
        dispatch(updatePlayerNum(matchData.players[0].id === user._id ? 1 : 2)); // Update player number based on user ID
        // Redirect to the game page 
        navigate('/play');
      }
    };

    // Listen for the event
    socket.on("startGame", handleMatchFound);

    // Cleanup only the listener you added
    return () => {
      socket.off("startGame", handleMatchFound);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAvatar((prev) => (prev + 1) % avatars.length);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0e0e11] text-white flex flex-col items-center justify-center px-4 text-center animate-fade-in">
      <button
      className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4'
      onClick={() => {
        socket.emit("joinGame", { username: user.username, userId: user._id, rank: user.rank, avatar: user.avatar });
        console.log("Join game trigger sent");
      }}
      >
        TEST JOIN GAME TRIGERR
      </button>
      <div className="flex items-center gap-10 mb-10">
        {/* Player avatar */}
        <div className="flex flex-col items-center">
          <img src={avatar1} alt="You" className="w-20 h-20 rounded-full border-2 border-blue-500" />
          <span className="text-sm text-text-secondary mt-2">You</span>
        </div>

        {/* VS */}
        <div className="text-xl text-gray-500 font-bold">VS</div>

        {/* Rotating avatar */}
        <div className="flex flex-col items-center">
          <img src={avatars[currentAvatar]} alt="Opponent" className="w-20 h-20 rounded-full border-2 border-gray-600" />
          <span className="text-sm text-text-secondary mt-2">Finding Opponent</span>
        </div>
      </div>

      <FaUserFriends className="text-blue-400 text-5xl mb-4" />
      <h1 className="text-2xl font-bold mb-2">Looking for a Match...</h1>
      <p className="text-text-secondary mb-6 max-w-md">
        Hang tight! We're finding a worthy opponent for you. This won’t take long.
      </p>

      <div className="flex items-center gap-3">
        <FaSpinner className="text-blue-500 text-3xl animate-spin" />
        <span className="text-gray-300">Searching for available players</span>
      </div>

      <div className="mt-10 text-sm text-gray-600">Tip: You can invite a friend directly by sharing a room code.</div>
    </div>
  );
}
