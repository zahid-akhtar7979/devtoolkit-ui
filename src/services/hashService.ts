import apiClient from './api';
import { HashRequest, HashResponse } from '../types';

export const hashService = {
  generate: async (request: HashRequest): Promise<HashResponse> => {
    const response = await apiClient.post('/hash/generate', request);
    return response.data;
  },
}; 