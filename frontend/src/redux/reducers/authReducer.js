import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.userInfo = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    loginFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    registerRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.userInfo = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    registerFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.userInfo = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFail,
  registerRequest,
  registerSuccess,
  registerFail,
  logout,
} = authSlice.actions;

export const authReducer = authSlice.reducer;