import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { avatars } from '../utils/avatars';

export default function Social() {
  const [search, setSearch] = useState('');
  const friendsList = useSelector((state) => state.auth.friends);
  console.log(friendsList);
  
  const navigate = useNavigate();

  const filteredFriends = friendsList.filter(friend =>
    friend.username?.toLowerCase().includes(search.toLowerCase())
  );

  const openProfile = (friend) => {
    navigate(`/user/${friend.id}`);
  }

  return (
    <div className="min-h-screen bg-[#0e0e11] text-white py-12 px-6 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-bold mb-8 text-center">Friends</h1>

        <div className="relative mb-6">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for friends"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded bg-[#2b2b31] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <ul className="space-y-4">
          {filteredFriends.map((friend, index) => (
            <li
              key={friend.id || index}
              className="flex items-center justify-between bg-[#1a1a1f] p-4 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <img
                  src={avatars[friend.avatar] || avatars[0]}
                  alt={friend.username}
                  className="w-10 h-10 rounded-full border border-gray-500"
                />
                <div>
                  <div className="font-semibold">{friend.username}</div>
                  <div className={`text-sm ${friend.status === 'Online' ? 'text-green-400' : 'text-gray-400'}`}>
                    {friend.rank ? `Rank: ${friend.rank}` : 'No rank'}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-full flex items-center gap-1 cursor-pointer" onClick={() => openProfile(friend)}>
                  Profile
                </button>
                <button className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded-full flex items-center gap-1 cursor-pointer">
                  Invite
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
