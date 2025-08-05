import { useDispatch, useSelector } from "react-redux";
import { trigger, updateValidMoves, updateValidWalls } from "../rtk/slices/gameSlice";
import { useEffect } from "react";

export default function WallNode({ walls, position, size, game, triggerRender }) {

    const validWalls = useSelector((state) => state.game);
    const triggerd = useSelector((state) => state.game.removeClass);
    const gameMode = useSelector((state) => state.settings.gameMode);
    const dispatch = useDispatch();

    useEffect(()=>{        
        document.querySelector('.wall-clicked')?.classList.remove('wall-clicked');
    },[triggerd]);
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
    
    const handelClick = async (e) => {
        dispatch(updateValidMoves([]));
        await dispatch(trigger());
        // console.log(e.target.parentNode)
        if (e.target.classList.contains('wall-clicked')) {
            e.target.classList.remove('wall-clicked');
            dispatch(updateValidWalls([]));
            triggerRender();
            return;
        }else if (e.target.classList.contains('wall-hoverd')) {
                validWalls.validWalls.forEach((wall) => {
                    if (wall.position[0] === i && wall.position[1] === j) {
                        game.current.move(String(wall.move));
                        // console.log(gameMode);
                        dispatch(updateValidWalls([]));
                        triggerRender();
                        
                        if (gameMode === 'ai' && !game.current.isP1Turn) {
                            console.log('AI Move');
                            console.log(game.current.move(String(game.current.p2.smartMove(game.current))));
                            dispatch(updateValidWalls([]));
                            triggerRender();
                        }

                        return;
                    }
                }
            )
            document.querySelector('.wall-clicked')?.classList.remove('wall-clicked');
            return;
        }
        // document.querySelector('.wall-clicked')?.classList.remove('wall-clicked');
        e.target.classList.add('wall-clicked');
        console.log(game);
        console.log(i , j);
        let elementWithDAndF = [];
        if (game.current.isP1Turn) {
            elementWithDAndF = game.current.p1.getValidMoves(game.current,size*3).filter(element => {
                    return element.includes(String.fromCharCode(97 + size - i)) || element.includes(String.fromCharCode(97 + j));
                }
            );
        } else{
            elementWithDAndF = game.current.p2.getValidMoves(game.current,size*3).filter(element => {
                    return element.includes(String.fromCharCode(97 + size - i)) || element.includes(String.fromCharCode(97 + j));
                }
            );
        }
        // console.log('elementWithDAndF', elementWithDAndF);
        const aroundAvilableWalls = elementWithDAndF.map((element) =>{
            const move = element.split('_')[1].split('-');
            const [ from, to ] = move;
            
            if (from.length === 1 && Math.abs(j - from[0].charCodeAt(0)+97) === 0 && to.includes(String.fromCharCode(97 + size - i))) {
                // console.log(Math.abs(j - from[0].charCodeAt(0)));
                // console.log('test keda', element);
                if (to[0] === String.fromCharCode(97 + size - i)) {
                    return {position: [i - 2, j], move: element};
                }else{
                    return {position: [i + 2, j], move: element};
                }
            }
            
            if (to.length === 1 && Math.abs(97 - to[0].charCodeAt(0) + size - i) === 0 && from.includes(String.fromCharCode(97 + j))) {
                // console.log(Math.abs(j - to[0].charCodeAt(0)));
                // console.log('Tp test keda', element);
                if (from[0] === String.fromCharCode(97 + j)) {
                    return {position: [i, j + 2], move: element};
                }else{
                    return {position: [i, j - 2], move: element};
                }
            }
        }).filter(Boolean);

        console.log('aroundAvilableWalls', aroundAvilableWalls);
        aroundAvilableWalls.wallClicked = {i,j};
        dispatch(updateValidWalls(aroundAvilableWalls));
        triggerRender();
    }
    const isInAroundValidWalls = validWalls.validWalls.some(
        (wall) => wall.position[0] === i && wall.position[1] === j
    );
    return (
        <div 
            className={`xl:w-4 xl:h-4 md:w-2 ${i}-${j} md:h-2 h-1 w-1 wall ${num>0 ? 'wall-put':''} relative wall-${getWallSymbol(walls)}`}
            onClick={(e)=>{ handelClick(e) }}
        >
            <span
            className={` relative ${i === 0 ? 'wall-htext' : ''} ${j === size ? 'wall-vtext' : ''} text-xs md:text-sm xl:text-base text-white`}
            data-uletter = {String.fromCharCode(97 + j)} // Convert to letter (1 -> a, 2 -> b, etc.)
            data-rletter = {String.fromCharCode(97 + size - i)} // Convert to letter in reverse rational to size
            >
            </span>
            <span className={`absolute w-full h-full ${isInAroundValidWalls ? 'wall-hoverd' : ''}`} >
            </span>
            <span className="absolute">

            </span>
        </div>
    );
}