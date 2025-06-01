import axios from 'axios';

// Set base URL for all requests
axios.defaults.baseURL = 'http://localhost:8080';

// Add default headers
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add request interceptor to handle errors and add token
axios.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request for debugging
    console.log('Making request to:', config.url);
    console.log('Request config:', {
      ...config,
      headers: {
        ...config.headers,
        Authorization: config.headers.Authorization ? 'Bearer [TOKEN]' : undefined,
      },
    });

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
axios.interceptors.response.use(
  (response) => {
    // Log response for debugging
    console.log('Response received:', {
      ...response,
      data: response.data ? '[DATA]' : undefined,
    });
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);

      // Handle 403 errors
      if (error.response.status === 403) {
        console.error('Authentication error - token might be invalid or expired');
        // You might want to dispatch a logout action here
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axios; 