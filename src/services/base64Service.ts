import apiClient from './api';
import { Base64Request, Base64Response } from '../types';

export const base64Service = {
  encode: async (request: Base64Request): Promise<Base64Response> => {
    const response = await apiClient.post('/base64/encode', { payload: request });
    // Handle the specific response structure with 'data' field
    return response.data.data || response.data.result;
  },

  decode: async (request: Base64Request): Promise<Base64Response> => {
    const response = await apiClient.post('/base64/decode', { payload: request });
    // Handle the specific response structure with 'data' field
    return response.data.data || response.data.result;
  },
}; 