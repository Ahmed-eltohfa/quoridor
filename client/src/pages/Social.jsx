import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { avatars } from '../utils/avatars';
import axios from 'axios';
import { setFriends, setSearchedUsers } from '../rtk/slices/authSlice';

export default function Social() {
  const [search, setSearch] = useState('');
  const friendsList = useSelector((state) => state.auth.friends).map(friend => ({
    ...friend,
    isFriend: true
  }));
  const searchedUsers = useSelector((state) => state.auth.searchedUsers);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = async () => {
    // disable the button for 3 seconds to prevent spamming
    document.querySelector('.custom').disabled = true;
    setTimeout(() => {
      document.querySelector('.custom').disabled = false;
    }, 3000);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}api/players/friends/search?q=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      dispatch(setSearchedUsers(response.data.users));
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const filteredFriends = searchedUsers.concat(friendsList.filter(friend =>
    friend.username?.toLowerCase().includes(search.toLowerCase()))).filter((friend, index, self) =>
    index === self.findIndex((f) => f.id === friend.id)
  );

  const openProfile = (friend) => {
    navigate(`/user/${friend.id}`);
  }

  useEffect(() => {
    // Only fetch friends if we don't have any and we have a token
    const fetchFriends = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}api/players/friends/list`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        dispatch(setFriends(response.data.friends));
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    if (token && friendsList.length === 0) {
      fetchFriends();
    }
  }, [token, friendsList.length, dispatch]);

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
            onKeyDown={(e)=>{
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            className="w-full pl-10 py-2 rounded bg-[#2b2b31] text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-0"
          />
          {/* search btn */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r custom"
            >
              Search
            </button>
          </div>
        </div>

        <ul className="space-y-4">
          {filteredFriends.length > 0 ? filteredFriends.map((friend, index) => (
            <li
              key={friend.id || index}
              className={`flex items-center justify-between bg-[#1a1a1f] p-4 rounded-lg ${!friend?.isFriend ? '' : 'border-2 border-green-500'}`}
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
                <button className={`px-3 py-1 text-sm ${friend?.isFriend ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} rounded-full flex items-center gap-1 cursor-pointer w-16 justify-center`}>
                  {friend?.isFriend ? 'invite' : friend?.requestSent ? 'Sent' : 'Add'}
                </button>
              </div>
            </li>
          ))
          : <div className='text-center'> No friends found.</div>}
        </ul>
      </div>
    </div>
  );
}
