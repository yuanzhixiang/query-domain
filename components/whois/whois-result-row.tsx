import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import type { WhoisResult } from '@/hooks/use-whois-query';
import { parseWhoisData } from '@/lib/whois-parser';
import {
  Calendar,
  CheckCircle2,
  ExternalLink,
  Timer,
  XCircle,
} from 'lucide-react';

interface WhoisResultRowProps {
  result: WhoisResult;
  onViewDetails: (result: WhoisResult) => void;
}

const getStatusIcon = (status: WhoisResult['status']) => {
  switch (status) {
    case 'success':
      return <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />;
    case 'error':
      return <XCircle className="h-3.5 w-3.5 text-red-500" />;
    case 'pending':
      return <Timer className="h-3.5 w-3.5 text-yellow-500 animate-pulse" />;
  }
};

export function WhoisResultRow({ result, onViewDetails }: WhoisResultRowProps) {
  const whoisInfo = result.status === 'success' ? parseWhoisData(result.result.raw) : null;

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="py-1">
        <div className="flex items-center gap-4 w-full">
          <div className="w-[200px] truncate">
            <span className="font-medium">{result.domain}</span>
          </div>
          {result.status === 'success' && (
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                {whoisInfo?.registered ? (
                  <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                ) : (
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                )}
              </div>
              {whoisInfo?.registered && whoisInfo?.creationDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {whoisInfo.creationDate.toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell className="py-1">
        <div className="flex items-center gap-1.5 w-[60px]">
          {getStatusIcon(result.status)}
        </div>
      </TableCell>
      <TableCell className="py-1 w-[40px]">
        <div className="flex justify-end">
          {result.status !== 'pending' && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onViewDetails(result)}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          )}
          {result.status === 'pending' && <div className="h-6 w-6" />}
        </div>
      </TableCell>
    </TableRow>
  );
}
