import React, { useState, useEffect } from "react";
import { format, parseISO, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isWithinInterval } from "date-fns";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Loader2,
  Plus,
  User,
  XCircle
} from "lucide-react";
import { 
  StaffMember, 
  StaffShift, 
  ShiftType, 
  StaffDesignation, 
  StaffAccessLevel, 
  StaffStatus 
} from "@/types/staffTypes";
import { useUserRole } from "@/providers/UserRoleProvider";

interface ShiftManagerProps {
  franchiseId?: string;
  staffId?: string;
}

// Shift types and their time ranges
const SHIFT_TIMES: Record<ShiftType, { start: string; end: string }> = {
  morning: { start: "08:00", end: "12:00" },
  afternoon: { start: "12:00", end: "17:00" },
  evening: { start: "17:00", end: "22:00" },
  night: { start: "22:00", end: "02:00" }
};

const ShiftManager: React.FC<ShiftManagerProps> = ({ franchiseId, staffId }) => {
  const { currentUser } = useUserRole();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"week" | "day">("week");
  const [isLoading, setIsLoading] = useState(true);
  const [shifts, setShifts] = useState<StaffShift[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [showNewShiftDialog, setShowNewShiftDialog] = useState(false);
  const [savingShift, setSavingShift] = useState(false);
  
  // New shift form data
  const [newShift, setNewShift] = useState({
    staff_id: staffId || "",
    date: format(currentDate, "yyyy-MM-dd"),
    shift_type: "morning" as ShiftType,
    start_time: SHIFT_TIMES.morning.start,
    end_time: SHIFT_TIMES.morning.end,
    notes: ""
  });
  
  const days = eachDayOfInterval({
    start: startOfWeek(currentDate, { weekStartsOn: 1 }),
    end: endOfWeek(currentDate, { weekStartsOn: 1 })
  });

  useEffect(() => {
    if (staffId || franchiseId) {
      fetchData();
    }
  }, [franchiseId, staffId, currentDate]);
  
  // Update shift times when shift type changes
  useEffect(() => {
    if (newShift.shift_type) {
      setNewShift(prev => ({
        ...prev,
        start_time: SHIFT_TIMES[prev.shift_type].start,
        end_time: SHIFT_TIMES[prev.shift_type].end
      }));
    }
  }, [newShift.shift_type]);
  
  const fetchData = async () => {
    setIsLoading(true);
    
    try {
      // Get the date range for the current week
      const startDate = format(startOfWeek(currentDate, { weekStartsOn: 1 }), "yyyy-MM-dd");
      const endDate = format(endOfWeek(currentDate, { weekStartsOn: 1 }), "yyyy-MM-dd");
      
      // Since we don't have shifts table yet, use mock data
      const mockShifts: StaffShift[] = [
        {
          id: '1',
          staff_id: staffId || 'staff-1',
          franchise_id: franchiseId || 'franchise-1',
          date: format(new Date(), "yyyy-MM-dd"),
          start_time: '08:00',
          end_time: '12:00',
          role: 'Chef',
          created_at: new Date().toISOString(),
          staff_name: 'John Doe',
          staff_role: 'Chef',
          notes: ''
        },
        {
          id: '2',
          staff_id: staffId || 'staff-2',
          franchise_id: franchiseId || 'franchise-1',
          date: format(addDays(new Date(), 1), "yyyy-MM-dd"),
          start_time: '12:00',
          end_time: '17:00',
          role: 'Manager',
          created_at: new Date().toISOString(),
          staff_name: 'Jane Smith',
          staff_role: 'Manager',
          notes: ''
        }
      ];
      
      setShifts(mockShifts);
      
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
      toast.error("Failed to load shift data");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePreviousWeek = () => {
    setCurrentDate(prev => addDays(prev, -7));
  };
  
  const handleNextWeek = () => {
    setCurrentDate(prev => addDays(prev, 7));
  };
  
  const handleCreateShift = () => {
    setNewShift({
      staff_id: staffId || "",
      date: format(currentDate, "yyyy-MM-dd"),
      shift_type: "morning",
      start_time: SHIFT_TIMES.morning.start,
      end_time: SHIFT_TIMES.morning.end,
      notes: ""
    });
    setShowNewShiftDialog(true);
  };
  
  const handleShiftFormChange = (key: string, value: string) => {
    setNewShift(prev => ({
      ...prev,
      [key]: value
    }));
    
    // If changing shift type, update times
    if (key === "shift_type" && value in SHIFT_TIMES) {
      setNewShift(prev => ({
        ...prev,
        start_time: SHIFT_TIMES[value as ShiftType].start,
        end_time: SHIFT_TIMES[value as ShiftType].end
      }));
    }
  };
  
  const handleSaveShift = async () => {
    // Validate form
    if (!newShift.staff_id && !staffId) {
      toast.error("Please select a staff member");
      return;
    }
    
    if (!newShift.date) {
      toast.error("Please select a date");
      return;
    }
    
    if (!newShift.start_time || !newShift.end_time) {
      toast.error("Please set shift times");
      return;
    }
    
    setSavingShift(true);
    
    try {
      // Mock saving to database since we don't have a shifts table
      toast.success("Shift scheduled successfully (mock)");
      setShowNewShiftDialog(false);
      
      // Add mock shift to our local state
      const newMockShift: StaffShift = {
        id: Date.now().toString(),
        staff_id: staffId || newShift.staff_id,
        franchise_id: franchiseId || currentUser?.franchiseId || '',
        date: newShift.date,
        start_time: newShift.start_time,
        end_time: newShift.end_time,
        role: staffId ? staffMembers.find(s => s.id === staffId)?.designation || "Staff" : "Staff",
        notes: newShift.notes,
        created_at: new Date().toISOString(),
        staff_name: staffMembers.find(s => s.id === (staffId || newShift.staff_id))?.full_name || 'Unknown',
        staff_role: staffMembers.find(s => s.id === (staffId || newShift.staff_id))?.designation || 'Staff'
      };
      
      setShifts(prev => [...prev, newMockShift]);
    } catch (error: any) {
      console.error("Error saving shift:", error);
      toast.error(`Failed to schedule shift: ${error.message}`);
    } finally {
      setSavingShift(false);
    }
  };
  
  const handleDeleteShift = async (shiftId: string) => {
    try {
      // Since we don't have a shifts table, just remove from local state
      toast.success("Shift removed successfully (mock)");
      
      // Update local state
      setShifts(shifts.filter(shift => shift.id !== shiftId));
    } catch (error: any) {
      console.error("Error deleting shift:", error);
      toast.error(`Failed to remove shift: ${error.message}`);
    }
  };
  
  const handleExportSchedule = () => {
    // Create CSV data
    const headers = ["Date", "Staff Name", "Role", "Start Time", "End Time", "Notes"];
    const csvRows = [headers];
    
    shifts.forEach(shift => {
      const row = [
        shift.date,
        shift.staff_name || "Unknown",
        shift.staff_role || "Staff",
        shift.start_time,
        shift.end_time,
        shift.notes || ""
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
    link.setAttribute("download", `shift_schedule_${format(currentDate, "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Get shifts for a specific day
  const getShiftsForDay = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    return shifts.filter(shift => shift.date === dateString);
  };
  
  // Render a shift card
  const renderShiftCard = (shift: StaffShift) => {
    let bgColor = "";
    
    // Assign colors based on shift times
    if (shift.start_time.startsWith("08:")) {
      bgColor = "bg-blue-50 border-blue-200";
    } else if (shift.start_time.startsWith("12:")) {
      bgColor = "bg-amber-50 border-amber-200";
    } else if (shift.start_time.startsWith("17:")) {
      bgColor = "bg-purple-50 border-purple-200";
    } else {
      bgColor = "bg-indigo-50 border-indigo-200";
    }
    
    return (
      <div 
        key={shift.id} 
        className={`p-2 rounded-md border mb-2 ${bgColor} relative`}
      >
        <div className="flex justify-between items-start">
          <div className="font-medium">{shift.staff_name || "Unknown"}</div>
          <button 
            onClick={() => handleDeleteShift(shift.id)} 
            className="text-red-500 hover:text-red-700"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
        <div className="text-xs text-muted-foreground">{shift.staff_role || "Staff"}</div>
        <div className="flex items-center text-xs mt-1">
          <Clock className="h-3 w-3 mr-1" />
          <span>{shift.start_time} - {shift.end_time}</span>
        </div>
        {shift.notes && (
          <div className="text-xs italic text-muted-foreground mt-1 truncate">
            {shift.notes}
          </div>
        )}
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading shift schedule...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          <h3 className="text-lg font-medium">Shift Schedule</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <Tabs
            value={viewMode}
            onValueChange={(value: "week" | "day") => setViewMode(value)}
            className="mr-4"
          >
            <TabsList>
              <TabsTrigger value="week">Week View</TabsTrigger>
              <TabsTrigger value="day">Day View</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center space-x-1">
            <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="w-[140px] text-center font-medium">
              {format(currentDate, "MMMM d, yyyy")}
            </div>
            <Button variant="outline" size="icon" onClick={handleNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Button onClick={handleExportSchedule} variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
          
          <Button onClick={handleCreateShift}>
            <Plus className="h-4 w-4 mr-1" />
            Add Shift
          </Button>
        </div>
      </div>
      
      <div className="bg-muted/20 p-8 rounded-md text-center">
        <p>Shift schedule view is in development.</p>
      </div>
      
      {/* New Shift Dialog */}
      <Dialog open={showNewShiftDialog} onOpenChange={setShowNewShiftDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule New Shift</DialogTitle>
            <DialogDescription>
              Add a new shift to the schedule. Fill in all details below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {!staffId && (
              <div className="grid gap-2">
                <Label htmlFor="staff">Staff Member</Label>
                <Select
                  value={newShift.staff_id}
                  onValueChange={value => handleShiftFormChange("staff_id", value)}
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
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newShift.date}
                onChange={e => handleShiftFormChange("date", e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="shift_type">Shift Type</Label>
              <Select
                value={newShift.shift_type}
                onValueChange={value => handleShiftFormChange("shift_type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select shift type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (12PM - 5PM)</SelectItem>
                  <SelectItem value="evening">Evening (5PM - 10PM)</SelectItem>
                  <SelectItem value="night">Night (10PM - 2AM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start_time">Start Time</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={newShift.start_time}
                  onChange={e => handleShiftFormChange("start_time", e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="end_time">End Time</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={newShift.end_time}
                  onChange={e => handleShiftFormChange("end_time", e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                placeholder="Any special instructions or notes"
                value={newShift.notes}
                onChange={e => handleShiftFormChange("notes", e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewShiftDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveShift} disabled={savingShift}>
              {savingShift && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Schedule Shift
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShiftManager;
