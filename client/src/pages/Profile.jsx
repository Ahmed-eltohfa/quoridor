import { FaEdit, FaTrophy, FaGamepad, FaChartLine, FaUserAlt, FaCalendarAlt } from 'react-icons/fa';

export default function Profile() {
  return (
    <div className="min-h-screen bg-[#0e0e11] text-white py-12 px-6 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col items-center mb-8">
          <img
            src="https://i.pravatar.cc/100?img=11"
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-gray-700 shadow-lg"
          />
          <h2 className="text-2xl font-bold mt-4">Alex Turner</h2>
          <p className="text-gray-400">@alex_turner</p>
          <button className="mt-3 px-4 py-1 rounded-full bg-gray-700 hover:bg-gray-600 text-sm flex items-center gap-2 cursor-pointer">
            <FaEdit /> Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mb-10">
          <div className="bg-btn-secondary hover:bg-secondary-hover rounded-lg p-4 flex flex-col items-center">
            <FaGamepad className="text-xl mb-2 text-blue-400" />
            <div className="text-2xl font-bold">120</div>
            <div className="text-gray-400">Games Played</div>
          </div>
          <div className="bg-btn-secondary hover:bg-secondary-hover rounded-lg p-4 flex flex-col items-center">
            <FaChartLine className="text-xl mb-2 text-green-400" />
            <div className="text-2xl font-bold">60%</div>
            <div className="text-gray-400">Win Rate</div>
          </div>
          <div className="bg-btn-secondary hover:bg-secondary-hover rounded-lg p-4 flex flex-col items-center">
            <FaTrophy className="text-xl mb-2 text-yellow-400" />
            <div className="text-2xl font-bold">40</div>
            <div className="text-gray-400">Achievements</div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Recent Games</h3>
          <div className="w-full overflow-x-auto">
            <table className="w-full table-auto border-collapse text-left text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="p-3">Game</th>
                  <th className="p-3">Opponent</th>
                  <th className="p-3">Result</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { opponent: 'Sophia Clark', result: 'Win', date: '2024-07-26' },
                  { opponent: 'Ethan Bennett', result: 'Loss', date: '2024-07-25' },
                  { opponent: 'Olivia Carter', result: 'Win', date: '2024-07-24' },
                  { opponent: 'Liam Foster', result: 'Loss', date: '2024-07-23' },
                  { opponent: 'Ava Hayes', result: 'Win', date: '2024-07-22' },
                ].map((game, index) => (
                  <tr key={index} className="border-b border-gray-800 hover:bg-[#1c1c22]">
                    <td className="p-3"><span className="inline-flex items-center gap-2"><FaGamepad /> Quoridor</span></td>
                    <td className="p-3 flex items-center gap-2"><FaUserAlt /> {game.opponent}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-xs font-medium ${
                          game.result === 'Win'
                            ? 'bg-green-600'
                            : game.result === 'Loss'
                            ? 'bg-red-600'
                            : 'bg-yellow-600'
                        }`}
                      >
                        {game.result}
                      </span>
                    </td>
                    <td className="p-3 flex items-center gap-2"><FaCalendarAlt /> {game.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
