export enum ErrorCodes {
  // Success
  SUCCESS = 0,

  // General Errors (1000-1999)
  UNKNOWN_ERROR = 1000,
  VALIDATION_ERROR = 1001,

  // Site Related Errors (2000-2999)
  SITE_NOT_FOUND = 2000,
  SITE_DUPLICATE_DOMAIN = 2001,
  SITE_INVALID_DOMAIN = 2002,
  SITEMAP_NOT_FOUND = 2003,
  SITEMAP_FETCH_ERROR = 2004,
  SITE_REDIRECTED = 2005,
  FAVICON_NOT_FOUND = 2006,
}

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

export interface ActionResponse<T = undefined> {
  code: ErrorCode;
  data?: T;
}

// Error message mappings
export const ErrorMessages: Record<ErrorCode, string> = {
  [ErrorCodes.SUCCESS]: 'Operation successful',
  [ErrorCodes.UNKNOWN_ERROR]: 'An unexpected error occurred',
  [ErrorCodes.VALIDATION_ERROR]: 'Invalid domain format',
  [ErrorCodes.SITE_NOT_FOUND]: 'Site not found',
  [ErrorCodes.SITE_DUPLICATE_DOMAIN]: 'A site with this domain already exists',
  [ErrorCodes.SITE_INVALID_DOMAIN]: 'Invalid domain format',
  [ErrorCodes.SITEMAP_NOT_FOUND]: 'No sitemap found for this site',
  [ErrorCodes.SITEMAP_FETCH_ERROR]: 'Failed to fetch sitemap, please check if the site is accessible',
  [ErrorCodes.SITE_REDIRECTED]: 'Domain redirects to another domain',
  [ErrorCodes.FAVICON_NOT_FOUND]: 'No favicon found for this site',
};
