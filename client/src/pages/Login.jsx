import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import avatar1 from '../assets/avatar1.png';
import avatar2 from '../assets/avatar2.png'; 
import avatar3 from '../assets/avatar3.png';
import avatar4 from '../assets/avatar4.png';
import avatar5 from '../assets/avatar5.png';
import avatar6 from '../assets/avatar6.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken } from '../rtk/slices/authSlice';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const avatars = [
        avatar1, avatar2, avatar3, avatar4, avatar5, avatar6
    ];
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'username') setUsername(value);
        else if (name === 'email') setEmail(value);
        else if (name === 'password') setPassword(value);
    };

    const toggleForm = () => setIsLogin(!isLogin);

    const handleGuestLogin = () => {
        const guestSignup = async () => {
            try {
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/auth/guest-register`);
                console.log('Guest registration successful:', response.data);
                //saving the token in localStorage
                if (response.data.success) {
                    dispatch(setToken(response.data.token));
                    navigate('/');
                }else{
                    alert(response.data.message);
                    return;
                }
            } catch (error) {
                console.error('Error during guest registration:', error);
                alert('Guest registration failed. Please try again.');
            }
        }
        guestSignup();
    };

    const handleBtnSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission logic here
        if (isLogin) {
            console.log('Logging in...');
            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }
            const loginUser = async () => {
                try {
                    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/auth/login`, {
                        email,
                        password
                    });
                    console.log('Login successful:', response.data);
                    //saving the token in localStorage
                    if (response.data.success) {
                        dispatch(setToken(response.data.token));
                        navigate('/');
                    }else{
                        alert(response.data.message);
                        return;
                    }
                } catch (error) {
                    console.error('Error during login:', error);
                    alert('Login failed. Please try again.');
                }
            }
            await loginUser();
        } 
        else {
            console.log('Signing up...');
            if (selectedAvatar === null) {
                alert('Please select an avatar');
                return;
            }
            if (!username || !email || !password) {
                alert('Please fill in all fields');
                return;
            }
            // console.log(import.meta.env.VITE_BACKEND_URL);
            const registerUser = async () => {
                try {
                    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/auth/signup`, {
                        username,
                        email,
                        password,
                        avatar: selectedAvatar
                    });
                    console.log('Registration successful:', response.data);
                    //saving the token in localStorage
                    if (response.data.success) {
                        dispatch(setToken(response.data.token));
                        navigate('/');
                    }else{
                        alert(response.data.message);
                        return;
                    }
                } catch (error) {
                    console.error('Error during registration:', error);
                    alert('Registration failed. Please try again.');
                }
            };
            await registerUser();
        }
        // Reset form or redirect after submission
        setSelectedAvatar(null);
        setUsername('');
        setEmail('');
        setPassword('');

        console.log('Form submitted', username, email, password, selectedAvatar);
    }

    return (
        <div className="min-h-screen bg-[#0e0e11] text-white flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md bg-[#1a1a1f] p-8 rounded-lg shadow-xl">
            <h1 className="text-2xl font-bold mb-6 text-center">
            {isLogin ? 'Login to Your Account' : 'Create a New Account'}
            </h1>

            <form className="space-y-4">
                {!isLogin && (
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={handleInputChange}
                        placeholder="Username"
                        className="w-full px-4 py-2 rounded bg-[#2b2b31] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                )}
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="w-full px-4 py-2 rounded bg-[#2b2b31] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={password}
                        onChange={handleInputChange}
                        placeholder="Password"
                        className="w-full px-4 py-2 rounded bg-[#2b2b31] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                        {showPassword ? '🙈' : '👁️'}
                    </button>
                </div>

                {!isLogin && (
                    <div>
                        <p className="text-white mb-2">Choose Your Avatar</p>
                        <div className="grid grid-cols-5 gap-2">
                            {avatars.map((avatar, index) => (
                                <img
                                    key={index}
                                    src={avatar}
                                    alt={`Avatar ${index + 1}`}
                                    onClick={() => setSelectedAvatar(index)}
                                    className={`w-12 h-12 rounded-full cursor-pointer object-cover border-2 transition 
                                        ${selectedAvatar === index ? 'border-blue-500' : 'border-transparent'}
                                        hover:border-blue-300`}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-btn-primary hover:bg-btn-hover transition-colors py-2 rounded text-white font-medium cursor-pointer"
                    onClick={handleBtnSubmit}
                >
                    {isLogin ? 'Login' : 'Sign Up'}
                </button>
            </form>

            <div className="my-6 flex items-center justify-center gap-2 text-gray-400 text-sm">
                <span className="border-b border-gray-600 w-1/5"></span>
                <span>or</span>
                <span className="border-b border-gray-600 w-1/5"></span>
            </div>

            <button
                onClick={handleGuestLogin}
                className="w-full flex items-center justify-center gap-3 bg-btn-secondary text-white py-2 rounded hover:bg-secondary-hover cursor-pointer transition-colors"
            >
                <span className="text-xl">👤</span>
                Continue as Guest
            </button>


            <p className="text-center text-gray-400 text-sm mt-6">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button onClick={toggleForm} className="text-blue-300 hover:underline cursor-pointer">
                {isLogin ? 'Sign Up' : 'Login'}
            </button>
            </p>
        </div>
        </div>
    );
}