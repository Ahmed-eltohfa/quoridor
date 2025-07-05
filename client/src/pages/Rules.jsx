export default function Rules() {
  return (
    <div className="min-h-screen bg-[#0e0e11] text-white px-6 py-10 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Game Rules</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-blue-400">Objective</h2>
          <p className="text-gray-300">
            The goal of Quoridor is to move your pawn from your starting position to the opposite side of the board before your opponent does.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-blue-400">Setup</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li>Each player begins with a pawn placed in the center of their starting row.</li>
            <li>Each player also has a set number of walls.</li>
            <li>The board is a 9x9 grid by default, but may vary by game mode.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-blue-400">Gameplay</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li>Players take turns moving their pawn one square horizontally or vertically.</li>
            <li>Instead of moving, a player can place a wall to block their opponent.</li>
            <li>Walls must be placed between squares and cannot completely block a player’s path to the goal.</li>
            <li>You must always leave at least one possible path for each player to win.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-blue-400">Winning</h2>
          <p className="text-gray-300">
            The first player to reach the opposite side of the board wins the game.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-blue-400">Additional Rules</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li>You cannot jump over walls.</li>
            <li>You may jump over an adjacent pawn if there’s no wall behind it.</li>
            <li>Walls cannot overlap or cross existing walls.</li>
          </ul>
        </section>

        <div className="mt-10 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Quoridor Game — All rules are based on the official game guidelines.
        </div>
      </div>
    </div>
  )
}
