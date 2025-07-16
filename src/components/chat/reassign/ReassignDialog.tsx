
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Conversation } from '@/types/chatTypes';

interface ReassignDialogProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: Conversation | null;
  franchises: { id: string; name: string }[];
  onReassign: (conversationId: string, franchiseId: string) => void;
}

export function ReassignDialog({
  isOpen,
  onClose,
  conversation,
  franchises,
  onReassign
}: ReassignDialogProps) {
  const [selectedFranchiseId, setSelectedFranchiseId] = useState<string>('');

  const handleReassign = () => {
    if (conversation && selectedFranchiseId) {
      onReassign(conversation.id, selectedFranchiseId);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reassign Conversation</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Guest: <span className="font-medium text-foreground">{conversation?.guest_name || 'Unknown'}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Current Franchise: <span className="font-medium text-foreground">{conversation?.franchise_name || 'Unknown'}</span>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="franchise">Reassign to Franchise</Label>
            <Select 
              value={selectedFranchiseId} 
              onValueChange={setSelectedFranchiseId}
            >
              <SelectTrigger id="franchise">
                <SelectValue placeholder="Select franchise" />
              </SelectTrigger>
              <SelectContent>
                {franchises
                  .filter(f => f.id !== conversation?.franchise_id)
                  .map((franchise) => (
                    <SelectItem key={franchise.id} value={franchise.id}>
                      {franchise.name}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
          
          <p className="text-sm text-muted-foreground">
            This will move the conversation and all its messages to the selected franchise.
          </p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleReassign}
            disabled={!selectedFranchiseId || selectedFranchiseId === conversation?.franchise_id}
          >
            Reassign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
