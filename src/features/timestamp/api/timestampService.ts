import httpClient from '../../../shared/services/httpClient';

interface TimestampRequest {
  timestamp: string;
  sourceFormat: string;
  targetFormat: string;
}

interface TimestampResponse {
  originalTimestamp: string;
  convertedDate: string;
  format: string;
  timestampValue: number;
  success: boolean;
  message: string;
}

export const timestampService = {
  convert: async (request: TimestampRequest): Promise<TimestampResponse> => {
    const response = await httpClient.post<TimestampResponse>('/timestampconverter/convert', { payload: request });
    return response;
  },
}; 