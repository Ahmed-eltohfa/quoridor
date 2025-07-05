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

function App() {

  return (
    <>
    <Nav />
    <div className='contain mx-2 md:mx-4 lg:mx-8 xl:mx-10 mt-16 pt-1'>
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
          <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
    <Footer />
    </>
  )
}

export default App
