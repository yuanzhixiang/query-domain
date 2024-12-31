/**
 * WHOIS query options
 */
export interface WhoisQueryOptions {
  timeout?: number;       // Connection timeout in milliseconds
  retries?: number;      // Number of retries on failure
  encoding?: string;     // Response encoding
}

/**
 * WHOIS server connection options
 */
export interface WhoisServerOptions {
  host: string;          // WHOIS server hostname
  port?: number;         // Server port (default: 43)
  timeout?: number;      // Connection timeout
}

/**
 * WHOIS query result
 */
export interface WhoisQueryResult {
  raw: string;           // Raw response from WHOIS server
  server: string;        // WHOIS server used for query
  queryTime: number;     // Query execution time in milliseconds
}
