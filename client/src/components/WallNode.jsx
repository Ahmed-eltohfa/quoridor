export default function WallNode({ walls }) {
    const num = Object.values(walls).filter(Boolean).length;

    
    return (
        <div className={`relative md:w-4 md:h-4 h-2 w-2 ${num > 1 ? 'bg-amber-600' : ''}`}>
            {walls.up && (
                <div className="absolute top-0 left-1/2 w-1 h-4 md:w-3 md:h-6 bg-yellow-800 -translate-y-full -translate-x-1/2" />
            )}
            {walls.down && (
                <div className="absolute bottom-0 left-1/2 w-1 h-4 md:w-3 md:h-6 bg-blue-800 translate-y-full -translate-x-1/2" />
            )}
            {walls.left && (
                <div className="absolute left-0 top-1/2 h-1 w-4 md:h-3 md:w-6 bg-green-900 -translate-x-full -translate-y-1/2" />
            )}
            {walls.right && (
                <div className="absolute right-0 top-1/2 h-1 w-4 md:h-3 md:w-6 bg-red-700 translate-x-full -translate-y-1/2" />
            )}
        </div>
    );
}