import { FaEnvelope, FaGithub, FaShieldAlt, FaFileContract, FaHome, FaUser, FaTrophy, FaBook } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#0e0e11] text-gray-400 mt-16 border-t border-gray-800 px-6 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">

        {/* Logo & About */}
        <div>
          <h2 className="text-white text-xl font-semibold mb-2">Quoridor</h2>
          <p className="text-gray-500">
            A strategy board game where every move counts. Outmaneuver your opponents, place walls, and reach the goal first.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-2">
          <h3 className="text-white font-medium mb-2">Navigation</h3>
          <a href="/" className="flex items-center gap-2 hover:text-white transition">
            <FaHome /> Home
          </a>
          <a href="/rules" className="flex items-center gap-2 hover:text-white transition">
            <FaBook /> Rules
          </a>
          <a href="/leaderboard" className="flex items-center gap-2 hover:text-white transition">
            <FaTrophy /> Leaderboard
          </a>
          <a href="/profile" className="flex items-center gap-2 hover:text-white transition">
            <FaUser /> Profile
          </a>
        </div>

        {/* Contact & Social */}
        <div className="flex flex-col gap-2">
          <h3 className="text-white font-medium mb-2">Connect</h3>
          <a href="mailto:eltohfa01@gmail.com" className="flex items-center gap-2 hover:text-white transition">
            <FaEnvelope /> Contact Support
          </a>
          <a href="https://github.com/Ahmed-eltohfa" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition">
            <FaGithub /> GitHub
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-white transition">
            <FaShieldAlt /> Privacy Policy
          </a>
          <a href="/about" className="flex items-center gap-2 hover:text-white transition">
            <FaFileContract /> About
          </a>
        </div>

      </div>

      {/* Bottom line */}
      <div className="mt-10 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} Quoridor App. All rights reserved.
      </div>
    </footer>
  );
}
