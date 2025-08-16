import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    gameMode: '',
    playerNumifOnline: 0, // 0 for offline, 1 for player 1, 2 for player 2
}

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        updateMode: (state, action) => {
            state.gameMode = action.payload;
        },
        updatePlayerNum: (state, action) => {
            state.playerNumifOnline = action.payload;
        }
    },
})

export const { updateMode, updatePlayerNum } = settingsSlice.actions
export default settingsSlice.reducer
