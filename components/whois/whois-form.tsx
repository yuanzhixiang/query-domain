'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { toast } from 'sonner';

export function WhoisForm() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) {
      toast.error('Please enter a domain name');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `/api/whois?domain=${encodeURIComponent(domain)}`,
      );
      const data = await response.json();

      if (data.code === 2000) {
        setResult(data.data.raw);
      } else {
        toast.error('Query failed: ' + data.message);
      }
    } catch (error) {
      toast.error('An error occurred while querying the domain');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid w-full gap-1.5">
        <Label htmlFor="domain">Domain Name</Label>
        <div className="flex gap-2">
          <Input
            id="domain"
            placeholder="Enter domain name (e.g., example.com)"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Querying...' : 'Query'}
          </Button>
        </div>
      </div>

      {result && (
        <div className="grid w-full gap-1.5">
          <Label htmlFor="result">WHOIS Information</Label>
          <Textarea
            id="result"
            className="font-mono h-[400px]"
            value={result}
            readOnly
          />
        </div>
      )}
    </form>
  );
}
