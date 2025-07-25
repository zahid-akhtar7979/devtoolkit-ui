import apiClient from './api';
import { JwtRequest, JwtResponse } from '../types';

export const jwtService = {
  decode: async (request: JwtRequest): Promise<JwtResponse> => {
    const response = await apiClient.post('/jwt/decode', request);
    const data = response.data;
    
    // If the backend returns success: false, throw an error to trigger error handling
    if (data.success === false) {
      const error = new Error(data.error || 'JWT decode failed');
      // Attach the full response data to the error for detailed error handling
      (error as any).response = { data };
      throw error;
    }
    
    return data;
  },

  verify: async (request: JwtRequest): Promise<JwtResponse> => {
    const response = await apiClient.post('/jwt/verify', request);
    const data = response.data;
    
    // If the backend returns success: false, throw an error to trigger error handling
    if (data.success === false) {
      const error = new Error(data.error || 'JWT verification failed');
      // Attach the full response data to the error for detailed error handling
      (error as any).response = { data };
      throw error;
    }
    
    return data;
  },
}; 