import apiClient from './api';
import { JwtRequest, JwtResponse } from '../types';

export const jwtService = {
  decode: async (request: JwtRequest): Promise<JwtResponse> => {
    const response = await apiClient.post('/jwt/decode', { payload: request });
    const data = response.data;
    
    // If the backend returns status: ERROR, throw an error to trigger error handling
    if (data.status === 'ERROR') {
      const error = new Error(data.error?.message || 'JWT decode failed');
      // Attach the full response data to the error for detailed error handling
      (error as any).response = { data };
      throw error;
    }
    
    // Handle the specific response structure with 'data' field
    return data.data || data.result;
  },

  verify: async (request: JwtRequest): Promise<JwtResponse> => {
    const response = await apiClient.post('/jwt/verify', { payload: request });
    const data = response.data;
    
    // If the backend returns status: ERROR, throw an error to trigger error handling
    if (data.status === 'ERROR') {
      const error = new Error(data.error?.message || 'JWT verification failed');
      // Attach the full response data to the error for detailed error handling
      (error as any).response = { data };
      throw error;
    }
    
    // Handle the specific response structure with 'data' field
    return data.data || data.result;
  },
}; 