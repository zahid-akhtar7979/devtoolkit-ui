import httpClient from '../../../shared/services/httpClient';

interface RegexRequest {
  pattern: string;
  testText: string;
}

interface RegexMatch {
  match: string;
  start: number;
  end: number;
}

interface RegexResponse {
  pattern: string;
  testText: string;
  matches: RegexMatch[];
  matchCount: number;
  success: boolean;
  message: string;
}

export const regexService = {
  test: async (request: RegexRequest): Promise<RegexResponse> => {
    const response = await httpClient.post<RegexResponse>('/regextester/test', { payload: request });
    return response;
  },
}; 