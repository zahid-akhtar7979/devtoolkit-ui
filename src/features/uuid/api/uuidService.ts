import httpClient from '../../../shared/services/httpClient';

interface UuidRequest {
  type: string;
  count?: number;
}

interface UuidResponse {
  uuid?: string;
  uuids?: string[];
  count?: number;
  type: string;
  success: boolean;
  message: string;
}

export const uuidService = {
  generate: async (request: UuidRequest): Promise<UuidResponse> => {
    const response = await httpClient.post<UuidResponse>('/uuidgenerator/generate', { payload: request });
    return response;
  },
}; 