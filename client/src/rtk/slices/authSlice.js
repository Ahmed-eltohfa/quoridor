// authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem("token") || null,
    user: localStorage.getItem("user") || null, // you can preload this too if stored
    friends: []
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
            localStorage.setItem("token", action.payload);
        },
        clearToken: (state) => {
            state.token = null;
            localStorage.removeItem("token");
        },
        setUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
        },
        setFriends: (state, action) => {
            state.friends = action.payload;
        }
    }
});

export const { setToken, clearToken, setUser, setFriends } = authSlice.actions;
export default authSlice.reducer;
