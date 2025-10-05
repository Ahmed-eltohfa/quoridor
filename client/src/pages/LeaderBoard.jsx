import { FaCrown, FaMedal } from "react-icons/fa";
import { useEffect, useState } from "react";

const medalColor = {
  gold: "text-yellow-400",
  silver: "text-gray-300",
  bronze: "text-orange-400",
};

export default function Leaderboard() {
  const [topPlayers, setTopPlayers] = useState([]);
  const [otherPlayers, setOtherPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboardData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}api/players/leaderboard`
      );
      const result = await response.json();

      if (result.success && Array.isArray(result.leaderboard)) {
        const data = result.leaderboard;

        // split into top 3 and rest
        setTopPlayers(data.slice(0, 3));
        setOtherPlayers(data.slice(3, 10));
      } else {
        console.error("Invalid leaderboard response:", result);
      }
    } catch (e) {
      console.error("Failed to fetch leaderboard data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e0e11] text-white flex items-center justify-center">
        <p>Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0e11] text-white py-12 px-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-10 text-center">
        Top Quoridor Players by Elo
      </h1>

      {/* 🏆 Top 3 Players */}
      {/* 🏆 Top 3 Players */}
<div className="flex justify-center items-end gap-8 mb-12 flex-wrap">
  {(() => {
    // Arrange them: bronze (2nd index), gold (0th), silver (1st)
    const ordered = [topPlayers[2], topPlayers[0], topPlayers[1]];
    const medals = ["bronze", "gold", "silver"];

    return ordered.map((player, index) => {
      if (!player) return null;
      const medal = medals[index];
      const isGold = medal === "gold";

      return (
        <div
          key={player.username}
          className={`bg-[#1b1b21] rounded-2xl shadow-lg p-6 flex flex-col items-center w-56 transition-transform duration-300 ${
            isGold ? "scale-110 -translate-y-4" : ""
          }`}
        >
                  {isGold ? (
                    <FaCrown className={`text-5xl ${medalColor[medal]} mb-4`} />
                  ) : (
                    <FaMedal className={`text-4xl ${medalColor[medal]} mb-4`} />
                  )}
                  <h2 className="text-xl font-semibold">{player.username}</h2>
                  <p className="text-sm text-gray-400 mb-2">Elo: {player.rank}</p>
                  <p className="text-sm text-gray-400">
                    {player.wins}W / {player.totalGames}G
                  </p>
                </div>
              );
            });
          })()}
        </div>


      {/* 🧍 Other Players */}
      <div className="w-full max-w-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-sm text-text-secondary border-b border-gray-700">
              <th className="py-2">Rank</th>
              <th>Player</th>
              <th>Elo</th>
              <th>Wins / Games</th>
            </tr>
          </thead>
          <tbody>
            {otherPlayers.map((player, index) => (
              <tr
                key={player.username}
                className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
              >
                <td className="p-3">{index + 4}</td>
                <td className="font-medium">{player.username}</td>
                <td>{player.rank}</td>
                <td className="text-gray-400">
                  {player.wins}W / {player.totalGames}G
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
