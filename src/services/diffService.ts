import apiClient from './api';
import { DiffRequest, DiffResponse } from '../types';

export const diffService = {
  compareText: async (request: DiffRequest): Promise<DiffResponse> => {
    const response = await apiClient.post('/diff/compare', request);
    return response.data;
  },

  enhancedCompare: async (request: DiffRequest): Promise<DiffResponse> => {
    const response = await apiClient.post('/diff/enhanced', request);
    return response.data;
  },
}; 