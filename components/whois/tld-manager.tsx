import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Settings } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface TldManagerProps {
  tlds: string[];
  onAddTlds: (newTlds: string) => boolean;
  onRemoveTld: (tld: string) => void;
}

export function TldManager({ tlds, onAddTlds, onRemoveTld }: TldManagerProps) {
  const [showAddTldDialog, setShowAddTldDialog] = useState(false);
  const [newTlds, setNewTlds] = useState('');

  const handleAddCustomTlds = () => {
    if (onAddTlds(newTlds)) {
      setNewTlds('');
      setShowAddTldDialog(false);
      toast.success('TLDs updated');
    } else {
      toast.error('Please enter TLDs');
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium leading-none">Configured TLDs</h4>
            <Dialog open={showAddTldDialog} onOpenChange={setShowAddTldDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Manage TLDs</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="tlds">
                      Enter TLDs (one per line, without dot)
                    </Label>
                    <Textarea
                      id="tlds"
                      placeholder="com&#10;net&#10;org"
                      value={newTlds}
                      onChange={(e) => setNewTlds(e.target.value)}
                      className="h-[200px] font-mono"
                    />
                    <Button onClick={handleAddCustomTlds}>Update TLDs</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex flex-wrap gap-2">
            {tlds.map((tld) => (
              <div key={tld} className="flex items-center gap-1">
                <span className="rounded-md border px-2.5 py-0.5 text-sm">
                  .{tld}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-red-500 hover:text-red-600"
                  onClick={() => {
                    onRemoveTld(tld);
                    toast.success('TLD removed');
                  }}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
