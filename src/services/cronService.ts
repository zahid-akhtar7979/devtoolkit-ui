import apiClient from './api';
import { CronRequest, CronResponse } from '../types';

export const cronService = {
  evaluate: async (request: CronRequest): Promise<CronResponse> => {
    const response = await apiClient.post('/cron/evaluate', request);
    return response.data;
  },
}; 