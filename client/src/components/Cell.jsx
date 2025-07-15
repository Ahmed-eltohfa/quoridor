export default function Cell({ player,offset,size }) {
    return (
        <div
        className={`w-8 h-8 md:w-12 md:h-12 bg-cover border border-[#61411e] relative flex items-center justify-center cell_background ml-2 md:ml-4 ${offset === 0 ? 'ml-2 md:ml-4' : ''} cell-shadow`}
        >
        {player === '1' && <div className="pawn pawn-green" />}
        {player === '2' && <div className="pawn pawn-orange" />}
        </div>
    );
}
