// authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    token: localStorage.getItem("token") || null,
    friends: [],
    searchedUsers: [], // Add this
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
        },
        setSearchedUsers: (state, action) => {
            state.searchedUsers = action.payload;
        }
    }
});

export const { setToken, clearToken, setUser, setFriends, setSearchedUsers } = authSlice.actions;
export default authSlice.reducer;
