
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lead } from "@/types/leadTypes";
import { mockFranchiseStaff } from "@/hooks/lead/mockLeadData";
import { useUserRole } from "@/providers/UserRoleProvider";

interface ReassignLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
  onReassign: (leadId: string, assignedTo: string) => Promise<boolean>;
}

export function ReassignLeadDialog({
  open,
  onOpenChange,
  lead,
  onReassign
}: ReassignLeadDialogProps) {
  const { currentUser } = useUserRole();
  const [assignedTo, setAssignedTo] = useState(lead.assigned_to || "");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (assignedTo) {
      const result = await onReassign(lead.id, assignedTo);
      if (result) {
        onOpenChange(false);
      }
    }
  };
  
  // Filter staff based on franchise and user role
  const availableStaff = mockFranchiseStaff.filter(staff => {
    if (currentUser?.role === "superadmin") {
      return true;
    } else {
      return staff.franchise_id === lead.franchise_id;
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reassign Lead</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Lead:</span> {lead.name}
              </div>
              <div className="text-sm">
                <span className="font-medium">Current Assignee:</span> {
                  lead.assigned_to
                    ? mockFranchiseStaff.find(staff => staff.id === lead.assigned_to)?.name || 'Unknown'
                    : 'Unassigned'
                }
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="assignedTo" className="text-sm font-medium">
                Reassign To:
              </label>
              <Select
                value={assignedTo}
                onValueChange={(value) => setAssignedTo(value)}
                required
              >
                <SelectTrigger id="assignedTo">
                  <SelectValue placeholder="Select Staff Member" />
                </SelectTrigger>
                <SelectContent>
                  {availableStaff.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {staff.name} - {staff.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Reassign</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
