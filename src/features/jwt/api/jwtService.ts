import httpClient from '../../../shared/services/httpClient';

interface JwtRequest {
  token: string;
  secret?: string;
}

interface JwtDecodeResponse {
  header: any;
  payload: any;
  signature: string;
  success: boolean;
  message: string;
}

interface JwtVerifyResponse {
  valid: boolean;
  claims: any;
  success: boolean;
  message: string;
}

export const jwtService = {
  decode: async (request: JwtRequest): Promise<JwtDecodeResponse> => {
    const response = await httpClient.post<JwtDecodeResponse>('/jwt/decode', { payload: request });
    return response;
  },

  verify: async (request: JwtRequest): Promise<JwtVerifyResponse> => {
    const response = await httpClient.post<JwtVerifyResponse>('/jwt/verify', { payload: request });
    return response;
  },
}; 