import apiClient from './api';
import { DiffRequest, DiffResponse } from '../types';

export const diffService = {
  compareText: async (request: DiffRequest): Promise<DiffResponse> => {
    const response = await apiClient.post('/diff/compare', { payload: request });
    // Handle the specific response structure with 'data' field
    return response.data.data || response.data.result;
  },

  enhancedCompare: async (request: DiffRequest): Promise<DiffResponse> => {
    const response = await apiClient.post('/diff/enhanced', { payload: request });
    // Handle the specific response structure with 'data' field
    return response.data.data || response.data.result;
  },
}; 