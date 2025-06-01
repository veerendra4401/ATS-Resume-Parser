import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import jobReducer from './slices/jobSlice';
import resumeReducer from './slices/resumeSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
    resume: resumeReducer,
  },
});

export default store; 