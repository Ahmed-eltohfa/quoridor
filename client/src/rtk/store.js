import { configureStore } from '@reduxjs/toolkit'
import settingReducer from './slices/settingsSlice.js'
import gameReducer from './slices/gameSlice.js'

export const store = configureStore({
    reducer: {
        settings: settingReducer,
        game: gameReducer,
    }
})