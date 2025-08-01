import httpClient from '../../../shared/services/httpClient';

interface UrlRequest {
  text: string;
  operation: 'encode' | 'decode';
  encoding?: string;
}

interface UrlResponse {
  originalText: string;
  processedText: string;
  operation: 'encode' | 'decode';
  encoding: string;
  success: boolean;
  message: string;
}

export const urlService = {
  process: async (request: UrlRequest): Promise<UrlResponse> => {
    const response = await httpClient.post<UrlResponse>('/urlencoder/process', { payload: request });
    return response;
  },
}; 