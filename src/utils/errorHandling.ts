/**
 * Utility functions for handling API errors consistently across the application
 */

export interface ApiError {
  message: string;
  response?: {
    data?: any;
    status?: number;
  };
  code?: string;
}

/**
 * Get a user-friendly error message from an API error
 */
export function getErrorMessage(error: any): string {
  if (!error) return '';
  
  // Check for network errors (CORS, connection issues)
  if (error.message === 'Network Error') {
    return 'Unable to connect to the server. Please check your internet connection or try again later.';
  }
  
  // Check for CORS errors
  if (error.message && error.message.includes('CORS')) {
    return 'Server connection issue. Please try again later or contact support.';
  }
  
  // Check for timeout errors
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }
  
  // Check for response errors
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  
  // Check for HTTP status errors
  if (error.response?.status) {
    switch (error.response.status) {
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return 'Authentication required. Please try again.';
      case 403:
        return 'Access denied. Please try again.';
      case 404:
        return 'Service not found. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      case 502:
        return 'Server temporarily unavailable. Please try again later.';
      case 503:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return `Server error (${error.response.status}). Please try again later.`;
    }
  }
  
  // Fallback to generic error message
  return error.message || 'An unexpected error occurred. Please try again.';
}

/**
 * Check if an error is a network-related error
 */
export function isNetworkError(error: any): boolean {
  return (
    error.message === 'Network Error' ||
    error.code === 'ECONNABORTED' ||
    (error.message && error.message.includes('CORS')) ||
    error.response?.status >= 500
  );
}

/**
 * Check if an error is a client-side error (4xx status codes)
 */
export function isClientError(error: any): boolean {
  return error.response?.status >= 400 && error.response?.status < 500;
}

/**
 * Get error severity for UI display
 */
export function getErrorSeverity(error: any): 'error' | 'warning' | 'info' {
  if (isNetworkError(error)) {
    return 'error';
  }
  
  if (isClientError(error)) {
    return 'warning';
  }
  
  return 'error';
} 