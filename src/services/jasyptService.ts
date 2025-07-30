import apiClient from './api';
import { JasyptRequest, JasyptResponse } from '../types';

export const jasyptService = {
  encrypt: async (request: JasyptRequest): Promise<JasyptResponse> => {
    const response = await apiClient.post('/jasypt/encrypt', { payload: request });
    // Handle the specific response structure with 'data' field
    return response.data.data || response.data.result;
  },

  decrypt: async (request: JasyptRequest): Promise<JasyptResponse> => {
    const response = await apiClient.post('/jasypt/decrypt', { payload: request });
    // Handle the specific response structure with 'data' field
    return response.data.data || response.data.result;
  },
}; 