
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Users, 
  Tag, 
  PanelRight,
  Pencil,
  Power,
  Copy,
  Check,
  X
} from 'lucide-react';
import { Session } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface SessionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session;
  onEdit: () => void;
  onDeactivate: () => void;
  onClone: () => void;
}

export function SessionDetailModal({
  isOpen,
  onClose,
  session,
  onEdit,
  onDeactivate,
  onClone,
}: SessionDetailModalProps) {
  // Format date display
  const formattedDate = session.date ? format(parseISO(session.date), 'EEEE, MMMM d, yyyy') : 'No date';
  
  // Calculate utilization rate
  const utilizationRate = session.maxCapacity > 0 
    ? Math.round((session.bookedCount / session.maxCapacity) * 100) 
    : 0;
  
  // Format time ago for created and updated
  const getTimeAgo = (dateStr?: string) => {
    if (!dateStr) return 'Unknown';
    try {
      return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
    } catch (error) {
      return dateStr;
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-xl">{session.name}</span>
            <Badge variant={session.isActive ? "success" : "destructive"}>
              {session.isActive ? "Active" : "Inactive"}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-2">Basic Information</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 mr-2 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">{formattedDate}</div>
                      <div className="text-sm text-muted-foreground">
                        {session.isSpecialDate && 
                          <Badge variant="secondary" className="mt-1">Special Date</Badge>
                        }
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-muted-foreground" />
                    <div>
                      <div>{session.startTime}</div>
                      <div className="text-sm text-muted-foreground">
                        Duration: {session.duration} minutes
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-muted-foreground" />
                    <div>
                      <div>
                        {session.bookedCount} / {session.maxCapacity} Guests
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {utilizationRate}% utilization
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Tag className="w-5 h-5 mr-2 text-muted-foreground" />
                    <div>
                      <div>{session.type}</div>
                      {session.isSpecialDate && session.specialDateName && (
                        <div className="text-sm text-muted-foreground">
                          {session.specialDateName}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {(session.specialPricing || session.specialAddOns?.length) && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-2">Special Options</h3>
                  
                  {session.specialPricing && (
                    <div className="flex items-center mb-2">
                      <span className="text-muted-foreground mr-2">Price:</span>
                      <span className="font-medium">${session.specialPricing.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {session.specialAddOns && session.specialAddOns.length > 0 && (
                    <div>
                      <span className="text-muted-foreground mb-1 block">Add-on packages:</span>
                      <div className="flex flex-wrap gap-1">
                        {session.specialAddOns.map((addon, i) => (
                          <Badge variant="outline" key={i}>{addon}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="space-y-4">
            {session.specialConditions && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-2">Special Conditions</h3>
                  <p className="text-sm">{session.specialConditions}</p>
                </CardContent>
              </Card>
            )}
            
            {session.notes && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-2">Notes</h3>
                  <p className="text-sm">{session.notes}</p>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-2">Session History</h3>
                
                <div className="space-y-2 text-sm">
                  {session.createdAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Created</span>
                      <span>{getTimeAgo(session.createdAt)}</span>
                    </div>
                  )}
                  
                  {session.updatedAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Last updated</span>
                      <span>{getTimeAgo(session.updatedAt)}</span>
                    </div>
                  )}
                  
                  {!session.isActive && session.deactivatedAt && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Deactivated</span>
                        <span>{getTimeAgo(session.deactivatedAt)}</span>
                      </div>
                      
                      {session.deactivationReason && (
                        <div className="mt-1">
                          <span className="text-muted-foreground block mb-1">Reason:</span>
                          <p className="text-sm bg-muted p-2 rounded">
                            {session.deactivationReason}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between flex-row">
          <Button variant="outline" onClick={onClone} className="flex items-center gap-1">
            <Copy className="h-4 w-4" /> Clone
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-1" /> Close
            </Button>
            <Button variant="default" onClick={onEdit} className="flex items-center gap-1">
              <Pencil className="h-4 w-4" /> Edit
            </Button>
            {session.isActive && (
              <Button variant="destructive" onClick={onDeactivate} className="flex items-center gap-1">
                <Power className="h-4 w-4" /> Deactivate
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
