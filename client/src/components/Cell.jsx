import { useDispatch, useSelector } from 'react-redux';
import { updateValidMoves } from "../rtk/slices/gameSlice";

export default function Cell({ player, offset, size, game, position,triggerRender }) {
    
    const gamedata = useSelector((state) => state.game.validMoves);
    const dispatch = useDispatch();

    let validMoves = [];
    const cell = [size - position.i, position.j + 1];
    const getMoves = () => {
        // console.log(size - position.i,position.j+1);
        if (game.current.isP1Turn && player === '1' || !game.current.isP1Turn && player === '2') {
            // console.log('turno');
            if (player == "1") {
                validMoves = game.current.p1.getValidMoves(game.current).filter(move => move[0] === 'p');
            }else if (player == "2"){
                validMoves = game.current.p2.getValidMoves(game.current).filter(move => move[0] === 'p');
            }
            validMoves = validMoves.map(move=>{ // px_y-z to [y,z]
                const [type, coords] = move.split('_');
                const [y, z] = coords.split('-').map(Number);
                return [y, z]; // Convert to board coordinates
            })
            dispatch(updateValidMoves(validMoves));
        } else {
            dispatch(updateValidMoves([]));
            // console.log("Not your turn");
        }
        // console.log(gamedata,cell);
        triggerRender()
    }
    const isValid = gamedata.some(
        ([x, y]) => x === cell[0] && y === cell[1]
    );
    const makeMove = () =>{
        let turn=0;
        if (game.current.isP1Turn) {
            turn = 1;
        }else{
            turn = 2;
        }
        const moveStr = `p${turn}_${cell[0]}-${cell[1]}`;
        console.log('movestr',moveStr);
        
        // game.current.move(moveStr);
        console.log(game.current.move(String(moveStr)));
        
        dispatch(updateValidMoves([]));
        triggerRender();
    }
    
    return (
        <div
        className={`w-8 h-8 md:w-10 md:h-10 xl:w-12 xl:h-12 bg-cover border border-[#61411e] relative flex items-center justify-center cell_background ml-1 md:ml-2 xl:ml-4 cell-shadow ${cell[0] === 1 ? 'cellh' : ''} ${cell[1] === 1 ? 'cellv' : ''}`}
        data-number = {cell[1]}
        data-letter = {cell[0]} // Convert to letter (1 -> a, 2 -> b, etc.)
        onClick={getMoves}
        >
            {player === '1' && <div className="pawn pawn-green cursor-pointer" />}
            {player === '2' && <div className="pawn pawn-orange cursor-pointer" />}
            {isValid && (
                <div className="w-full h-full grid place-items-center cursor-pointer" onClick={makeMove}>
                    <div className='bg-green-500 opacity-60 rounded-full w-2/5 h-2/5'></div>
                </div>
            )}
        </div>
    );
}
