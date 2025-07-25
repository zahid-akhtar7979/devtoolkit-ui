import apiClient from './api';
import { UtilityRequest, UtilityResponse } from '../types';

export const utilityService = {
  encodeUrl: async (request: UtilityRequest): Promise<UtilityResponse> => {
    const response = await apiClient.post('/utility/url/encode', request);
    return response.data;
  },

  decodeUrl: async (request: UtilityRequest): Promise<UtilityResponse> => {
    const response = await apiClient.post('/utility/url/decode', request);
    return response.data;
  },

  generateUuid: async (request: UtilityRequest): Promise<UtilityResponse> => {
    const response = await apiClient.post('/utility/uuid/generate', request);
    return response.data;
  },

  convertTimestamp: async (request: UtilityRequest): Promise<UtilityResponse> => {
    const response = await apiClient.post('/utility/timestamp/convert', request);
    return response.data;
  },

  convertFormat: async (request: UtilityRequest): Promise<UtilityResponse> => {
    const response = await apiClient.post('/utility/converter/convert', request);
    return response.data;
  },



  generateCurl: async (request: UtilityRequest): Promise<UtilityResponse> => {
    const response = await apiClient.post('/utility/curl/generate', request);
    return response.data;
  },

  formatSql: async (request: UtilityRequest): Promise<UtilityResponse> => {
    const response = await apiClient.post('/utility/sql/format', request);
    return response.data;
  },

  testRegex: async (request: UtilityRequest): Promise<UtilityResponse> => {
    const response = await apiClient.post('/utility/regex/test', request);
    return response.data;
  },

  compareText: async (request: UtilityRequest): Promise<UtilityResponse> => {
    const response = await apiClient.post('/utility/diff/compare', request);
    return response.data;
  },
}; 