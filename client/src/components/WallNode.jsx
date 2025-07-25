import { useDispatch, useSelector } from "react-redux";
import { updateValidMoves } from "../rtk/slices/gameSlice";

export default function WallNode({ walls, position, size, game }) {

    const validWalls = useSelector((state) => state.game.validWalls);
    const dispatch = useDispatch();

    // console.log('validWalls',validWalls);
    const num = Object.values(walls).filter(Boolean).length;
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
    const {i, j} = position;
    let classname = '';
    if (i === 0 && j === 9) {
        classname = 'wall-top wall-right';
    }else if (j === 9){
        classname = 'wall-right';
    }else if (i === 0){
        classname = 'wall-top';
    }
    
    const handelClick = (e) => {
        e.target.classList.add('wall-clicked');
        console.log(game);
        console.log(i , j);
        // game.current.p1.getValidMoves(game.current) // FUCKING FUNCTION DOESN'T WORKKKKKKK
        const elementWithDAndF = game.current.p1.getValidMoves(game.current,size*3).filter(element => {
            // console.log(String.fromCharCode(97+size-i), String.fromCharCode(97+j));
            // console.log(element);
            return element.includes(String.fromCharCode(97 + size - i)) || element.includes(String.fromCharCode(97 + j));
        }
        );
        console.log('elementWithDAndF', elementWithDAndF);
        const aroundAvilableWalls = elementWithDAndF.map((element) =>{
            const move = element.split('_')[1].split('-');
            const [ from, to ] = move;
            // console.log(from, to);
            
            
            if (from.length === 1 && Math.abs(j - from[0].charCodeAt(0)+97) === 0 && to.includes(String.fromCharCode(97 + size - i))) {
                console.log(Math.abs(j - from[0].charCodeAt(0)));
                console.log('test keda', element);
                if (to[0] === String.fromCharCode(97 + size - i)) {
                    return [i + 2, j];
                }else{
                    return [i - 2, j];
                }
            }
            // else if (to.length === 1 && Math.abs(j - to[0].charCodeAt(0)+97) === 0) {
            //     console.log(Math.abs(j - to[0].charCodeAt(0)));
            //     console.log('Tp test keda', element);
                
            // }
        }).filter(Boolean); // --------------------------------------------------Continue Twomorow 
        console.log('aroundAvilableWalls', aroundAvilableWalls);
        
        dispatch(updateValidMoves(aroundAvilableWalls));
    }

    return (
        <div 
            className={`xl:w-4 xl:h-4 md:w-2 ${position.i}-${position.j} md:h-2 h-1 w-1 wall ${num>0 ? 'wall-put':''} relative wall-${getWallSymbol(walls)}`}
            onClick={(e)=>{ handelClick(e) }}
        >
            <span
            className={` relative ${i === 0 ? 'wall-htext' : ''} ${j === 9 ? 'wall-vtext' : ''} text-xs md:text-sm xl:text-base text-white`}
            data-uletter = {String.fromCharCode(97 + j)} // Convert to letter (1 -> a, 2 -> b, etc.)
            data-rletter = {String.fromCharCode(97 + size - i)} // Convert to letter in reverse rational to size
            >
            </span>
        </div>
    );
}