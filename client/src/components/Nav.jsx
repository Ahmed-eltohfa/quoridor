import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaGamepad, FaTrophy, FaUserFriends, FaCog } from 'react-icons/fa';

const Navbar = () => {
const location = useLocation();

  // Define navigation items
const navItems = [
    { path: '/', name: 'Home', icon: <FaHome className="text-lg" /> },
    { path: '/game', name: 'Game', icon: <FaGamepad className="text-lg" /> },
    { path: '/leaderboard', name: 'Leaderboard', icon: <FaTrophy className="text-lg" /> },
    { path: '/friends', name: 'Friends', icon: <FaUserFriends className="text-lg" /> },
    { path: '/settings', name: 'Settings', icon: <FaCog className="text-lg" /> },
];

return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 md:relative md:border-t-0">
        <div className="hidden md:flex items-center mr-8">
            <img src="/logo.png" alt="Quoridor" className="h-8" />
        </div>
        <div className="flex justify-around md:justify-start md:space-x-6 md:px-6">
        {navItems.map((item) => (
            <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center p-3 md:flex-row md:p-4 md:space-x-2 transition-colors ${
            location.pathname === item.path
                ? 'text-blue-600 bg-blue-50 md:bg-transparent md:border-b-2 md:border-blue-600'
                : 'text-gray-500 hover:text-blue-500 hover:bg-gray-50'
            }`}
            >
            {item.icon}
            <span className="text-xs mt-1 md:text-sm md:mt-0">{item.name}</span>
            </Link>
        ))}
        </div>
    </nav>
);
};

export default Navbar;