import { AlertColor } from '@mui/material';

export interface JwtErrorInfo {
  message: string;
  severity: AlertColor;
  suggestions: string[];
  technicalDetails?: string;
}

export const getJwtErrorInfo = (errorCode?: string, error?: string, technicalError?: string): JwtErrorInfo => {
  const defaultInfo: JwtErrorInfo = {
    message: error || 'An unexpected error occurred while processing the JWT token.',
    severity: 'error' as AlertColor,
    suggestions: ['Please check your JWT token format and try again.'],
    technicalDetails: technicalError
  };

  if (!errorCode) {
    return defaultInfo;
  }

  switch (errorCode) {
    case 'EMPTY_TOKEN':
      return {
        message: 'Please provide a JWT token to decode or verify.',
        severity: 'warning' as AlertColor,
        suggestions: [
          'Paste your JWT token in the input field above',
          'Make sure the token is not empty or contains only spaces'
        ],
        technicalDetails: technicalError
      };

    case 'EMPTY_SECRET':
      return {
        message: 'Please provide a secret key to verify the JWT token.',
        severity: 'warning' as AlertColor,
        suggestions: [
          'Enter the secret key used to sign the JWT token',
          'The secret key is required for token verification'
        ],
        technicalDetails: technicalError
      };

    case 'INVALID_FORMAT':
      return {
        message: 'The JWT token format is invalid.',
        severity: 'error' as AlertColor,
        suggestions: [
          'JWT tokens must have exactly 3 parts separated by dots (header.payload.signature)',
          'Check if the token was copied completely',
          'Remove any extra spaces or characters from the token',
          'Example format: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
        ],
        technicalDetails: technicalError
      };

    case 'INVALID_ENCODING':
      return {
        message: 'The JWT token contains invalid Base64 encoding.',
        severity: 'error' as AlertColor,
        suggestions: [
          'Check if the token was copied correctly without any modifications',
          'Ensure there are no extra characters or line breaks in the token',
          'Some applications may add prefixes like "Bearer " - try removing them',
          'Verify the token source is reliable'
        ],
        technicalDetails: technicalError
      };

    case 'INVALID_JSON':
      return {
        message: 'The JWT token contains invalid JSON data.',
        severity: 'error' as AlertColor,
        suggestions: [
          'The token appears to be corrupted or malformed',
          'Try obtaining a fresh token from the authentication source',
          'Verify the token was generated correctly by the issuing system'
        ],
        technicalDetails: technicalError
      };

    case 'MALFORMED_TOKEN':
      return {
        message: 'The JWT token is malformed or corrupted.',
        severity: 'error' as AlertColor,
        suggestions: [
          'Check if you have the complete token',
          'Ensure the token was not truncated during copying',
          'Verify the token source and regenerate if necessary',
          'Some tokens may be URL-encoded - try decoding first'
        ],
        technicalDetails: technicalError
      };

    case 'VERIFICATION_FAILED':
      return {
        message: 'JWT token verification failed.',
        severity: 'error' as AlertColor,
        suggestions: [
          'Check if the secret key is correct',
          'Verify the token hasn\'t expired (check the "exp" claim in payload)',
          'Ensure the token wasn\'t tampered with',
          'The token might have been signed with a different secret',
          'Check if the token algorithm matches what you expect'
        ],
        technicalDetails: technicalError
      };

    case 'UNKNOWN_ERROR':
      return {
        message: 'An unexpected error occurred while processing the JWT token.',
        severity: 'error' as AlertColor,
        suggestions: [
          'Please try again in a moment',
          'If the problem persists, check the token format',
          'Contact support if you continue to experience issues'
        ],
        technicalDetails: technicalError
      };

    default:
      return defaultInfo;
  }
};

export const getJwtValidationTips = (): string[] => {
  return [
    '🔍 JWT tokens have 3 parts: header.payload.signature',
    '📝 Each part is Base64-encoded JSON (except signature)',
    '🔐 Verification requires the same secret used for signing',
    '⏰ Check token expiration in the "exp" claim',
    '🎯 Common issues: missing parts, invalid encoding, wrong secret',
    '🚀 Tip: Remove "Bearer " prefix if present in the token'
  ];
}; 