
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import StaffTable from "@/components/staff/StaffTable";
import { StaffMember } from "@/types/staffTypes";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

// Sample staff data
const sampleStaff: StaffMember[] = [
  {
    id: "1",
    franchise_id: "f1",
    full_name: "Aditya Sharma",
    designation: "Chef",
    contact_number: "+91 98765 43210",
    email: "chef.aditya@flydining.com",
    telegram_id: "chefadi",
    telegram_access: true,
    access_level: "Staff",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    department: "Kitchen"
  },
  {
    id: "2",
    franchise_id: "f1",
    full_name: "Priya Patel",
    designation: "Host",
    contact_number: "+91 87654 32109",
    email: "priya@flydining.com",
    telegram_id: "priyahost",
    telegram_access: true,
    access_level: "Staff",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    department: "Hospitality"
  },
  {
    id: "3",
    franchise_id: "f1",
    full_name: "Rajan Malhotra",
    designation: "Manager",
    contact_number: "+91 76543 21098",
    email: "rajan@flydining.com",
    telegram_id: "rajanmgr",
    telegram_access: true,
    access_level: "Manager",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    department: "Management"
  },
  {
    id: "4",
    franchise_id: "f2",
    full_name: "Neha Singh",
    designation: "Safety Officer",
    contact_number: "+91 65432 10987",
    email: "neha@flydining.com",
    telegram_id: "nehasafety",
    telegram_access: true,
    access_level: "Staff",
    status: "inactive",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    department: "Security"
  },
  {
    id: "5",
    franchise_id: "f1",
    full_name: "Vikram Kapoor",
    designation: "DJ",
    contact_number: "+91 54321 09876",
    email: "vikram@flydining.com",
    telegram_id: "djvikram",
    telegram_access: false,
    access_level: "Staff",
    status: "training",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    department: "Entertainment"
  }
];

interface StaffDirectoryProps {
  initialFranchiseId?: string;
  onAddStaff: () => void;
  onEditStaff: (staffId: string) => void;
  onViewProfile: (staff: StaffMember) => void;
}

const StaffDirectory: React.FC<StaffDirectoryProps> = ({
  initialFranchiseId,
  onAddStaff,
  onEditStaff,
  onViewProfile
}) => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<StaffMember[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [designationFilter, setDesignationFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  
  // Fetch staff members
  useEffect(() => {
    fetchStaff();
  }, [initialFranchiseId]);
  
  const fetchStaff = async () => {
    try {
      setLoading(true);
      // In a real app, we'd fetch from Supabase here
      // For now, use the sample data
      setTimeout(() => {
        const franchiseStaff = initialFranchiseId
          ? sampleStaff.filter(staff => staff.franchise_id === initialFranchiseId)
          : sampleStaff;
        
        setStaffMembers(franchiseStaff);
        setFilteredStaff(franchiseStaff);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast.error("Failed to load staff data");
      setLoading(false);
    }
  };
  
  // Apply filters when any filter changes
  useEffect(() => {
    let result = [...staffMembers];
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(staff => 
        staff.full_name.toLowerCase().includes(query) || 
        staff.email.toLowerCase().includes(query) ||
        staff.designation.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(staff => staff.status === statusFilter);
    }
    
    // Apply designation filter
    if (designationFilter !== "all") {
      result = result.filter(staff => staff.designation === designationFilter);
    }
    
    // Apply tab filter
    if (activeTab !== "all") {
      result = result.filter(staff => staff.status === activeTab);
    }
    
    setFilteredStaff(result);
  }, [staffMembers, searchQuery, statusFilter, designationFilter, activeTab]);
  
  // Handle status change
  const handleStatusChange = async (staffId: string, newStatus: string) => {
    try {
      // In a real app, we'd update in Supabase here
      setStaffMembers(prevStaff => 
        prevStaff.map(staff => 
          staff.id === staffId ? { ...staff, status: newStatus as any } : staff
        )
      );
      toast.success("Staff status updated successfully");
    } catch (error) {
      console.error("Error updating staff status:", error);
      toast.error("Failed to update staff status");
    }
  };
  
  // Get unique designations for the filter dropdown
  const designations = ["all", ...new Set(staffMembers.map(staff => staff.designation))];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9"
            />
          </div>
          
          <Select value={designationFilter} onValueChange={setDesignationFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {designations.filter(d => d !== "all").map((designation) => (
                <SelectItem key={designation} value={designation}>
                  {designation}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="on_leave">On Leave</SelectItem>
              <SelectItem value="training">Training</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Staff</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="on_leave">On Leave</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <StaffTable 
        filteredStaff={filteredStaff}
        onAddStaff={onAddStaff}
        onViewProfile={onViewProfile}
        onEditStaff={onEditStaff}
        handleStatusChange={handleStatusChange}
        activeTab={activeTab}
      />
    </div>
  );
};

export default StaffDirectory;
