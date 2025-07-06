export default function About() {
  return (
    <div className="min-h-screen bg-[#0e0e11] text-white py-12 px-6 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">About Quoridor</h1>

        <p className="text-gray-300 mb-6">
          Quoridor is a modern strategy board game where players race to cross the board while tactically placing walls to block their opponents. It’s a game of logic, foresight, and cunning moves — easy to learn, yet hard to master.
        </p>

        <h2 className="text-2xl font-semibold text-blue-400 mb-2">Why We Built This</h2>
        <p className="text-gray-300 mb-6">
          We wanted to bring the magic of Quoridor to the digital world — making it accessible, fast, and fun for players everywhere. Whether you're competing with friends locally, challenging AI, or testing your skill in online matchups, our platform offers a seamless experience.
        </p>

        <h2 className="text-2xl font-semibold text-blue-400 mb-2">Features</h2>
        <ul className="list-disc list-inside text-gray-300 mb-6 space-y-1">
          <li>Play online against players around the globe</li>
          <li>Challenge smart AI opponents with multiple difficulty levels</li>
          <li>Compete in ranked leaderboards</li>
          <li>Enjoy a sleek and modern user interface</li>
          <li>Learn the game quickly with built-in tutorials</li>
        </ul>

        <h2 className="text-2xl font-semibold text-blue-400 mb-2">Our Vision</h2>
        <p className="text-gray-300">
          Our mission is to make intelligent, strategy-based games more accessible and enjoyable through innovative design and modern technology. We’re committed to continuously improving this experience with feedback from our growing community.
        </p>

        <div className="mt-10 text-sm text-center text-gray-500">
          © {new Date().getFullYear()} Quoridor Game Platform — All rights reserved.
        </div>
      </div>
    </div>
  )
}
