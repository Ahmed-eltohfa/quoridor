import { configureStore } from '@reduxjs/toolkit'
import settingReducer from './slices/settingsSlice.js'

export const store = configureStore({
    reducer: {
        settings: settingReducer,
    },
})