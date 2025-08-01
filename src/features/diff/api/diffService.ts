import httpClient from '../../../shared/services/httpClient';

interface DiffRequest {
  text1: string;
  text2: string;
  diffType?: 'TEXT' | 'JSON' | 'CODE' | 'XML';
  contextLines?: number;
}

interface DiffStatistics {
  totalLines1: number;
  totalLines2: number;
  unchangedLines: number;
  changedLines: number;
  changePercentage: number;
}

interface DiffResponse {
  identical: boolean;
  unifiedDiff: string;
  sideBySide: {
    comparison: Array<{
      lineNumber: number;
      left: string;
      right: string;
      status: string;
      cssClass: string;
    }>;
    totalLines: number;
  };
  statistics: DiffStatistics;
  success: boolean;
  message: string;
}

export const diffService = {
  compare: async (request: DiffRequest): Promise<DiffResponse> => {
    const response = await httpClient.post<DiffResponse>('/diff/compare', { payload: request });
    return response;
  },
}; 