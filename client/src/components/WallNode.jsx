export default function WallNode({ walls }) {
    const num = Object.values(walls).filter(Boolean).length;
    console.log(num);
    
    return (
        <div className="relative w-4 h-4">
            {walls.up && (
                <div className="absolute top-0 left-1/2 w-1 h-8 bg-yellow-800 -translate-y-full" />
            )}
            {walls.down && (
                <div className="absolute bottom-0 left-1/2 w-1 h-8 bg-blue-800 translate-y-full" />
            )}
            {walls.left && (
                <div className="absolute left-0 top-1/2 h-1 w-8 bg-green-900 -translate-x-full" />
            )}
            {walls.right && (
                <div className="absolute right-0 top-1/2 h-1 w-8 bg-red-700 translate-x-full" />
            )}
        </div>
    );
}