import { Link } from 'react-router-dom';
import heroImage from '../assets/hero.png';
import winImg from '../assets/win.png';
import loseImg from '../assets/lose.png';
import drawImg from '../assets/draw.png';
import { avatars } from './../utils/avatars';
import { FaGamepad, FaLock } from 'react-icons/fa';
import { use, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setFriends } from '../rtk/slices/authSlice';

// const friends = [
//   { id: 1, name: 'Owen', status: 'Online', avatar: avatars },
//   { id: 2, name: 'Lily', status: 'Online', avatar: avatars },
// ];


export default function Home() {
  
  const user = useSelector((state) => state.auth.user);
  // const [friends, setFriends] = useState([]);
  const friends = useSelector((state) => state.auth.friends);
  const [recentGames, setRecentGames] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();


  useEffect(()=>{
    setRecentGames(user?.history ? user?.history.slice(0,3) :[]);
  },[user])

  useEffect(() => {
    // Fetch friends data from an API or use static data
    const fetchFriends = async () => {
      const friendsData = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/players/friends/list`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(res => res.data.friends);
      dispatch(setFriends(friendsData.slice(0,5)));
      return friendsData;
    }
    if (token)
      fetchFriends();
  }, [user,token]);

  return (
    <div className="text-white space-y-10">
      {/* Hero Section */}
      <div className="h-108 lg:h-128 p-6 px-12 rounded-2xl shadow-md relative flex justify-center items-center">
        <img
          src={heroImage}
          alt="Quoridor board"
          className="rounded-xl w-full object-cover absolute -z-1 top-0 left-0 h-full opacity-50 "
        />
        <div className="mt-6 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold">Quoridor</h1>
          <p className="text-text-secondary mt-2 lg:text-xl">
            Challenge your friends to a game of strategy and cunning. Outsmart your
            opponents and be the first to reach the end.
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <Link
              to="/game"
              className="bg-btn-primary hover:bg-btn-hover text-white px-4 py-2 rounded-lg transition"
            >
              New Game
            </Link>
            <Link
              to="/join"
              className="bg-btn-secondary hover:bg-secondary-hover text-white px-4 py-2 rounded-lg transition"
            >
              Join Game
            </Link>
          </div>
        </div>
      </div>

      {/* Play Options */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Play</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-btn-secondary cursor-pointer rounded-xl p-5 flex gap-4 items-center hover:bg-secondary-hover transition-all">
            <div className="bg-blue-500 p-3 rounded-full">
              <FaGamepad className="text-white text-xl" />
            </div>
              <div>
                <h3 className="font-bold">Quick Match</h3>
                <p className="text-gray-400 text-sm">Join a random opponent instantly</p>
              </div>
          </div>
          <div className="bg-btn-secondary cursor-pointer rounded-xl p-5 flex gap-4 items-center hover:bg-secondary-hover transition-all">
            <div className="bg-yellow-500 p-3 rounded-full">
              <FaLock className="text-white text-xl" />
            </div>
              <div>
                <h3 className="font-bold">Private Room</h3>
                <p className="text-gray-400 text-sm">Invite your friends to play</p>
              </div>
          </div>
        </div>
      </div>

      {/* Tip + Live Player Stats */}
      <div className="bg-bg-card rounded-xl p-4 mt-4 space-y-2 shadow-md">
        <div className="text-white font-semibold flex items-center gap-8">
          <p className='text-2xl'>
            Tip of the Day :
          </p>
          <p className="text-text-muted text-md flex items-center">
            Use your walls to delay, not block — every wall counts.
          </p>
        </div>
        <div className="text-text-muted text-xs pt-2 border-t border-gray-700">
          413 players online · 96 games in progress
        </div>
      </div>

      {/* Recent Games */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Games</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 place-items-center">
          {recentGames.map((game,index) => (
            <div
              key={index}
              className="bg-btn-secondary rounded-xl overflow-hidden w-[250px] cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 box-shadow"
            >
              <img src={game.result === 'win' ? winImg : loseImg} alt={game.opponent} className="w-full h-48" />
              <div className="p-4">
                <h3 className="font-semibold">Game vs. {game.opponent}</h3>
                <p className="text-sm text-gray-400 capitalize">{game.result}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Friends */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Friends</h2>
        {
          friends.length === 0 ? <p className="text-text-muted">No friends online</p> :
          <div className="space-y-3">
          {
            friends.map((friend) => (
              <div key={friend.id} className="flex items-center justify-between bg-[#2a2a2d] px-4 py-2 rounded-xl">
              <div className="flex items-center gap-3">
                <img src={avatars[friend.avatar]} className="w-10 h-10 rounded-full" alt={friend.username} />
                <div>
                  <p className="font-semibold">{friend.username}</p>
                  <p className="text-sm text-green-400">{friend.rank}</p>
                </div>
              </div>
              <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm cursor-pointer">
                Invite
              </button>
            </div>
          ))}
        </div>
        }
      </div>
    </div>
  );
}
