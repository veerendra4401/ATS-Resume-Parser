import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './reducers/userReducer';
import { authReducer } from './reducers/authReducer';

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const tokenFromStorage = localStorage.getItem('token') || null;

const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
  },
  preloadedState: {
    auth: {
      userInfo: userInfoFromStorage,
      token: tokenFromStorage,
      loading: false,
      error: null,
    },
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store; 