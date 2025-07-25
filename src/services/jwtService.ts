import apiClient from './api';
import { JwtRequest, JwtResponse } from '../types';

export const jwtService = {
  decode: async (request: JwtRequest): Promise<JwtResponse> => {
    const response = await apiClient.post('/jwt/decode', request);
    return response.data;
  },

  verify: async (request: JwtRequest): Promise<JwtResponse> => {
    const response = await apiClient.post('/jwt/verify', request);
    return response.data;
  },
}; 