import { logger } from './logger';

export function logError(
  message: string,
  error: unknown,
  context?: Record<string, unknown>,
): void {
  const errorInfo: {
    errorType: string;
    errorMessage: string;
    stack?: string;
    cause?: unknown;
    additionalInfo: string[];
    context?: Record<string, unknown>;
  } = {
    errorType: 'Unknown Error',
    errorMessage: 'An unknown error occurred',
    additionalInfo: [],
  };

  if (error instanceof Error) {
    errorInfo.errorType = error.name;
    errorInfo.errorMessage = error.message;
    errorInfo.stack = error.stack;
    errorInfo.cause = error.cause;

    // Common error analysis
    if (error.name === 'AbortError') {
      errorInfo.additionalInfo.push('Operation timed out');
    }
    if (error.message.includes('fetch failed')) {
      errorInfo.additionalInfo.push('Network error occurred');
    }
    if (error.message.includes('ECONNREFUSED')) {
      errorInfo.additionalInfo.push('Connection refused by the server');
    }
    if (error.message.includes('ENOTFOUND')) {
      errorInfo.additionalInfo.push('DNS lookup failed');
    }
    if (error.message.includes('ETIMEDOUT')) {
      errorInfo.additionalInfo.push('Connection timed out');
    }
  } else {
    errorInfo.errorMessage = String(error);
    errorInfo.additionalInfo.push(`Non-Error type: ${typeof error}`);
  }

  if (context) {
    errorInfo.context = context;
  }

  logger.error(message, { error: errorInfo });
}
