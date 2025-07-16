
import React, { useState, useEffect } from "react";
import { format, addDays } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  GraduationCap,
  Calendar,
  Plus,
  Download,
  FileCheck,
  Loader2,
  AlertCircle,
  Clock,
  XCircle,
  Upload
} from "lucide-react";
import {
  StaffMember,
  StaffTraining,
  TrainingStatus,
  COMMON_TRAINING_PROGRAMS,
  StaffDesignation,
  StaffAccessLevel,
  StaffStatus,
  TRAINING_VALIDITY_DEFAULTS
} from "@/types/staffTypes";
import { useUserRole } from "@/providers/UserRoleProvider";

interface TrainingManagerProps {
  franchiseId?: string;
  staffId?: string;
}

const TrainingManager: React.FC<TrainingManagerProps> = ({ franchiseId, staffId }) => {
  const { currentUser } = useUserRole();
  const [isLoading, setIsLoading] = useState(true);
  const [trainings, setTrainings] = useState<StaffTraining[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [showNewTrainingDialog, setShowNewTrainingDialog] = useState(false);
  const [savingTraining, setSavingTraining] = useState(false);

  // New training form data
  const [newTraining, setNewTraining] = useState({
    staff_id: staffId || "",
    training_name: "Food Safety & Hygiene",
    assigned_date: format(new Date(), "yyyy-MM-dd"),
    valid_until: format(addDays(new Date(), TRAINING_VALIDITY_DEFAULTS["Food Safety & Hygiene"]), "yyyy-MM-dd"),
    status: "assigned" as TrainingStatus,
    notes: "",
  });
  
  useEffect(() => {
    if (staffId || franchiseId) {
      fetchData();
    }
  }, [franchiseId, staffId]);
  
  // Update training validity when training name changes
  useEffect(() => {
    if (newTraining.training_name) {
      const days = TRAINING_VALIDITY_DEFAULTS[newTraining.training_name] || TRAINING_VALIDITY_DEFAULTS.Default;
      const validUntil = format(addDays(new Date(newTraining.assigned_date), days), "yyyy-MM-dd");
      setNewTraining(prev => ({
        ...prev,
        valid_until: validUntil
      }));
    }
  }, [newTraining.training_name, newTraining.assigned_date]);

  const fetchData = async () => {
    setIsLoading(true);
    
    try {
      // Since we don't have a staff_training table yet, use mock data
      const mockTrainings: StaffTraining[] = [
        {
          id: '1',
          staff_id: staffId || 'staff-1',
          training_name: 'Food Safety & Hygiene',
          assigned_date: format(new Date(), "yyyy-MM-dd"),
          completion_date: format(addDays(new Date(), 5), "yyyy-MM-dd"),
          valid_until: format(addDays(new Date(), 365), "yyyy-MM-dd"),
          status: 'completed',
          assigned_by: currentUser?.id || 'admin',
          staff_name: 'John Doe',
          staff_role: 'Chef'
        },
        {
          id: '2',
          staff_id: staffId || 'staff-2',
          training_name: 'Fire Safety',
          assigned_date: format(addDays(new Date(), -30), "yyyy-MM-dd"),
          valid_until: format(addDays(new Date(), 150), "yyyy-MM-dd"),
          status: 'assigned',
          assigned_by: currentUser?.id || 'admin',
          staff_name: 'Jane Smith',
          staff_role: 'Manager'
        },
        {
          id: '3',
          staff_id: staffId || 'staff-1',
          training_name: 'First Aid',
          assigned_date: format(addDays(new Date(), -180), "yyyy-MM-dd"),
          completion_date: format(addDays(new Date(), -175), "yyyy-MM-dd"),
          valid_until: format(addDays(new Date(), -10), "yyyy-MM-dd"),
          status: 'expired',
          assigned_by: currentUser?.id || 'admin',
          staff_name: 'John Doe',
          staff_role: 'Chef'
        }
      ];
      
      setTrainings(mockTrainings);
      
      // If franchise is specified, fetch available staff for that franchise
      if ((franchiseId || currentUser?.franchiseId) && !staffId) {
        const targetFranchiseId = franchiseId || currentUser?.franchiseId;
        
        const { data: staffData, error: staffError } = await supabase
          .from("employees")
          .select("*")
          .eq("franchise_id", targetFranchiseId)
          .eq("status", "active");
          
        if (staffError) throw staffError;
        
        if (staffData) {
          const mappedStaff: StaffMember[] = staffData.map(employee => ({
            id: employee.id,
            franchise_id: employee.franchise_id || '',
            full_name: employee.name,
            designation: (employee.role as StaffDesignation) || 'Manager',
            contact_number: employee.phone || '',
            email: employee.email || '',
            telegram_id: employee.telegram_id,
            // Set a default value for telegram_access since it doesn't exist in DB
            telegram_access: false,
            ip_restrictions: employee.ip_restrictions || [],
            access_level: (employee.access_level as StaffAccessLevel) || 'Staff',
            status: (employee.status as StaffStatus) || 'active',
            created_at: employee.created_at || new Date().toISOString(),
          }));
          
          setStaffMembers(mappedStaff);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load training data");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateTraining = () => {
    setNewTraining({
      staff_id: staffId || "",
      training_name: "Food Safety & Hygiene",
      assigned_date: format(new Date(), "yyyy-MM-dd"),
      valid_until: format(addDays(new Date(), TRAINING_VALIDITY_DEFAULTS["Food Safety & Hygiene"]), "yyyy-MM-dd"),
      status: "assigned",
      notes: "",
    });
    setShowNewTrainingDialog(true);
  };
  
  const handleTrainingFormChange = (key: string, value: string) => {
    setNewTraining(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveTraining = async () => {
    // Validate form
    if (!newTraining.staff_id && !staffId) {
      toast.error("Please select a staff member");
      return;
    }
    
    if (!newTraining.assigned_date) {
      toast.error("Please select an assigned date");
      return;
    }
    
    if (!newTraining.valid_until) {
      toast.error("Please select a valid until date");
      return;
    }
    
    setSavingTraining(true);
    
    try {
      // Since we don't have a staff_training table, just mock saving
      toast.success("Training assigned successfully (mock)");
      setShowNewTrainingDialog(false);
      
      // Add mock training to our local state
      const newMockTraining: StaffTraining = {
        id: Date.now().toString(),
        staff_id: staffId || newTraining.staff_id,
        training_name: newTraining.training_name,
        assigned_date: newTraining.assigned_date,
        valid_until: newTraining.valid_until,
        status: newTraining.status,
        notes: newTraining.notes,
        assigned_by: currentUser?.id || 'admin',
        staff_name: staffMembers.find(s => s.id === (staffId || newTraining.staff_id))?.full_name || 'Unknown',
        staff_role: staffMembers.find(s => s.id === (staffId || newTraining.staff_id))?.designation || 'Staff'
      };
      
      setTrainings(prev => [...prev, newMockTraining]);
    } catch (error: any) {
      console.error("Error saving training:", error);
      toast.error(`Failed to assign training: ${error.message}`);
    } finally {
      setSavingTraining(false);
    }
  };
  
  const handleDeleteTraining = async (trainingId: string) => {
    try {
      // Since we don't have a staff_training table, just remove from local state
      toast.success("Training removed successfully (mock)");
      
      // Update local state
      setTrainings(trainings.filter(training => training.id !== trainingId));
    } catch (error: any) {
      console.error("Error deleting training:", error);
      toast.error(`Failed to remove training: ${error.message}`);
    }
  };
  
  const handleMarkComplete = async (trainingId: string) => {
    try {
      // Since we don't have a staff_training table, just update local state
      const updatedTrainings = trainings.map(training => {
        if (training.id === trainingId) {
          return {
            ...training,
            status: 'completed' as TrainingStatus,
            completion_date: format(new Date(), "yyyy-MM-dd")
          };
        }
        return training;
      });
      
      setTrainings(updatedTrainings);
      toast.success("Training marked as completed (mock)");
    } catch (error: any) {
      console.error("Error updating training:", error);
      toast.error(`Failed to update training: ${error.message}`);
    }
  };
  
  const handleExportTrainings = () => {
    // Create CSV data
    const headers = ["Staff Name", "Role", "Training Name", "Assigned Date", "Completion Date", "Valid Until", "Status"];
    const csvRows = [headers];
    
    trainings.forEach(training => {
      const row = [
        training.staff_name || "Unknown",
        training.staff_role || "Staff",
        training.training_name,
        training.assigned_date,
        training.completion_date || "",
        training.valid_until || "",
        training.status
      ];
      csvRows.push(row);
    });
    
    // Convert to CSV string
    const csvContent = "data:text/csv;charset=utf-8," + 
      csvRows.map(row => row.join(",")).join("\n");
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `training_report_${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const getStatusBadge = (status: TrainingStatus) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'assigned':
        return <Badge className="bg-blue-100 text-blue-800">Assigned</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
      case 'not_required':
        return <Badge className="bg-gray-100 text-gray-800">Not Required</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const isExpired = (validUntil?: string) => {
    if (!validUntil) return false;
    const today = new Date();
    const expiry = new Date(validUntil);
    return expiry < today;
  };
  
  const isExpiringWithin30Days = (validUntil?: string) => {
    if (!validUntil) return false;
    const today = new Date();
    const expiry = new Date(validUntil);
    const days30 = new Date();
    days30.setDate(days30.getDate() + 30);
    return expiry > today && expiry <= days30;
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading training data...</p>
      </div>
    );
  }

  // Simplified return for mockup
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <GraduationCap className="h-5 w-5 mr-2" />
          <h3 className="text-lg font-medium">Training & Compliance</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button onClick={handleExportTrainings} variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
          
          <Button onClick={handleCreateTraining}>
            <Plus className="h-4 w-4 mr-1" />
            Assign Training
          </Button>
        </div>
      </div>

      {trainings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <GraduationCap className="h-10 w-10 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium mb-2">No Training Records</h3>
            <p className="text-sm text-muted-foreground max-w-md text-center mb-6">
              {staffId 
                ? "This staff member has no training records yet. Assign training programs to track their certifications and compliance."
                : "No training records found. Assign training programs to staff members to track their certifications and compliance."
              }
            </p>
            <Button onClick={handleCreateTraining}>
              <Plus className="h-4 w-4 mr-1" />
              Assign Training
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Training Program</TableHead>
              {!staffId && <TableHead>Staff Name</TableHead>}
              <TableHead>Assigned</TableHead>
              <TableHead>Completed</TableHead>
              <TableHead>Valid Until</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trainings.map((training) => (
              <TableRow key={training.id}>
                <TableCell className="font-medium">{training.training_name}</TableCell>
                {!staffId && (
                  <TableCell>{training.staff_name}</TableCell>
                )}
                <TableCell>{training.assigned_date}</TableCell>
                <TableCell>{training.completion_date || "-"}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="mr-2">{training.valid_until || "-"}</span>
                    {isExpired(training.valid_until) && (
                      <Badge variant="destructive" className="text-xs">Expired</Badge>
                    )}
                    {isExpiringWithin30Days(training.valid_until) && (
                      <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">Expiring Soon</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(training.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {training.status === 'assigned' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 gap-1"
                        onClick={() => handleMarkComplete(training.id)}
                      >
                        <FileCheck className="h-4 w-4" />
                        <span className="hidden md:inline">Complete</span>
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8"
                      onClick={() => handleDeleteTraining(training.id)}
                    >
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      
      {/* New Training Dialog */}
      <Dialog open={showNewTrainingDialog} onOpenChange={setShowNewTrainingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign New Training</DialogTitle>
            <DialogDescription>
              Assign training program to staff member.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {!staffId && (
              <div className="grid gap-2">
                <Label htmlFor="staff">Staff Member</Label>
                <Select
                  value={newTraining.staff_id}
                  onValueChange={value => handleTrainingFormChange("staff_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffMembers.map(staff => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.full_name} ({staff.designation})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="training_name">Training Program</Label>
              <Select
                value={newTraining.training_name}
                onValueChange={value => handleTrainingFormChange("training_name", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select training program" />
                </SelectTrigger>
                <SelectContent>
                  {COMMON_TRAINING_PROGRAMS.map(program => (
                    <SelectItem key={program} value={program}>{program}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="assigned_date">Assigned Date</Label>
              <Input
                id="assigned_date"
                type="date"
                value={newTraining.assigned_date}
                onChange={e => handleTrainingFormChange("assigned_date", e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="valid_until">Valid Until</Label>
              <Input
                id="valid_until"
                type="date"
                value={newTraining.valid_until}
                onChange={e => handleTrainingFormChange("valid_until", e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                placeholder="Any special instructions or notes"
                value={newTraining.notes || ""}
                onChange={e => handleTrainingFormChange("notes", e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewTrainingDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTraining} disabled={savingTraining}>
              {savingTraining && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Assign Training
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrainingManager;
