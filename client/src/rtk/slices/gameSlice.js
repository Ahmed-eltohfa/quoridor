import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    validMoves: [],
    validWalls: [],
    removeClass: false,
    gameInfo: {
        p1: { name: 'Player 1', nWalls: 10, avatar: 1 }, // Example player 1 info
        p2: { name: 'Player 2', nWalls: 10, avatar: 1, difficulty: 4 }, // Example player 2 info
        boardSize: 9,
    },
}

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        updateValidMoves: (state, action) => {
            state.validMoves = action.payload; // Update the valid moves with the payload
        },
        updateValidWalls: (state, action) => {
            state.validWalls = action.payload; // Update the valid walls with the payload
        },
        trigger: (state) => {
            state.removeClass = !state.removeClass; // Toggle the removeClass state
        },
        updateGameInfo: (state, action) => {
            state.gameInfo = action.payload; // Update the game information with the payload
        },
    },
})

export const { updateValidMoves, updateValidWalls, trigger, updateGameInfo } = gameSlice.actions
export default gameSlice.reducer
