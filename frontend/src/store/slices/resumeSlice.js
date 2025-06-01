import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  parsedResume: null,
  skills: [],
  loading: false,
  error: null,
  uploadedResumes: []
};

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    uploadResumeStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    uploadResumeSuccess: (state, action) => {
      state.loading = false;
      state.parsedResume = action.payload;
      state.skills = action.payload.skills || [];
      if (action.payload.id) {
        state.uploadedResumes = [...state.uploadedResumes, action.payload];
      }
    },
    uploadResumeFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchResumesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchResumesSuccess: (state, action) => {
      state.loading = false;
      state.uploadedResumes = action.payload;
    },
    fetchResumesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearParsedResume: (state) => {
      state.parsedResume = null;
      state.skills = [];
    }
  }
});

export const {
  uploadResumeStart,
  uploadResumeSuccess,
  uploadResumeFailure,
  fetchResumesStart,
  fetchResumesSuccess,
  fetchResumesFailure,
  clearParsedResume
} = resumeSlice.actions;

export default resumeSlice.reducer; 