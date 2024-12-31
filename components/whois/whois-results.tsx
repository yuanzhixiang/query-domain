import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { WhoisResult } from '@/hooks/use-whois-query';
import { parseWhoisData } from '@/lib/whois-parser';
import { CheckCircle2, Timer, XCircle } from 'lucide-react';
import { useState } from 'react';
import { WhoisResultRow } from './whois-result-row';

export interface WhoisResultsProps {
  results: WhoisResult[];
}

export function WhoisResults({ results }: WhoisResultsProps) {
  const [selectedDomain, setSelectedDomain] = useState<WhoisResult | null>(
    null,
  );

  if (results.length === 0) return null;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Domain</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result) => (
            <WhoisResultRow
              key={result.domain}
              result={result}
              onViewDetails={setSelectedDomain}
            />
          ))}
        </TableBody>
      </Table>

      <Dialog
        open={selectedDomain !== null}
        onOpenChange={() => setSelectedDomain(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>WHOIS Result - {selectedDomain?.domain}</DialogTitle>
          </DialogHeader>

          {selectedDomain?.status === 'success' && (
            <Tabs defaultValue="parsed" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="parsed">Parsed Information</TabsTrigger>
                <TabsTrigger value="raw">Raw Data</TabsTrigger>
              </TabsList>

              <TabsContent
                value="parsed"
                className="mt-4 overflow-y-auto max-h-[60vh]"
              >
                <div className="space-y-4">
                  {(() => {
                    const whoisInfo = parseWhoisData(selectedDomain.result.raw);
                    return (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="text-sm font-medium">
                              Registration Status
                            </div>
                            <div className="flex items-center gap-2">
                              {whoisInfo.registered ? (
                                <>
                                  <XCircle className="h-4 w-4 text-red-500" />
                                  <span>Registered</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  <span>Available</span>
                                </>
                              )}
                            </div>
                          </div>

                          {whoisInfo.creationDate && (
                            <div className="space-y-2">
                              <div className="text-sm font-medium">
                                Creation Date
                              </div>
                              <div>
                                {whoisInfo.creationDate.toLocaleDateString()}
                              </div>
                            </div>
                          )}

                          {whoisInfo.lastUpdate && (
                            <div className="space-y-2">
                              <div className="text-sm font-medium">
                                Last Update
                              </div>
                              <div>
                                {whoisInfo.lastUpdate.toLocaleDateString()}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm font-medium">WHOIS Data</div>
                          <div className="rounded-md border">
                            <Table>
                              <TableBody className="divide-y">
                                {Object.entries(whoisInfo.whoisData).map(
                                  ([key, value]) => (
                                    <TableRow
                                      key={key}
                                      className="hover:bg-muted/50"
                                    >
                                      <TableHead className="font-medium w-1/3">
                                        {key}
                                      </TableHead>
                                      <TableHead className="font-normal">
                                        {value}
                                      </TableHead>
                                    </TableRow>
                                  ),
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </TabsContent>

              <TabsContent
                value="raw"
                className="mt-4 overflow-y-auto max-h-[60vh]"
              >
                <div className="rounded-md border bg-muted p-4">
                  <pre className="whitespace-pre-wrap text-sm">
                    {selectedDomain.result.raw}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
