import axios from 'axios';
import {
  loginRequest,
  loginSuccess,
  loginFail,
  registerRequest,
  registerSuccess,
  registerFail,
  logout,
} from '../reducers/authReducer';

// Login user
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(loginRequest());

    const { data } = await axios.post('/api/v1/auth/login', {
      email,
      password,
    });

    // Store token in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('userInfo', JSON.stringify(data.user));

    dispatch(loginSuccess(data));
  } catch (error) {
    dispatch(loginFail(
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    ));
  }
};

// Register user
export const register = (userData) => async (dispatch) => {
  try {
    dispatch(registerRequest());

    const { data } = await axios.post('/api/v1/auth/register', userData);

    // Store token in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('userInfo', JSON.stringify(data.user));

    dispatch(registerSuccess(data));
  } catch (error) {
    dispatch(registerFail(
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    ));
  }
};

// Logout user
export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('token');
  localStorage.removeItem('userInfo');
  dispatch(logout());
}; 