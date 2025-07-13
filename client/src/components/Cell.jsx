export default function Cell({ player,offset,size }) {
    return (
        <div
        className={`w-16 h-16 bg-cover border border-[#c49b6c] relative flex items-center justify-center cell_background ml-4 ${offset === 0 ? 'ml-4' : ''}`}
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
