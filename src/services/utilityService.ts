import apiClient from './api';
import { UtilityRequest, UtilityResponse } from '../types';

export const utilityService = {
  encodeUrl: async (request: UtilityRequest): Promise<UtilityResponse> => {
    const response = await apiClient.post('/urlencoder/encode', { payload: request });
    // Handle the specific response structure with 'data' field
    return response.data.data || response.data.result;
  },

  decodeUrl: async (request: UtilityRequest): Promise<UtilityResponse> => {
    const response = await apiClient.post('/urlencoder/decode', { payload: request });
    // Handle the specific response structure with 'data' field
    return response.data.data || response.data.result;
  },



  convertTimestamp: async (request: UtilityRequest): Promise<UtilityResponse> => {
    const response = await apiClient.post('/timestampconverter/convert', { payload: request });
    // Handle the specific response structure with 'data' field
    return response.data.data || response.data.result;
  },

  convertFormat: async (request: UtilityRequest): Promise<UtilityResponse> => {
    const response = await apiClient.post('/formatconverter/convert', { payload: request });
    // Handle the specific response structure with 'data' field
    return response.data.data || response.data.result;
  },

  generateCurl: async (request: UtilityRequest): Promise<UtilityResponse> => {
    const response = await apiClient.post('/curlgenerator/generate', { payload: request });
    // Handle the specific response structure with 'data' field
    return response.data.data || response.data.result;
  },

  formatSql: async (request: UtilityRequest): Promise<UtilityResponse> => {
    const response = await apiClient.post('/sqlformatter/format', { payload: request });
    // Handle the specific response structure with 'data' field
    return response.data.data || response.data.result;
  },

  testRegex: async (request: UtilityRequest): Promise<UtilityResponse> => {
    const response = await apiClient.post('/regextester/test', { payload: request });
    // Handle the specific response structure with 'data' field
    return response.data.data || response.data.result;
  },
}; 