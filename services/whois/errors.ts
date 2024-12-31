/**
 * Custom error class for WHOIS-related errors
 */
export class WhoisError extends Error {
  constructor(
    message: string,
    public code: number,
    public details?: any
  ) {
    super(message);
    this.name = 'WhoisError';
  }
}

export const ErrorCodes = {
  CONNECTION_FAILED: 5001,
  TIMEOUT: 5002,
  INVALID_RESPONSE: 5003,
  SERVER_NOT_FOUND: 5004,
  RATE_LIMITED: 5005,
} as const;

export const ErrorMessages = {
  [ErrorCodes.CONNECTION_FAILED]: 'Failed to connect to WHOIS server',
  [ErrorCodes.TIMEOUT]: 'Connection timed out',
  [ErrorCodes.INVALID_RESPONSE]: 'Invalid response from WHOIS server',
  [ErrorCodes.SERVER_NOT_FOUND]: 'WHOIS server not found',
  [ErrorCodes.RATE_LIMITED]: 'Rate limit exceeded',
} as const;
