import { useCallback } from 'react';

const MONITORED_DOMAINS_KEY = 'monitoredDomains';

export function useMonitoredDomains() {
  const addDomain = useCallback((domain: string) => {
    try {
      // Get current monitored domains
      const currentDomainsStr = localStorage.getItem(MONITORED_DOMAINS_KEY);
      const currentDomains = currentDomainsStr
        ? JSON.parse(currentDomainsStr)
        : [];

      // Add new domain if not already present
      if (!currentDomains.includes(domain)) {
        currentDomains.push(domain);
        localStorage.setItem(
          MONITORED_DOMAINS_KEY,
          JSON.stringify(currentDomains),
        );
      }
    } catch (error) {
      console.error('Failed to update monitored domains:', error);
    }
  }, []);

  const getDomains = useCallback((): string[] => {
    try {
      const domainsStr = localStorage.getItem(MONITORED_DOMAINS_KEY);
      return domainsStr ? JSON.parse(domainsStr) : [];
    } catch (error) {
      console.error('Failed to get monitored domains:', error);
      return [];
    }
  }, []);

  const removeDomain = useCallback((domain: string) => {
    try {
      // Get current monitored domains
      const currentDomainsStr = localStorage.getItem(MONITORED_DOMAINS_KEY);
      const currentDomains = currentDomainsStr
        ? JSON.parse(currentDomainsStr)
        : [];

      // Remove domain
      const updatedDomains = currentDomains.filter((d: string) => d !== domain);
      localStorage.setItem(
        MONITORED_DOMAINS_KEY,
        JSON.stringify(updatedDomains),
      );

      return true;
    } catch (error) {
      console.error('Failed to remove monitored domain:', error);
      return false;
    }
  }, []);

  return {
    addDomain,
    getDomains,
    removeDomain,
  };
}
