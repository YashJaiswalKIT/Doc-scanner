// src/store.js
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/authSlice' // your slice

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})

export default store
