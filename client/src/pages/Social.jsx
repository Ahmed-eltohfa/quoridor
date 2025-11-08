import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { avatars } from '../utils/avatars';
import axios from 'axios';
import { setFriends, setSearchedUsers } from '../rtk/slices/authSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import NotifyX from "notifyx";
import "notifyx/style.css";

export default function Social() {
  const [search, setSearch] = useState('');
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
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
    const btn = document.querySelector('.custom');
    if (btn) btn.disabled = true;
    setTimeout(() => {
      const b = document.querySelector('.custom');
      if (b) b.disabled = false;
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
      NotifyX.success(`Found ${response.data.users.length} user(s)`);
    } catch (error) {
      NotifyX.error(error?.response?.data?.message || 'Error searching users');
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
        NotifyX.error(error?.response?.data?.message || 'Error fetching friends');
        console.error("Error searching users:", error);
      }
    };

    if (token && friendsList.length === 0) {
      fetchFriends();
    }
  }, [token, friendsList.length, dispatch]);

  const sendFriendRequest = async (targetUserId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}api/players/friends/request`,
        { targetUserId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      NotifyX.success(response.data?.message || 'Friend request sent');
    } catch (error) {
      NotifyX.error(error?.response?.data?.message || 'Error sending friend request');
    }
  };

  const sendInvite = (targetUserId) => {
    // Implement your invite logic here
    NotifyX.info(`Invite sent to user ID: ${targetUserId}`);
    console.debug && console.debug(`Invite sent to user ID: ${targetUserId}`); // optional debug
  }

  // Add this new effect to fetch pending requests
  useEffect(() => {
    const fetchPendingRequests = async () => {
      if (!token) return;
      setLoadingRequests(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}api/players/friends/pending`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        NotifyX.info('Pending requests fetched');
        setPendingRequests(response.data.pendingRequests.incoming || []);
      } catch (error) {
        NotifyX.error(error?.response?.data?.message || 'Error fetching pending requests');
      } finally {
        setLoadingRequests(false);
      }
    };

    fetchPendingRequests();
  }, [token]);

  // Add function to handle request response
  const handleFriendRequest = async (requestId, accept) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}api/players/friends/respond`,
        { requestId, accept },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      NotifyX.success(response.data?.message || (accept ? 'Friend request accepted' : 'Friend request rejected'));
      
      // Remove the request from pending list
      setPendingRequests(prev => prev.filter(req => req.id !== requestId));
      
      // If accepted, refresh friends list
      if (accept) {
        const friendsResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}api/players/friends/list`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        dispatch(setFriends(friendsResponse.data.friends));
      }
    } catch (error) {
      NotifyX.error(error?.response?.data?.message || 'Error responding to friend request');
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e11] text-white py-12 px-6 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-bold mb-8 text-center">Friends</h1>

        {/* Add Friend Requests Section */}
        {pendingRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Friend Requests</h2>
            <div className="space-y-3">
              {loadingRequests ? (
                <LoadingSpinner size="small" text="Loading requests..." />
              ) : (
                pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between bg-[#1a1a1f] p-4 rounded-lg border-l-4 border-yellow-500"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={avatars[request.user.avatar] || avatars[0]}
                        alt={request.user.username}
                        className="w-10 h-10 rounded-full border border-gray-500"
                      />
                      <div>
                        <div className="font-semibold">{request.user.username}</div>
                        <div className="text-sm text-gray-400">
                          Sent {new Date(request.since).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleFriendRequest(request.id, true)}
                        className="px-4 py-1.5 text-sm bg-green-600 hover:bg-green-700 rounded-full"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleFriendRequest(request.id, false)}
                        className="px-4 py-1.5 text-sm bg-red-600 hover:bg-red-700 rounded-full"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Existing Search Bar */}
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

        {/* Existing Friends List */}
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
                {
                  !friend?.isFriend ? (
                    <button
                      className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded-full flex items-center gap-1 cursor-pointer w-16 justify-center"
                      onClick={() => sendFriendRequest(friend.id)}
                    >
                      Add
                    </button>
                  ) : (
                    <button
                      className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded-full flex items-center gap-1 cursor-pointer w-16 justify-center"
                      onClick={() => sendInvite(friend.id)}
                    >
                      invite
                    </button>
                  )
                }
              </div>
            </li>
          ))
          : <div className='text-center'> No friends found.</div>}
        </ul>
      </div>
    </div>
  );
}
