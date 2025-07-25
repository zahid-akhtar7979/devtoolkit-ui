import apiClient from './api';
import { JasyptRequest, JasyptResponse } from '../types';

export const jasyptService = {
  encrypt: async (request: JasyptRequest): Promise<JasyptResponse> => {
    const response = await apiClient.post('/jasypt/encrypt', request);
    return response.data;
  },

  decrypt: async (request: JasyptRequest): Promise<JasyptResponse> => {
    const response = await apiClient.post('/jasypt/decrypt', request);
    return response.data;
  },
}; 