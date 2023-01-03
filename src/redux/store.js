import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../redux/slices/user.slices'

export const store = configureStore({
  reducer: {
    userData: userReducer
  }
})