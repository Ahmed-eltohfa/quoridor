import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import Nav from './components/Nav';
import './App.css'
import Home from './pages/Home.jsx';
import About from './pages/About';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Social from './pages/Social';
import Rules from './pages/Rules';
import Profile from './pages/Profile';
import Waiting from './pages/Waiting';
import Settings from './pages/Settings';
import LeaderBoard from './pages/LeaderBoard';
import Game from './pages/Game';
import Footer from './components/Footer.jsx';
import Play from './pages/Play.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import { setToken, setUser } from './rtk/slices/authSlice.js';
import axios from 'axios';
import UserProfile from './pages/UserProfile.jsx';
import { setAuthToken } from './utils/socket.js';
import { Confirm } from "notiflix/build/notiflix-confirm-aio";

// new repo
function App() {

  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!token) return;

    const getUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const userData = response.data.user;
        dispatch(setUser(userData));
        localStorage.setItem("user", JSON.stringify(userData));
        console.log("User data fetched successfully:", userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    
    getUser();
    setAuthToken(token);
  }, [token, dispatch]); // Only run when token changes

  useEffect(() =>{
    Confirm.init({
      backgroundColor: "#1c1c1c",
      borderRadius: "16px",
      titleColor: "#fff",
      messageColor: "#d1d1d1",
      okButtonBackground: "#22c55e",
      cancelButtonBackground: "#ef4444",
      okButtonColor: "#fff",
      cancelButtonColor: "#fff",
      width: "300px",
    });
  })

  return (
    <>
    <Nav />
    <div className='contain mx-2 md:mx-4 lg:mx-8 xl:mx-10 mt-16 pt-1'>
      <ScrollToTop />
      <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<Login />} />
          <Route path="/social" element={<Social />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/waiting" element={<Waiting />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/leaderboard" element={<LeaderBoard />} />
          <Route path="/game" element={<Game />} />
          <Route path="/play" element={<Play />} />
          <Route path='/user/:id' element={<UserProfile/>} />
          <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
    <Footer />
    </>
  )
}

export default App
