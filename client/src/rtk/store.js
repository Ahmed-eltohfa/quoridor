import { configureStore } from '@reduxjs/toolkit'
import settingReducer from './slices/settingsSlice.js'
import gameReducer from './slices/gameSlice.js'
import authReducer from './slices/authSlice.js'

export const store = configureStore({
    reducer: {
        settings: settingReducer,
        game: gameReducer,
        auth: authReducer
    }
})