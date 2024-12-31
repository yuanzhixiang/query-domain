import { log } from '@logtail/next';

export interface LogContext {
  [key: string]: unknown;
}

class Logger {
  error(message: string, context?: LogContext): void {
    log.error(message, context);
    console.error(message, context ? JSON.stringify(context, null, 2) : '');
  }

  info(message: string, context?: LogContext): void {
    log.info(message, context);
    console.log(message, context ? JSON.stringify(context, null, 2) : '');
  }

  warn(message: string, context?: LogContext): void {
    log.warn(message, context);
    console.warn(message, context ? JSON.stringify(context, null, 2) : '');
  }

  debug(message: string, context?: LogContext): void {
    log.debug(message, context);
    console.debug(message, context ? JSON.stringify(context, null, 2) : '');
  }
}

// Export a singleton instance
export const logger = new Logger();
