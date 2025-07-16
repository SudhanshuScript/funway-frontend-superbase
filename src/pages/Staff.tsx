
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserRole } from "@/providers/UserRoleProvider";
import { useNavigate } from "react-router-dom";
import { Users, UserPlus, CalendarRange, GraduationCap } from "lucide-react";
import StaffDirectory from "@/components/staff/StaffDirectory";
import StaffForm from "@/components/staff/StaffForm";
import ShiftManager from "@/components/staff/ShiftManager";
import TrainingManager from "@/components/staff/TrainingManager";
import { StaffMember } from "@/types/staffTypes";

const Staff = () => {
  const { currentUser } = useUserRole();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<string>("directory");
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editStaffId, setEditStaffId] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else if (currentUser && !["superadmin", "franchise_owner", "franchise_manager"].includes(currentUser.role)) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  if (!currentUser || !["superadmin", "franchise_owner", "franchise_manager"].includes(currentUser.role)) {
    return null;
  }

  const handleAddStaff = () => {
    setShowAddForm(true);
    setEditStaffId(null);
    setSelectedStaff(null);
  };
  
  const handleEditStaff = (staffId: string) => {
    setEditStaffId(staffId);
    setShowAddForm(true);
    setSelectedStaff(null);
  };
  
  const handleViewProfile = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setEditStaffId(null);
    setShowAddForm(false);
  };
  
  const handleFormCancel = () => {
    setShowAddForm(false);
    setEditStaffId(null);
  };
  
  const handleFormSuccess = () => {
    setShowAddForm(false);
    setEditStaffId(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {showAddForm ? (
          <StaffForm 
            staffId={editStaffId || undefined} 
            franchiseId={currentUser.franchiseId} 
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        ) : selectedStaff ? (
          // Show staff profile/details page with tabs
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-semibold">
                      {selectedStaff.full_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-medium">{selectedStaff.full_name}</h3>
                      <div className="text-muted-foreground">{selectedStaff.designation}</div>
                      <div className="flex items-center space-x-4 mt-2 text-sm">
                        <div>{selectedStaff.email}</div>
                        <div>{selectedStaff.contact_number}</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" onClick={() => setSelectedStaff(null)}>
                      Back to Directory
                    </Button>
                    <Button onClick={() => handleEditStaff(selectedStaff.id)}>
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Tabs defaultValue="shifts">
              <TabsList>
                <TabsTrigger value="shifts" className="flex items-center gap-1">
                  <CalendarRange className="h-4 w-4" />
                  <span>Shifts & Schedule</span>
                </TabsTrigger>
                <TabsTrigger value="training" className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  <span>Training & Compliance</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="shifts" className="mt-4">
                <ShiftManager staffId={selectedStaff.id} franchiseId={selectedStaff.franchise_id} />
              </TabsContent>
              
              <TabsContent value="training" className="mt-4">
                <TrainingManager staffId={selectedStaff.id} franchiseId={selectedStaff.franchise_id} />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <>
            {/* Header section with Staff Management title and Add Staff button */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-semibold flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Staff Management
              </h1>
              <Button onClick={handleAddStaff}>
                <UserPlus className="mr-2 h-4 w-4" /> Add Staff
              </Button>
            </div>
            
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList>
                <TabsTrigger value="directory" className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>Staff Directory</span>
                </TabsTrigger>
                <TabsTrigger value="shifts" className="flex items-center gap-1">
                  <CalendarRange className="h-4 w-4" />
                  <span>Shifts & Scheduling</span>
                </TabsTrigger>
                <TabsTrigger value="training" className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  <span>Training & Compliance</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="directory" className="mt-6">
                <StaffDirectory 
                  initialFranchiseId={currentUser.franchiseId}
                  onAddStaff={handleAddStaff}
                  onEditStaff={handleEditStaff}
                  onViewProfile={handleViewProfile}
                />
              </TabsContent>
              
              <TabsContent value="shifts" className="mt-4">
                <ShiftManager franchiseId={currentUser.franchiseId} />
              </TabsContent>
              
              <TabsContent value="training" className="mt-4">
                <TrainingManager franchiseId={currentUser.franchiseId} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Staff;
