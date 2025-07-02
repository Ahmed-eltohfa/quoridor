import { useState } from 'react'
import { Route, Routes } from 'react-router-dom';
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

function App() {

  return (
    <>
    <Nav />
    <div className='contain mx-2 md:mx-4 lg:mx-10 xl:mx-12 mt-16 pt-1'>
      <h1>hello</h1>
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
          <Route element={<NotFound />} />
      </Routes>
    </div>
    </>
  )
}

export default App
