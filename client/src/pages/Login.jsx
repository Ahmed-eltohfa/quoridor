import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => setIsLogin(!isLogin);

  const handleGoogleLogin = () => {
    // integrate with Firebase or OAuth here
    console.log('Google login clicked');
  };

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
              placeholder="Username"
              className="w-full px-4 py-2 rounded bg-[#2b2b31] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded bg-[#2b2b31] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded bg-[#2b2b31] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-btn-primary hover:bg-btn-hover transition-colors py-2 rounded text-white font-medium cursor-pointer"
            onClick={(e) =>{e.preventDefault()}}
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
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white text-black py-2 rounded hover:bg-gray-300 cursor-pointer transition-colors"
        >
          <FcGoogle className="text-xl" />
          Continue with Google
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