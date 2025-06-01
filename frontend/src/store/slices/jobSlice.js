import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  jobs: [],
  loading: false,
  error: null,
  currentJob: null,
  applications: [],
};

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    fetchJobsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchJobsSuccess: (state, action) => {
      state.loading = false;
      state.jobs = action.payload;
    },
    fetchJobsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentJob: (state, action) => {
      state.currentJob = action.payload;
    },
    createJobStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createJobSuccess: (state, action) => {
      state.loading = false;
      state.jobs.push(action.payload);
    },
    createJobFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchApplicationsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchApplicationsSuccess: (state, action) => {
      state.loading = false;
      state.applications = action.payload;
    },
    fetchApplicationsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    applyToJobStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    applyToJobSuccess: (state, action) => {
      state.loading = false;
      state.applications.push(action.payload);
    },
    applyToJobFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  fetchJobsStart,
  fetchJobsSuccess,
  fetchJobsFailure,
  setCurrentJob,
  createJobStart,
  createJobSuccess,
  createJobFailure,
  fetchApplicationsStart,
  fetchApplicationsSuccess,
  fetchApplicationsFailure,
  applyToJobStart,
  applyToJobSuccess,
  applyToJobFailure
} = jobSlice.actions;

export default jobSlice.reducer; 