import { Socket } from 'net';
import { ErrorCodes, ErrorMessages, WhoisError } from './errors';
import {
  WhoisQueryOptions,
  WhoisQueryResult,
  WhoisServerOptions,
} from './types';

export class WhoisClient {
  private defaultOptions: WhoisQueryOptions = {
    timeout: 5000, // 5 seconds
    retries: 3, // 3 retries
    encoding: 'utf-8', // Default encoding
  };

  constructor(private options: WhoisQueryOptions = {}) {
    this.options = { ...this.defaultOptions, ...options };
  }

  /**
   * Query a WHOIS server
   * @param query - The domain or IP to query
   * @param serverOptions - WHOIS server connection options
   * @returns Promise<WhoisQueryResult>
   */
  public async query(
    query: string,
    serverOptions: WhoisServerOptions,
  ): Promise<WhoisQueryResult> {
    const startTime = Date.now();
    const { host, port = 43 } = serverOptions;

    let retries = this.options.retries!;
    let lastError: Error | null = null;

    while (retries >= 0) {
      try {
        const result = await this.executeQuery(query, host, port);
        return {
          raw: result,
          server: host,
          queryTime: Date.now() - startTime,
        };
      } catch (error) {
        lastError = error as Error;
        retries--;
        if (retries >= 0) {
          await this.delay(1000); // Wait 1 second before retry
        }
      }
    }

    throw new WhoisError(
      ErrorMessages[ErrorCodes.CONNECTION_FAILED],
      ErrorCodes.CONNECTION_FAILED,
      lastError,
    );
  }

  /**
   * Execute a single WHOIS query
   * @private
   */
  private executeQuery(
    query: string,
    host: string,
    port: number,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const socket = new Socket();
      const timeout = this.options.timeout!;
      let response = '';

      socket.setTimeout(timeout);
      socket.setEncoding(this.options.encoding as BufferEncoding);

      socket.on('connect', () => {
        socket.write(query.trim() + '\r\n');
      });

      socket.on('data', (data) => {
        response += data;
      });

      socket.on('timeout', () => {
        socket.destroy();
        reject(
          new WhoisError(ErrorMessages[ErrorCodes.TIMEOUT], ErrorCodes.TIMEOUT),
        );
      });

      socket.on('error', (error) => {
        reject(
          new WhoisError(
            ErrorMessages[ErrorCodes.CONNECTION_FAILED],
            ErrorCodes.CONNECTION_FAILED,
            error,
          ),
        );
      });

      socket.on('end', () => {
        if (!response) {
          reject(
            new WhoisError(
              ErrorMessages[ErrorCodes.INVALID_RESPONSE],
              ErrorCodes.INVALID_RESPONSE,
            ),
          );
        } else {
          resolve(response);
        }
      });

      socket.connect(port, host);
    });
  }

  /**
   * Helper method to delay execution
   * @private
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
