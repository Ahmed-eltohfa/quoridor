import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    validMoves: [],
    validWalls: [],
    removeClass: false,
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
        }
    },
})

export const { updateValidMoves, updateValidWalls, trigger } = gameSlice.actions
export default gameSlice.reducer
