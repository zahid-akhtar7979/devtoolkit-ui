import { ApiResponse } from '../types';

export interface StandardizedApiError {
  code: string;
  message: string;
  status: number;
}

export class ApiErrorHandler {
  static handleError(error: any): StandardizedApiError {
    // Handle axios errors
    if (error.response) {
      const { status, data } = error.response;
      
      // Handle the new standardized error format
      if (data && data.status === 'ERROR' && data.error) {
        return {
          code: data.error.code || 'UNKNOWN_ERROR',
          message: data.error.message || 'An unknown error occurred',
          status
        };
      }
      
      // Handle legacy error format or other error types
      return {
        code: 'HTTP_ERROR',
        message: data?.message || data?.error || `HTTP ${status} error`,
        status
      };
    }
    
    // Handle network errors
    if (error.request) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Network error - unable to connect to the server',
        status: 0
      };
    }
    
    // Handle other errors
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred',
      status: 0
    };
  }

  static isSuccessResponse<T>(response: ApiResponse<T>): response is ApiResponse<T> & { status: 'SUCCESS' } {
    return response.status === 'SUCCESS';
  }

  static isErrorResponse<T>(response: ApiResponse<T>): response is ApiResponse<T> & { status: 'ERROR' } {
    return response.status === 'ERROR';
  }

  static extractResult<T>(response: ApiResponse<T>): T {
    if (this.isErrorResponse(response)) {
      throw new Error(response.error?.message || 'API returned an error');
    }
    return response.result!;
  }
}

// Common error codes mapping
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  BASE64_INVALID_INPUT: 'BASE64_INVALID_INPUT',
  HASH_INVALID_ALGORITHM: 'HASH_INVALID_ALGORITHM',
  JWT_VALIDATION_ERROR: 'JWT_VALIDATION_ERROR',
  JWT_INVALID_FORMAT: 'JWT_INVALID_FORMAT',
  JWT_TOKEN_EXPIRED: 'JWT_TOKEN_EXPIRED',
  JWT_INVALID_SIGNATURE: 'JWT_INVALID_SIGNATURE',
  JASYPT_ENCRYPTION_ERROR: 'JASYPT_ENCRYPTION_ERROR',
  JASYPT_DECRYPTION_ERROR: 'JASYPT_DECRYPTION_ERROR',
  CRON_INVALID_EXPRESSION: 'CRON_INVALID_EXPRESSION',
  UTILITY_PROCESSING_ERROR: 'UTILITY_PROCESSING_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const; 