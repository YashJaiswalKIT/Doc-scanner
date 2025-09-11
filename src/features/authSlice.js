// src/features/authSlice.js
import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userData: null,
  },
  reducers: {
    login: (state, action) => {
      state.userData = action.payload
    },
    logout: (state) => {
      state.userData = null
    },
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
