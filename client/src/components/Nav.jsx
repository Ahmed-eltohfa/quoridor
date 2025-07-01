import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo2.png';
import profilePic from '../assets/avatars.png';
import { FaHome, FaGamepad, FaTrophy, FaUserFriends, FaCog, FaUser, FaBars } from 'react-icons/fa';

const Navbar = () => {
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const navItems = [
        { path: '/', name: 'Home', icon: <FaHome className="text-lg" /> },
        { path: '/game', name: 'Game', icon: <FaGamepad className="text-lg" /> },
        { path: '/leaderboard', name: 'Leaderboard', icon: <FaTrophy className="text-lg" /> },
        { path: '/friends', name: 'Friends', icon: <FaUserFriends className="text-lg" /> },
        { path: '/settings', name: 'Settings', icon: <FaCog className="text-lg" /> },
    ];

    return (
        <nav className="fixed top-0 bottom-auto h-16 w-full z-50 bg-bg-main border-b border-gray-300 shadow-md flex items-center justify-between px-4">
        {/* Left: Logo */}
        <div className="flex w-[190px] overflow-hidden max-h-full p-3 items-center">
            {/* Mobile Burger Icon */}
            <div className="md:hidden order-0">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-300 hover:text-white text-xl">
            <FaBars />
            </button>
            </div>
            <img
            src={logo}
            alt="Quoridor"
            className="w-full object-cover"
            />
        </div>


        {/* Desktop Nav Links */}
        <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
            <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center p-1.5 md:flex-row md:p-2 md:space-x-2 transition-colors ${
                location.pathname === item.path
                    ? 'text-blue-500 border-b-2 border-blue-500'
                    : 'text-gray-300 hover:text-blue-400'
                }`}
            >
                {item.icon}
                <span>{item.name}</span>
            </Link>
            ))}
        </div>

        {/* Right: Profile Picture (Desktop) */}
        <div className={`flex items-center`}>
            <img
            src={profilePic}
            alt="Profile"
            className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-500"
            />
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
            <div className="absolute bottom-16 left-0 w-full bg-bg-main border-t border-gray-700 shadow-lg md:hidden flex flex-col items-start px-4 py-2 space-y-2">
            {navItems.map((item) => (
                <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center space-x-2 text-sm w-full ${
                    location.pathname === item.path
                    ? 'text-blue-500'
                    : 'text-gray-300 hover:text-blue-400'
                }`}
                >
                {item.icon}
                <span>{item.name}</span>
                </Link>
            ))}
            </div>
        )}
        </nav>
    );
};

export default Navbar;
