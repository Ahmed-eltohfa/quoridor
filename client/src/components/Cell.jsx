export default function Cell({ player,offset,size }) {
    return (
        <div
        className={`w-8 h-8 md:w-12 md:h-12 bg-cover border border-[#61411e] relative flex items-center justify-center cell_background ml-2 md:ml-4 ${offset === 0 ? 'ml-2 md:ml-4' : ''} cell-shadow`}
        >
        {player === '1' && (
            <div className="w-6 h-6 bg-green-600 rounded-full shadow-inner" />
        )}
        {player === '2' && (
            <div className="w-6 h-6 bg-yellow-400 rounded-full shadow-inner" />
        )}
        </div>
    );
}
