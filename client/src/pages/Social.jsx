import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

export default function Social() {
  const [search, setSearch] = useState('');
  const [friends, setFriends] = useState([
    { name: 'Ethan Carter', status: 'Online', avatar: 'https://i.pravatar.cc/40?img=1' },
    { name: 'Sophia Clark', status: 'Offline', avatar: 'https://i.pravatar.cc/40?img=2' },
    { name: 'Liam Harper', status: 'Online', avatar: 'https://i.pravatar.cc/40?img=3' },
    { name: 'Olivia Bennett', status: 'Offline', avatar: 'https://i.pravatar.cc/40?img=4' },
  ]);

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(search.toLowerCase())
  );

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
              key={index}
              className="flex items-center justify-between bg-[#1a1a1f] p-4 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-10 h-10 rounded-full border border-gray-500"
                />
                <div>
                  <div className="font-semibold">{friend.name}</div>
                  <div className={`text-sm ${friend.status === 'Online' ? 'text-green-400' : 'text-gray-400'}`}>
                    {friend.status}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-full flex items-center gap-1 cursor-pointer">
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
