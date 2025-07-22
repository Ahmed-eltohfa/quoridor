import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    validMoves: [],
}

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        updateValidMoves: (state, action) => {
            state.validMoves = action.payload; // Update the valid moves with the payload
        }
    },
})

export const { updateValidMoves } = gameSlice.actions
export default gameSlice.reducer
