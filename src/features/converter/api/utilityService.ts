import httpClient from '../../../shared/services/httpClient';

interface UtilityRequest {
  text: string;
  sourceFormat?: string;
  targetFormat?: string;
  operation?: string;
  encoding?: string;
  timestamp?: string;
  url?: string;
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  sql?: string;
  dialect?: string;
  pattern?: string;
  testText?: string;
}

interface UtilityResponse {
  originalText?: string;
  convertedText?: string;
  encodedText?: string;
  decodedText?: string;
  sourceFormat?: string;
  targetFormat?: string;
  operation?: string;
  encoding?: string;
  originalTimestamp?: string;
  convertedTimestamp?: string;
  curlCommand?: string;
  originalSql?: string;
  formattedSql?: string;
  dialect?: string;
  pattern?: string;
  testText?: string;
  matches?: Array<{
    match: string;
    start: number;
    end: number;
  }>;
  matchCount?: number;
  success: boolean;
  message: string;
}

export const utilityService = {
  urlEncode: async (request: UtilityRequest): Promise<UtilityResponse> => {
    const response = await httpClient.post<UtilityResponse>('/urlencoder/process', { payload: request });
    return response;
  },

  urlDecode: async (request: UtilityRequest): Promise<UtilityResponse> => {
    const response = await httpClient.post<UtilityResponse>('/urlencoder/process', { payload: request });
    return response;
  },

  convertTimestamp: async (request: UtilityRequest): Promise<UtilityResponse> => {
    const response = await httpClient.post<UtilityResponse>('/timestampconverter/convert', { payload: request });
    return response;
  },

  convertFormat: async (request: UtilityRequest): Promise<UtilityResponse> => {
    const response = await httpClient.post<UtilityResponse>('/formatconverter/convert', { payload: request });
    return response;
  },

  generateCurl: async (request: UtilityRequest): Promise<UtilityResponse> => {
    const response = await httpClient.post<UtilityResponse>('/curlgenerator/generate', { payload: request });
    return response;
  },

  formatSql: async (request: UtilityRequest): Promise<UtilityResponse> => {
    const response = await httpClient.post<UtilityResponse>('/sqlformatter/format', { payload: request });
    return response;
  },

  testRegex: async (request: UtilityRequest): Promise<UtilityResponse> => {
    const response = await httpClient.post<UtilityResponse>('/regextester/test', { payload: request });
    return response;
  },
}; 