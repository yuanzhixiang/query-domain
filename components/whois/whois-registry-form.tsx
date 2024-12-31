'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
  tld: z.string().min(1, 'TLD is required'),
  whoisServer: z.string().min(1, 'WHOIS server is required'),
  rdapServer: z.string().optional(),
});

type WhoisRegistryFormProps = {
  initialData?: {
    id?: number;
    tld: string;
    whoisServer: string;
    rdapServer?: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
};

export function WhoisRegistryForm({
  initialData,
  onSuccess,
  onCancel,
}: WhoisRegistryFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tld: initialData?.tld || '',
      whoisServer: initialData?.whoisServer || '',
      rdapServer: initialData?.rdapServer || '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch('/api/whois-registry', {
        method: initialData?.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(initialData?.id ? { ...values, id: initialData.id } : values),
      });

      const data = await response.json();
      if (data.code === 2000) {
        toast.success(initialData?.id ? 'Registry updated' : 'Registry created');
        onSuccess();
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Failed to save registry:', error);
      toast.error('Failed to save registry');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="tld"
          render={({ field }) => (
            <FormItem>
              <FormLabel>TLD</FormLabel>
              <FormControl>
                <Input placeholder="com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="whoisServer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WHOIS Server</FormLabel>
              <FormControl>
                <Input placeholder="whois.verisign-grs.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rdapServer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>RDAP Server (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://rdap.verisign.com/com/v1/" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData?.id ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
