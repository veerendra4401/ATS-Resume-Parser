import { createSlice } from '@reduxjs/toolkit';
import {
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
  UPLOAD_RESUME_REQUEST,
  UPLOAD_RESUME_SUCCESS,
  UPLOAD_RESUME_FAIL,
  UPDATE_AVATAR_REQUEST,
  UPDATE_AVATAR_SUCCESS,
  UPDATE_AVATAR_FAIL,
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAIL,
  UPDATE_SKILLS_REQUEST,
  UPDATE_SKILLS_SUCCESS,
  UPDATE_SKILLS_FAIL,
  GET_RESUMES_REQUEST,
  GET_RESUMES_SUCCESS,
  GET_RESUMES_FAIL,
  DELETE_RESUME_REQUEST,
  DELETE_RESUME_SUCCESS,
  DELETE_RESUME_FAIL,
} from '../constants/userConstants';

const initialState = {
  profile: null,
  loading: false,
  error: null,
  resumes: [],
  uploadingResume: false,
  uploadError: null,
  updatingAvatar: false,
  avatarError: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateProfileRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateProfileSuccess: (state, action) => {
      state.loading = false;
      state.profile = action.payload;
      state.error = null;
    },
    updateProfileFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    uploadResumeRequest: (state) => {
      state.uploadingResume = true;
      state.uploadError = null;
    },
    uploadResumeSuccess: (state, action) => {
      state.uploadingResume = false;
      state.resumes = [...state.resumes, action.payload];
      state.uploadError = null;
    },
    uploadResumeFail: (state, action) => {
      state.uploadingResume = false;
      state.uploadError = action.payload;
    },
    updateAvatarRequest: (state) => {
      state.updatingAvatar = true;
      state.avatarError = null;
    },
    updateAvatarSuccess: (state, action) => {
      state.updatingAvatar = false;
      state.profile = {
        ...state.profile,
        avatar: action.payload.avatar,
      };
      state.avatarError = null;
    },
    updateAvatarFail: (state, action) => {
      state.updatingAvatar = false;
      state.avatarError = action.payload;
    },
  },
});

export const {
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFail,
  uploadResumeRequest,
  uploadResumeSuccess,
  uploadResumeFail,
  updateAvatarRequest,
  updateAvatarSuccess,
  updateAvatarFail,
} = userSlice.actions;

export const userReducer = userSlice.reducer; 