import { WhoisError } from '../errors';
import { WhoisClient } from '../WhoisClient';

describe('WhoisClient', () => {
  let client: WhoisClient;

  beforeEach(() => {
    client = new WhoisClient({
      timeout: 10000, // 10 seconds for tests
      retries: 2,
    });
  });

  it('should query IANA WHOIS server successfully', async () => {
    const result = await client.query('com', {
      host: 'whois.iana.org',
    });

    console.log(result);

    expect(result.raw).toBeTruthy();
    expect(result.server).toBe('whois.iana.org');
    expect(result.queryTime).toBeGreaterThan(0);
    expect(result.raw).toContain('whois.verisign-grs.com');
  });

  it('should handle invalid server', async () => {
    await expect(
      client.query('test.com', {
        host: 'invalid.whois.server',
      }),
    ).rejects.toThrow(WhoisError);
  });
});
