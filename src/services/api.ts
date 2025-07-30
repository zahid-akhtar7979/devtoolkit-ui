import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { API_BASE_URL } from '../constants/navigation';
import { ApiErrorHandler, StandardizedApiError } from '../utils/apiErrorHandling';

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens, etc.
apiClient.interceptors.request.use(
  (config) => {
    // Add any request modifications here (auth tokens, etc.)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common responses
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Use the new error handler
    const apiError = ApiErrorHandler.handleError(error);
    
    // Log the error for debugging
    console.error('API Error:', apiError);
    
    // Handle specific error codes
    switch (apiError.code) {
      case 'JWT_TOKEN_EXPIRED':
      case 'JWT_INVALID_SIGNATURE':
        console.error('JWT authentication error:', apiError.message);
        break;
      case 'NETWORK_ERROR':
        console.error('Network connectivity issue:', apiError.message);
        break;
      case 'VALIDATION_ERROR':
        console.error('Input validation failed:', apiError.message);
        break;
      default:
        console.error('API error occurred:', apiError.message);
    }
    
    return Promise.reject(apiError);
  }
);

export default apiClient; 