import apiClient from './api';
import { CronRequest, CronResponse } from '../types';

export const cronService = {
  evaluate: async (request: CronRequest): Promise<CronResponse> => {
    const response = await apiClient.post('/cron/evaluate', { payload: request });
    // Handle the specific response structure with 'data' field
    return response.data.data || response.data.result;
  },
}; 