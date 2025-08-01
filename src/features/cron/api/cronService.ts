import httpClient from '../../../shared/services/httpClient';

interface CronRequest {
  cronExpression: string;
  count?: number;
}

interface CronResponse {
  cronExpression: string;
  nextExecutions: string[];
  description: string;
  valid: boolean;
  message: string;
}

export const cronService = {
  evaluate: async (request: CronRequest): Promise<CronResponse> => {
    const response = await httpClient.post<CronResponse>('/cron/evaluate', { payload: request });
    return response;
  },
}; 