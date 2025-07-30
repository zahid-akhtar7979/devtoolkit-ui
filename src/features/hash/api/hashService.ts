import httpClient from '../../../shared/services/httpClient';

interface HashRequest {
  text: string;
  algorithm: string;
}

interface HashResponse {
  originalText: string;
  hashes: any;
  specificHash: string;
  algorithm: string;
  success: boolean;
  message: string;
}

export const hashService = {
  generate: async (request: HashRequest): Promise<HashResponse> => {
    const response = await httpClient.post<HashResponse>('/hash/generate', { payload: request });
    return response;
  },
}; 