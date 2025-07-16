
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import FranchiseOverviewPanel from "@/components/franchise/FranchiseOverviewPanel";
import FranchiseStatsSection from "@/components/franchise/FranchiseStatsSection";
import FranchiseFilters from "@/components/franchise/enhanced/FranchiseFilters";
import { useUserRole } from "@/providers/UserRoleProvider";
import { Button } from "@/components/ui/button";
import { PlusCircle, Building2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { FranchiseFiltersState, FRANCHISE_STATUS_OPTIONS } from "@/types/franchiseManagement";
import FranchiseDetails from "@/components/franchise/enhanced/FranchiseDetails";
import DynamicFranchiseOnboarding from "@/components/franchise/enhanced/DynamicFranchiseOnboarding";
import { getSampleFranchisesCount } from "@/utils/franchiseDataLoader";
import { motion } from "framer-motion";

const Franchises = () => {
  const { currentUser } = useUserRole();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedFranchiseId, setSelectedFranchiseId] = useState<string | null>(null);
  const [isCreatingFranchise, setIsCreatingFranchise] = useState(false);
  const [selectedStatusTab, setSelectedStatusTab] = useState("active");
  const [filters, setFilters] = useState<FranchiseFiltersState>({
    search: "",
    status: "active", // Default to active franchises
    dateRange: { from: null, to: null },
    location: { country: null, state: null, city: null }
  });
  
  // Get franchise counts for status tabs
  const franchiseCounts = getSampleFranchisesCount();
  
  // Redirect non-superadmins if they try to access a franchise that's not theirs
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (currentUser.role !== "superadmin" && !selectedFranchiseId) {
      // For franchise owners and managers, automatically select their franchise
      if (currentUser.franchiseId) {
        setSelectedFranchiseId(currentUser.franchiseId);
      } else {
        navigate("/dashboard");
      }
    }
  }, [currentUser, navigate, selectedFranchiseId]);

  const handleFranchiseSelect = (franchiseId: string) => {
    setSelectedFranchiseId(franchiseId);
    setActiveTab("details");
  };

  const handleCreateFranchise = () => {
    setIsCreatingFranchise(true);
    setActiveTab("create");
  };

  const handleCancelCreate = () => {
    setIsCreatingFranchise(false);
    setActiveTab("overview");
  };

  const handleSuccessfulCreate = () => {
    setIsCreatingFranchise(false);
    setActiveTab("overview");
  };

  const handleBackToOverview = () => {
    setSelectedFranchiseId(null);
    setActiveTab("overview");
  };

  const handleStatusTabChange = (status: string) => {
    setSelectedStatusTab(status);
    setFilters({
      ...filters,
      status: status === "all" ? "all" : status
    });
  };

  // Check if user has permission to add franchises
  const canAddFranchise = currentUser?.role === "superadmin";

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <DashboardLayout>
      <motion.div 
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="flex justify-between items-center"
          variants={itemVariants}
        >
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Franchise Management</h1>
              <p className="text-muted-foreground">
                Manage all your franchises across different locations
              </p>
            </div>
          </div>
          {canAddFranchise && !isCreatingFranchise && !selectedFranchiseId && (
            <Button 
              onClick={handleCreateFranchise}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Franchise
            </Button>
          )}
          {selectedFranchiseId && (
            <Button variant="outline" onClick={handleBackToOverview}>
              Back to Overview
            </Button>
          )}
        </motion.div>

        {/* Stats section visible only for superadmin and franchise owners */}
        {(currentUser?.role === "superadmin" || currentUser?.role === "franchise_owner") && 
          !isCreatingFranchise && activeTab !== "create" && (
          <motion.div variants={itemVariants}>
            <FranchiseStatsSection 
              filters={filters}
              franchiseId={currentUser?.role === "franchise_owner" ? currentUser.franchiseId : undefined}
            />
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="bg-muted/80">
              <TabsTrigger value="overview" disabled={isCreatingFranchise}>Overview</TabsTrigger>
              {selectedFranchiseId && <TabsTrigger value="details">Details</TabsTrigger>}
              {isCreatingFranchise && <TabsTrigger value="create">Create Franchise</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              {/* Status tabs for filtering by active/inactive */}
              <Tabs 
                value={selectedStatusTab} 
                onValueChange={handleStatusTabChange} 
                className="w-full"
              >
                <TabsList className="bg-card border">
                  {FRANCHISE_STATUS_OPTIONS.filter(option => 
                    option.value !== "all").map(option => (
                    <TabsTrigger 
                      key={option.value} 
                      value={option.value}
                      className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                    >
                      {option.label} Franchises
                      {option.value === 'active' && franchiseCounts.active > 0 && (
                        <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                          {franchiseCounts.active}
                        </span>
                      )}
                      {option.value === 'inactive' && franchiseCounts.inactive > 0 && (
                        <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] text-muted-foreground">
                          {franchiseCounts.inactive}
                        </span>
                      )}
                      {option.value === 'pending_review' && franchiseCounts.pending > 0 && (
                        <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-[10px] text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                          {franchiseCounts.pending}
                        </span>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              
              <FranchiseFilters 
                filters={filters}
                setFilters={setFilters}
                userRole={currentUser?.role || "guest"}
                onCreateFranchise={canAddFranchise ? handleCreateFranchise : undefined}
              />
              
              <FranchiseOverviewPanel 
                filters={filters} 
                onSelectFranchise={handleFranchiseSelect} 
                userRole={currentUser?.role || "guest"}
                userFranchiseId={currentUser?.franchiseId}
              />
            </TabsContent>
            
            {selectedFranchiseId && (
              <TabsContent value="details">
                <FranchiseDetails 
                  franchiseId={selectedFranchiseId}
                  userRole={currentUser?.role || "guest"}
                />
              </TabsContent>
            )}
            
            {isCreatingFranchise && (
              <TabsContent value="create">
                <DynamicFranchiseOnboarding 
                  onCancel={handleCancelCreate} 
                  onSuccess={handleSuccessfulCreate} 
                />
              </TabsContent>
            )}
          </Tabs>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Franchises;
