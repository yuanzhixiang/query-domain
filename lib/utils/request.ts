import { Agent, request } from 'undici';

// Derive the correct type for the options from the `request` function parameters.
// This ensures we use the global request signature, not the Dispatcher internal type.
type GlobalRequestOptions = NonNullable<Parameters<typeof request>[1]>;

const agent = new Agent({
  connect: { timeout: 30000 }, // connection timeout
  bodyTimeout: 30000, // body reading timeout
  headersTimeout: 30000, // headers receiving timeout
});

const defaultHeaders: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
};

// This wrapper function ensures every request has our default headers and uses our agent.
export async function makeRequest(
  url: string,
  options: GlobalRequestOptions = {},
) {
  // Merge in default headers
  options.headers = {
    ...defaultHeaders,
    ...(options.headers || {}),
  };

  // If no method is specified, default to GET
  if (!options.method) {
    options.method = 'GET';
  }

  // Use our agent as the dispatcher
  options.dispatcher = agent;

  // Make the request with the given URL and merged options
  const result = await request(url, options);
  return result;
}
