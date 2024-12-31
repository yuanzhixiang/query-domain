import { WhoisClient } from './WhoisClient';

export class WhoisRegistryService {
  private whoisClient: WhoisClient;

  constructor() {
    this.whoisClient = new WhoisClient({
      timeout: 10000,
      retries: 2,
    });
  }

  /**
   * Get WHOIS server for a TLD
   * First checks the database, if not found queries IANA
   */
  async getWhoisServer(tld: string): Promise<string> {
    // If not in database, query IANA
    const ianaResult = await this.whoisClient.query(tld, {
      host: 'whois.iana.org',
    });

    console.log('IANA response:', ianaResult);

    // Extract WHOIS server from IANA response
    const whoisServerMatch = ianaResult.raw.match(/whois:\s*([^\s]+)/i);
    if (!whoisServerMatch) {
      throw new Error(`Could not find WHOIS server for TLD: ${tld}`);
    }

    const whoisServer = whoisServerMatch[1];

    console.log(
      `Saved new WHOIS server for TLD ${tld} to database: ${whoisServer}`,
    );
    return whoisServer;
  }

  /**
   * Query WHOIS information for a domain
   */
  async queryDomain(domain: string) {
    const tld = domain.split('.').pop();
    if (!tld) {
      throw new Error('Invalid domain name');
    }

    const whoisServer = await this.getWhoisServer(tld);
    return await this.whoisClient.query(domain, {
      host: whoisServer,
    });
  }
}
