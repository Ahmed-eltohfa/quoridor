import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';
import NotFoundImg from '../assets/404.png'; // Replace with correct image path

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0e0e11] text-white flex flex-col items-center px-4 text-center">
      <img
        src={NotFoundImg}
        alt="404 Pawn Alone"
        className="w-128 h-auto mb-6 rounded shadow-lg"
      />
      <FaExclamationTriangle className="text-red-500 text-4xl mb-4" />
      <h1 className="text-3xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="text-gray-400 mb-6">
        Looks like this pawn got lost on the board. Let's get you back home.
      </p>
      <Link
        to="/"
        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full text-white font-medium transition-colors"
      >
        Go Back Home
      </Link>
    </div>
  );
}
