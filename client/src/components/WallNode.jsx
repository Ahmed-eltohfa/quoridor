export default function WallNode({ walls }) {
    // const num = Object.values(walls).filter(Boolean).length;
    function getWallSymbol(wall) {
        const { up, down, left, right } = wall;
        if (up && down && left && right) return 'c'; // center ┼
        else if (up && down && left) return 'r';     // ┤
        else if (up && down && right) return 'l';    // ├
        else if (left && right && up) return 'b';    // ┴
        else if (left && right && down) return 't';  // ┬
        else if (left && right) return 'h';          // ─
        else if (up && down) return 'v';             // │
        else if (up && left) return 'dr';            // ┘
        else if (up && right) return 'dl';           // └
        else if (down && right) return 'ul';         // ┌
        else if (down && left) return 'ur';          // ┐
        else if (up) return 'd';                     // ╵
        else if (down) return 'u';                   // ╷
        else if (left) return 'r0';                  // ╴
        else if (right) return 'l0';                 // ╶
        else return '.';                             // Empty
    }
    
    
    return (
        <div className={`md:w-4 md:h-4 h-1 w-1 wall wall-${getWallSymbol(walls)}`}></div>
    );
}