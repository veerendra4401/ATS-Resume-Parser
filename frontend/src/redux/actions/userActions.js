import axios from 'axios';
import {
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFail,
  uploadResumeRequest,
  uploadResumeSuccess,
  uploadResumeFail,
  updateAvatarRequest,
  updateAvatarSuccess,
  updateAvatarFail,
} from '../reducers/userReducer';

// Update user profile
export const updateProfile = (profileData) => async (dispatch, getState) => {
  try {
    dispatch(updateProfileRequest());

    const {
      auth: { token },
    } = getState();

    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('Making profile update request with token:', token);
    console.log('Profile data:', profileData);

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      '/api/v1/users/profile',
      profileData,
      config
    );

    console.log('Profile update successful:', data);

    dispatch(updateProfileSuccess(data));
  } catch (error) {
    console.error('Profile update error:', error);
    console.error('Error response:', error.response);
    
    dispatch(updateProfileFail(
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    ));
    throw error;
  }
};

// Upload resume
export const uploadResume = (file) => async (dispatch, getState) => {
  try {
    dispatch(uploadResumeRequest());

    const {
      auth: { token },
    } = getState();

    const formData = new FormData();
    formData.append('file', file);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(
      '/api/v1/resume/parse',
      formData,
      config
    );

    dispatch(uploadResumeSuccess(data));
  } catch (error) {
    dispatch(uploadResumeFail(
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    ));
    throw error;
  }
};

// Update avatar
export const updateAvatar = (file) => async (dispatch, getState) => {
  try {
    dispatch(updateAvatarRequest());

    const {
      auth: { token },
    } = getState();

    const formData = new FormData();
    formData.append('file', file);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(
      '/api/v1/users/avatar',
      formData,
      config
    );

    dispatch(updateAvatarSuccess(data));
  } catch (error) {
    dispatch(updateAvatarFail(
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    ));
    throw error;
  }
}; 