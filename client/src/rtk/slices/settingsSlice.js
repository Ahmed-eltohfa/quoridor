import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    gameMode: '',
}

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        updateMode: (state, action) => {
            state.gameMode = action.payload;
        }
    },
})

export const { updateMode } = settingsSlice.actions
export default settingsSlice.reducer
