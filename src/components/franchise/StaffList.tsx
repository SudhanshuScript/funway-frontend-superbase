import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StaffMember, EmployeeDB, mapEmployeeToStaffMember, getAccessLevelColor } from "@/types";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
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
import { useAuditLogger } from "@/utils/auditLogger";

interface StaffListProps {
  franchiseId: string;
  franchiseName: string;
}

export default function StaffList({ franchiseId, franchiseName }: StaffListProps) {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [staffToDelete, setStaffToDelete] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { logEvent } = useAuditLogger();

  useEffect(() => {
    fetchStaffMembers();
  }, [franchiseId]);

  const fetchStaffMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .eq("franchise_id", franchiseId);
        
      if (error) throw error;
      
      const staffMembers = (data as EmployeeDB[] || []).map(mapEmployeeToStaffMember);
      setStaff(staffMembers);
    } catch (error) {
      console.error("Error fetching staff members:", error);
      toast.error("Failed to load staff members");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaffClick = () => {
    navigate(`/franchises/${franchiseId}/staff/add`);
  };

  const handleEditStaffClick = (staffId: string) => {
    navigate(`/franchises/${franchiseId}/staff/${staffId}/edit`);
  };

  const handleDeleteStaffClick = (staffId: string) => {
    setStaffToDelete(staffId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteStaff = async () => {
    if (!staffToDelete) return;
    
    try {
      const { error } = await supabase
        .from("employees")
        .delete()
        .eq("id", staffToDelete);
        
      if (error) throw error;
      
      logEvent("employees", staffToDelete, "deleted");
      
      toast.success("Staff member deleted successfully");
      setStaff((prevStaff) => prevStaff.filter(s => s.id !== staffToDelete));
    } catch (error) {
      console.error("Error deleting staff member:", error);
      toast.error("Failed to delete staff member");
    } finally {
      setDeleteDialogOpen(false);
      setStaffToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Staff Members</h3>
        <Button onClick={handleAddStaffClick} size="sm">
          <PlusCircle className="h-4 w-4 mr-2" /> Add Staff
        </Button>
      </div>
      
      {staff.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed rounded-md">
          <p className="text-muted-foreground mb-4">No staff members yet.</p>
          <Button onClick={handleAddStaffClick}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Staff Member
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Access Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.full_name}</TableCell>
                <TableCell>{member.designation}</TableCell>
                <TableCell>
                  <div>
                    <div>{member.contact_number}</div>
                    <div className="text-xs text-muted-foreground">{member.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getAccessLevelColor(member.access_level)}>
                    {member.access_level}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={member.status === "active" ? "default" : "secondary"}>
                    {member.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEditStaffClick(member.id)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteStaffClick(member.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the staff member's account and remove their access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteStaff} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
