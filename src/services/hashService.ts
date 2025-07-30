import apiClient from './api';
import { HashRequest, HashResponse } from '../types';

export const hashService = {
  generate: async (request: HashRequest): Promise<HashResponse> => {
    const response = await apiClient.post('/hash/generate', { payload: request });
    // Handle the specific response structure with 'data' field
    return response.data.data || response.data.result;
  },
}; 