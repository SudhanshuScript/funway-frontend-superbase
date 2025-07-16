
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { UserPlus, Mail, Phone, User, ShieldAlert, Shield, MoreHorizontal, AlertTriangle, Loader2 } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  StaffMember, 
  StaffAccessLevel, 
  StaffStatus, 
  StaffDesignation,
  getAccessLevelColor 
} from "@/types/staffTypes";

interface FranchiseStaffManagerProps {
  franchiseId: string;
  canManage: boolean;
}

const FranchiseStaffManager: React.FC<FranchiseStaffManagerProps> = ({ 
  franchiseId,
  canManage 
}) => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [openStaffDialog, setOpenStaffDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    contact_number: '',
    designation: 'Manager' as StaffDesignation,
    access_level: 'Staff' as StaffAccessLevel,
  });
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  
  // Sample staff data
  const exampleStaff: StaffMember[] = [
    {
      id: "1",
      franchise_id: franchiseId,
      full_name: "Raj Sharma",
      designation: "Chef",
      contact_number: "+91 98765 43210",
      email: "raj.sharma@flydining.com",
      telegram_id: "rajchef",
      telegram_access: true,
      access_level: "Staff",
      status: "active",
      created_at: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
      updated_at: new Date().toISOString(),
      department: "Kitchen"
    },
    {
      id: "2",
      franchise_id: franchiseId,
      full_name: "Priya Patel",
      designation: "Manager",
      contact_number: "+91 87654 32109",
      email: "priya.patel@flydining.com",
      telegram_id: "priyamanager",
      telegram_access: true,
      access_level: "Manager",
      status: "active",
      created_at: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString(),
      updated_at: new Date().toISOString(),
      department: "Management"
    },
    {
      id: "3",
      franchise_id: franchiseId,
      full_name: "Anita Singh",
      designation: "Host",
      contact_number: "+91 76543 21098",
      email: "anita.s@flydining.com",
      telegram_access: false,
      access_level: "Staff",
      status: "on_leave",
      created_at: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString(),
      updated_at: new Date().toISOString(),
      department: "Hospitality"
    },
    {
      id: "4",
      franchise_id: franchiseId,
      full_name: "Vijay Kumar",
      designation: "Safety Officer",
      contact_number: "+91 65432 10987",
      email: "vijay.k@flydining.com",
      telegram_id: "vijaysafety",
      telegram_access: true,
      access_level: "Staff",
      status: "training",
      created_at: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
      updated_at: new Date().toISOString(),
      department: "Security"
    }
  ];
  
  // Fetch staff members
  useEffect(() => {
    fetchStaff();
  }, [franchiseId]);
  
  const fetchStaff = async () => {
    setLoading(true);
    try {
      // In a real app, we would fetch data from Supabase here
      // For now, let's just use our example data
      setTimeout(() => {
        setStaff(exampleStaff);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast.error('Failed to load staff members');
      setLoading(false);
    }
  };
  
  const handleAddStaff = () => {
    setFormMode('add');
    setFormData({
      full_name: '',
      email: '',
      contact_number: '',
      designation: 'Host',
      access_level: 'Staff',
    });
    setOpenStaffDialog(true);
  };
  
  const handleEditStaff = (staffId: string) => {
    const staffMember = staff.find(s => s.id === staffId);
    if (staffMember) {
      setFormMode('edit');
      setSelectedStaffId(staffId);
      setFormData({
        full_name: staffMember.full_name,
        email: staffMember.email,
        contact_number: staffMember.contact_number,
        designation: staffMember.designation,
        access_level: staffMember.access_level,
      });
      setOpenStaffDialog(true);
    }
  };
  
  const handleDeleteStaff = (staffId: string) => {
    setSelectedStaffId(staffId);
    setOpenDeleteDialog(true);
  };
  
  const handleDeleteConfirm = () => {
    // In a real app, we would delete from Supabase here
    if (selectedStaffId) {
      setStaff(staff.filter(s => s.id !== selectedStaffId));
      toast.success("Staff member removed successfully");
    }
    setOpenDeleteDialog(false);
    setSelectedStaffId(null);
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, we would save to Supabase here
    if (formMode === 'add') {
      const newStaff: StaffMember = {
        id: `new-${Date.now()}`,
        franchise_id: franchiseId,
        full_name: formData.full_name,
        designation: formData.designation,
        contact_number: formData.contact_number,
        email: formData.email,
        telegram_access: formData.designation === 'Chef' || formData.designation === 'Manager',
        access_level: formData.access_level,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setStaff([...staff, newStaff]);
      toast.success("New staff member added successfully");
    } else {
      // Update existing staff
      setStaff(staff.map(s => 
        s.id === selectedStaffId ? 
        { 
          ...s, 
          full_name: formData.full_name,
          designation: formData.designation,
          contact_number: formData.contact_number,
          email: formData.email,
          access_level: formData.access_level,
          updated_at: new Date().toISOString(),
        } : s
      ));
      toast.success("Staff member updated successfully");
    }
    
    setOpenStaffDialog(false);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Staff Management</CardTitle>
        {canManage && (
          <Button size="sm" onClick={handleAddStaff}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Staff
          </Button>
        )}
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
          </div>
        ) : staff.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No Staff Members</h3>
            <p className="text-muted-foreground mb-6">
              This franchise doesn't have any staff members yet.
            </p>
            {canManage && (
              <Button onClick={handleAddStaff}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Staff Member
              </Button>
            )}
          </div>
        ) : (
          <div className="border rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Access</TableHead>
                  <TableHead>Status</TableHead>
                  {canManage && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((staffMember) => (
                  <TableRow key={staffMember.id}>
                    <TableCell className="font-medium">{staffMember.full_name}</TableCell>
                    <TableCell>{staffMember.designation}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3.5 w-3.5 opacity-70" />
                          {staffMember.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3.5 w-3.5 opacity-70" />
                          {staffMember.contact_number}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getAccessLevelColor(staffMember.access_level)}>
                        {staffMember.access_level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={staffMember.status === 'active' ? 'default' : 'secondary'}
                        className={
                          staffMember.status === 'active' ? 'bg-green-100 text-green-800' :
                          staffMember.status === 'inactive' ? 'bg-red-100 text-red-800' :
                          staffMember.status === 'on_leave' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }
                      >
                        {staffMember.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    {canManage && (
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditStaff(staffMember.id)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600" 
                              onClick={() => handleDeleteStaff(staffMember.id)}
                            >
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      
      {/* Staff Add/Edit Dialog */}
      <Dialog open={openStaffDialog} onOpenChange={setOpenStaffDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{formMode === 'add' ? 'Add New Staff Member' : 'Edit Staff Member'}</DialogTitle>
            <DialogDescription>
              {formMode === 'add' 
                ? 'Add a new staff member to this franchise.' 
                : 'Update staff member details.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleFormSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input 
                  id="full_name" 
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="contact_number">Contact Number</Label>
                <Input 
                  id="contact_number" 
                  value={formData.contact_number}
                  onChange={(e) => setFormData({...formData, contact_number: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="designation">Designation</Label>
                <Select 
                  value={formData.designation}
                  onValueChange={(value) => setFormData({...formData, designation: value as StaffDesignation})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chef">Chef</SelectItem>
                    <SelectItem value="Host">Host</SelectItem>
                    <SelectItem value="DJ">DJ</SelectItem>
                    <SelectItem value="Safety Officer">Safety Officer</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Photographer">Photographer</SelectItem>
                    <SelectItem value="Waiter">Waiter</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="access_level">Access Level</Label>
                <Select 
                  value={formData.access_level}
                  onValueChange={(value) => setFormData({...formData, access_level: value as StaffAccessLevel})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Staff">Staff</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenStaffDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {formMode === 'add' ? 'Add Staff' : 'Update Staff'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the staff member
              from this franchise.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 text-white">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default FranchiseStaffManager;
