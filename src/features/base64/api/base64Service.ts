import httpClient from '../../../shared/services/httpClient';

interface Base64Request {
  text: string;
  operation: 'encode' | 'decode';
}

interface Base64Response {
  originalText: string;
  processedText: string;
  operation: 'encode' | 'decode';
  success: boolean;
  message: string;
}

export const base64Service = {
  encode: async (request: Base64Request): Promise<Base64Response> => {
    const response = await httpClient.post<Base64Response>('/base64/encode', { payload: request });
    return response;
  },

  decode: async (request: Base64Request): Promise<Base64Response> => {
    const response = await httpClient.post<Base64Response>('/base64/decode', { payload: request });
    return response;
  },
}; 