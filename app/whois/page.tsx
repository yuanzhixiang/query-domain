'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TldManager } from '@/components/whois/tld-manager';
import { WhoisResults } from '@/components/whois/whois-results';
import { useTldStore } from '@/hooks/use-tld-store';
import { useWhoisQuery } from '@/hooks/use-whois-query';
import { useState } from 'react';

export default function WhoisPage() {
  const [domain, setDomain] = useState('');
  const { tlds, addTlds, removeTld } = useTldStore();
  const { loading, results, queryDomains } = useWhoisQuery();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    queryDomains(domain, tlds);
  };

  return (
    <div className="container mx-auto max-w-4xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>WHOIS Domain Lookup</CardTitle>
          <CardDescription>
            Enter a domain name without TLD and select TLDs to query multiple
            domains at once.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="domain">Domain Name (without TLD)</Label>
                  <TldManager
                    tlds={tlds}
                    onAddTlds={addTlds}
                    onRemoveTld={removeTld}
                  />
                </div>
                <Input
                  id="domain"
                  placeholder="example"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !domain || tlds.length === 0}
              >
                {loading ? 'Querying...' : 'Query'}
              </Button>
            </form>

            <WhoisResults results={results} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
