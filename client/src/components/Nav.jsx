import { useState,useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo2.png';
import profilePic from '../assets/avatars.png';
import { FaHome, FaGamepad, FaTrophy, FaUserFriends, FaCog, FaUser, FaBars } from 'react-icons/fa';

const Navbar = () => {
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef();
    const navigate = useNavigate();

    const handelProfileClick = () => {
        navigate('/profile');
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
            setMenuOpen(false);
            }
        }
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuOpen]);

    useEffect(() => {
    if (menuOpen) {
        document.body.classList.add('overflow-hidden');
        } else {
        document.body.classList.remove('overflow-hidden');
        }

        return () => {
        document.body.classList.remove('overflow-hidden');
    };
    }, [menuOpen]);

    const navItems = [
        { path: '/', name: 'Home', icon: <FaHome className="text-lg" /> },
        { path: '/game', name: 'Game', icon: <FaGamepad className="text-lg" /> },
        { path: '/leaderboard', name: 'Leaderboard', icon: <FaTrophy className="text-lg" /> },
        { path: '/social', name: 'Friends', icon: <FaUserFriends className="text-lg" /> },
        { path: '/settings', name: 'Settings', icon: <FaCog className="text-lg" /> },
    ];

    return (
        <>
        <nav className="fixed top-0 bottom-auto h-16 w-full z-50 bg-bg-main border-b border-gray-300 shadow-md flex items-center justify-between px-4 max-w-full overflow-hidden">
        {/* Left: Logo */}
        <div className="flex w-[190px] overflow-hidden max-h-full py-0 items-center">
            {/* Mobile Burger Icon */}
            <div className="md:hidden order-0 flex items-center cursor-pointer">
                <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-300 hover:text-white text-xl cursor-pointer">
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
        <div className="hidden md:flex space-x-6 lg:-translate-x-[5%]">
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
        <div className={`flex items-center cursor-pointer`} onClick={()=>{handelProfileClick()}}>
            <img
            src={profilePic}
            alt="Profile"
            className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-500"
            />
        </div>

        </nav>
        {/* Mobile Dropdown Menu */}
        { (
            <div className={`fixed bg-gray-900 space-y-10 border-gray-700 shadow-lg flex flex-col items-center py-2 h-full justify-start left-0 top-0 ${menuOpen ? 'w-5/6 py-10 px-3' : 'w-0'} transition-all bg-gray-300 overflow-hidden z-[1000] gap-0`} ref={menuRef} > 
            {navItems.map((item,index) => (
                <>
                <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center space-x-2 text-sm w-full py-10 px-2 m-0 ${
                    location.pathname === item.path
                    ? 'text-blue-500'
                    : 'text-gray-300 hover:text-blue-400'
                }`}
                >
                {item.icon}
                <span>{item.name}</span>
                </Link>
                {index !== navItems.length - 1 && (
                    <hr className="border-t border-gray-400 w-full m-0" />
                )}
                </>
            ))}
            </div>
        )}
        </>
    );
};

export default Navbar;
