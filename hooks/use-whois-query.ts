import { useState } from 'react';
import { toast } from 'sonner';

export type WhoisResult = {
  domain: string;
  status: 'pending' | 'success' | 'error';
  result?: any;
  error?: string;
};

export function useWhoisQuery() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<WhoisResult[]>([]);

  const queryDomains = async (domain: string, tlds: string[]) => {
    if (!domain) {
      toast.error('Please enter a domain name');
      return;
    }
    if (tlds.length === 0) {
      toast.error('Please add at least one TLD in settings');
      return;
    }

    setLoading(true);

    // Clean up domain name: remove all spaces and convert to lowercase
    const cleanDomain = domain.trim().toLowerCase().replace(/\s+/g, '');
    const domains = tlds.map((tld) => `${cleanDomain}.${tld}`);

    setResults(
      domains.map((domain) => ({
        domain,
        status: 'pending',
      })),
    );

    for (const domain of domains) {
      try {
        const response = await fetch(
          `/api/whois?domain=${encodeURIComponent(domain)}`,
        );
        const data = await response.json();

        setResults((prev) =>
          prev.map((result) =>
            result.domain === domain
              ? {
                  domain,
                  status: data.code === 2000 ? 'success' : 'error',
                  result: data.code === 2000 ? data.data : undefined,
                  error: data.code !== 2000 ? data.message : undefined,
                }
              : result,
          ),
        );
      } catch (error) {
        setResults((prev) =>
          prev.map((result) =>
            result.domain === domain
              ? {
                  domain,
                  status: 'error',
                  error: 'Failed to query domain',
                }
              : result,
          ),
        );
      }
    }

    setLoading(false);
  };

  return {
    loading,
    results,
    queryDomains,
  };
}
