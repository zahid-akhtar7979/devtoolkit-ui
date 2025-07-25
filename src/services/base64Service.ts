import apiClient from './api';
import { Base64Request, Base64Response } from '../types';

export const base64Service = {
  encode: async (request: Base64Request): Promise<Base64Response> => {
    const response = await apiClient.post('/base64/encode', request);
    return response.data;
  },

  decode: async (request: Base64Request): Promise<Base64Response> => {
    const response = await apiClient.post('/base64/decode', request);
    return response.data;
  },
}; 