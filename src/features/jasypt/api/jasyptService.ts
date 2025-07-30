import httpClient from '../../../shared/services/httpClient';

interface JasyptRequest {
  text: string;
  password: string;
  algorithm: string;
}

interface JasyptResponse {
  originalText: string;
  encryptedText?: string;
  decryptedText?: string;
  algorithm: string;
  success: boolean;
  message: string;
}

export const jasyptService = {
  encrypt: async (request: JasyptRequest): Promise<JasyptResponse> => {
    const response = await httpClient.post<JasyptResponse>('/jasypt/encrypt', { payload: request });
    return response;
  },

  decrypt: async (request: JasyptRequest): Promise<JasyptResponse> => {
    const response = await httpClient.post<JasyptResponse>('/jasypt/decrypt', { payload: request });
    return response;
  },
}; 