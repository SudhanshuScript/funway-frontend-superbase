
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Trash2, Plus, Shield } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuditLogger } from '@/utils/auditLogger';
import { supabase } from '@/integrations/supabase/client';
import { IpRestriction } from '@/types/franchise';

interface IpRestrictionManagerProps {
  franchiseId: string;
  franchiseName: string;
}

const IpRestrictionManager: React.FC<IpRestrictionManagerProps> = ({ franchiseId, franchiseName }) => {
  const [ipRestrictions, setIpRestrictions] = useState<IpRestriction[]>([]);
  const [newIp, setNewIp] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { logEvent } = useAuditLogger();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real application, we would fetch IP restrictions from the database
    // For now, we'll use dummy data
    setIpRestrictions([
      { ip: '192.168.1.1', description: 'Office IP', added_by: 'Admin', added_at: '2025-01-15T12:00:00Z' },
      { ip: '10.0.0.5', description: 'Remote office', added_by: 'System', added_at: '2025-01-20T14:30:00Z' },
    ]);
    setIsLoading(false);
  }, [franchiseId]);

  const handleAddIp = () => {
    if (!newIp) {
      toast.error('Please enter an IP address');
      return;
    }

    // Validate IP format (simple validation)
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(newIp)) {
      toast.error('Please enter a valid IP address');
      return;
    }

    const newRestriction: IpRestriction = {
      ip: newIp,
      description: newDescription || 'No description',
      added_by: 'Admin',
      added_at: new Date().toISOString(),
    };

    setIpRestrictions([...ipRestrictions, newRestriction]);
    logEvent('ip_restrictions', franchiseId, 'added', { ip: newIp });
    toast.success('IP restriction added');
    
    // Clear form
    setNewIp('');
    setNewDescription('');
  };

  const handleDelete = (ip: string) => {
    setDeleteId(ip);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setIpRestrictions(ipRestrictions.filter(item => item.ip !== deleteId));
      logEvent('ip_restrictions', franchiseId, 'removed', { ip: deleteId });
      toast.success('IP restriction removed');
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Shield className="mr-2 h-5 w-5" />
            IP Access Restrictions for {franchiseName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Restrict access to this franchise to specific IP addresses. This provides an additional layer of security.
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">IP Address</label>
                <Input
                  placeholder="e.g. 192.168.1.1"
                  value={newIp}
                  onChange={(e) => setNewIp(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">Description</label>
                <Input
                  placeholder="e.g. Office Network"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleAddIp}>
                  <Plus className="h-4 w-4 mr-1" /> Add IP
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : ipRestrictions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Added By</TableHead>
                    <TableHead>Added On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ipRestrictions.map((restriction) => (
                    <TableRow key={restriction.ip}>
                      <TableCell className="font-medium">{restriction.ip}</TableCell>
                      <TableCell>{restriction.description}</TableCell>
                      <TableCell>{restriction.added_by}</TableCell>
                      <TableCell>{new Date(restriction.added_at || '').toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(restriction.ip)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 border rounded-md">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No IP restrictions have been added yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Access is currently allowed from any IP address
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove IP Restriction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this IP restriction? This will allow access from this IP address immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default IpRestrictionManager;
