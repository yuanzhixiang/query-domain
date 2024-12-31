import { useState, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'whois-tlds';

export function useTldStore() {
  const [tlds, setTlds] = useState<string[]>([]);

  useEffect(() => {
    const savedTlds = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedTlds) {
      setTlds(JSON.parse(savedTlds));
    }
  }, []);

  const addTlds = (newTlds: string) => {
    if (!newTlds) return false;

    const tldList = newTlds
      .split('\n')
      .map((tld) => tld.trim().toLowerCase().replace(/^\./, ''))
      .filter((tld) => tld);

    const uniqueTlds = [...new Set([...tlds, ...tldList])];
    setTlds(uniqueTlds);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(uniqueTlds));
    return true;
  };

  const removeTld = (tld: string) => {
    const updatedTlds = tlds.filter((t) => t !== tld);
    setTlds(updatedTlds);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTlds));
  };

  return {
    tlds,
    addTlds,
    removeTld,
  };
}
