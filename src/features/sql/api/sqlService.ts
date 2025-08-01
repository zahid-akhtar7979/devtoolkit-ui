import httpClient from '../../../shared/services/httpClient';

interface SqlRequest {
  sql: string;
  dialect: string;
}

interface SqlResponse {
  originalSql: string;
  formattedSql: string;
  dialect: string;
  success: boolean;
  message: string;
}

export const sqlService = {
  format: async (request: SqlRequest): Promise<SqlResponse> => {
    const response = await httpClient.post<SqlResponse>('/sqlformatter/format', { payload: request });
    return response;
  },
}; 