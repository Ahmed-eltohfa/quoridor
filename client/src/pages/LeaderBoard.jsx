import { FaCrown, FaMedal } from 'react-icons/fa'

const topPlayers = [
  { name: 'Noah Thompson', elo: 1750, medal: 'gold' },
  { name: 'Olivia Bennett', elo: 1650, medal: 'silver' },
  { name: 'Jackson Lewis', elo: 1600, medal: 'bronze' },
]

const otherPlayers = [
  { name: 'Ethan Carter', elo: 1550 },
  { name: 'Ava Martinez', elo: 1500 },
  { name: 'Liam Harris', elo: 1480 },
  { name: 'Sophia Clark', elo: 1450 },
  { name: 'Isabella Walker', elo: 1420 },
  { name: 'Lucas Hall', elo: 1400 },
  { name: 'Mia Young', elo: 1380 },
]

const medalColor = {
  gold: 'text-yellow-400',
  silver: 'text-gray-300',
  bronze: 'text-orange-400',
}

export default function Leaderboard() {
  return (
    <div className="min-h-screen bg-[#0e0e11] text-white py-12 px-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-10 text-center">Top Quoridor Players by Elo</h1>

      {/* Top 3 podium */}
      <div className="flex justify-center gap-10 mb-12">
        {/* Silver */}
        <div className="flex flex-col items-center">
          <FaMedal className={`text-4xl ${medalColor.silver} mb-2`} />
          <p className="font-semibold">{topPlayers[1].name}</p>
          <p className="text-text-secondary">Elo: {topPlayers[1].elo}</p>
        </div>
        {/* Gold */}
        <div className="flex flex-col items-center">
          <FaCrown className={`text-5xl ${medalColor.gold} mb-2`} />
          <p className="font-bold text-lg">{topPlayers[0].name}</p>
          <p className="text-text-secondary">Elo: {topPlayers[0].elo}</p>
        </div>
        {/* Bronze */}
        <div className="flex flex-col items-center">
          <FaMedal className={`text-4xl ${medalColor.bronze} mb-2`} />
          <p className="font-semibold">{topPlayers[2].name}</p>
          <p className="text-text-secondary">Elo: {topPlayers[2].elo}</p>
        </div>
      </div>

      {/* Other players */}
      <div className="w-full max-w-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-sm text-text-secondary border-b border-gray-700">
              <th className="py-2">Rank</th>
              <th>Player</th>
              <th>Elo</th>
            </tr>
          </thead>
          <tbody>
            {otherPlayers.map((player, index) => (
              <tr key={player.name} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="py-3">{index + 4}</td>
                <td>{player.name}</td>
                <td>{player.elo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
