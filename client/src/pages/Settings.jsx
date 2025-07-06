import { useState } from 'react';
import { FaUser, FaLock, FaPalette, FaBell, FaCogs } from 'react-icons/fa';

export default function Settings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [moveConfirm, setMoveConfirm] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [gameSpeed, setGameSpeed] = useState('Normal');
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('English');

  return (
    <div className="min-h-screen bg-[#0e0e11] text-white py-12 px-6 flex flex-col items-center">
      <div className="max-w-xl w-full">
        <h1 className="text-3xl font-bold mb-8 text-center">Settings</h1>

        {/* Account Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaUser /> Account
          </h2>
          <div className="space-y-4">
            <input type="text" placeholder="Display Name" className="w-full px-4 py-2 rounded bg-[#2b2b31] text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="email" placeholder="Email Address" className="w-full px-4 py-2 rounded bg-[#2b2b31] text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        {/* Password Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaLock /> Change Password
          </h2>
          <div className="space-y-4">
            <input type="password" placeholder="Current Password" className="w-full px-4 py-2 rounded bg-[#2b2b31] text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="password" placeholder="New Password" className="w-full px-4 py-2 rounded bg-[#2b2b31] text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        {/* Game Preferences */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaCogs /> Game Preferences
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-[#2b2b31] p-4 rounded">
              <span>Move Confirmation</span>
              <input type="checkbox" checked={moveConfirm} onChange={() => setMoveConfirm(!moveConfirm)} className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between bg-[#2b2b31] p-4 rounded">
              <span>Sound Effects</span>
              <input type="checkbox" checked={soundEffects} onChange={() => setSoundEffects(!soundEffects)} className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between bg-[#2b2b31] p-4 rounded">
              <span>Game Speed</span>
              <span className="text-sm text-gray-400">{gameSpeed}</span>
            </div>
          </div>
        </div>

        {/* App Settings */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaBell /> App Settings
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-[#2b2b31] p-4 rounded">
              <span>Notifications</span>
              <input type="checkbox" checked={notificationsEnabled} onChange={() => setNotificationsEnabled(!notificationsEnabled)} className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between bg-[#2b2b31] p-4 rounded">
              <span>Privacy Mode</span>
              <input type="checkbox" checked={privacyMode} onChange={() => setPrivacyMode(!privacyMode)} className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between bg-[#2b2b31] p-4 rounded">
              <span>Language</span>
              <span className="text-sm bg-gray-700 px-3 py-1 rounded-full">{language}</span>
            </div>
          </div>
        </div>

        <button className="w-full bg-btn-primary hover:bg-btn-hover transition-colors py-2 rounded text-white font-medium mt-6 cursor-pointer">
          Save Changes
        </button>
      </div>
    </div>
  );
}
