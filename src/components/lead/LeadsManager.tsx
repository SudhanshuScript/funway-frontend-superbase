
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLeadManagement } from "@/hooks/lead/useLeadManagement";
import { LeadTable } from "./LeadTable";
import { LeadDetail } from "./LeadDetail";
import { LeadAnalytics } from "./LeadAnalytics";
import { LeadFilters } from "./LeadFilters";
import { AddLeadDialog } from "./AddLeadDialog";
import { Button } from "@/components/ui/button";
import { Plus, Filter, List, Download, RotateCw } from "lucide-react";
import { useUserRole } from "@/providers/UserRoleProvider";
import { LeadFilter } from "@/types/leadTypes";

export function LeadsManager() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [showAddLeadDialog, setShowAddLeadDialog] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const { currentUser } = useUserRole();
  
  const { 
    leads, 
    activities, 
    messages, 
    followUps, 
    selectedLeadId,
    selectedLeads,
    isLoadingLeads,
    filters,
    sortOption,
    leadAnalytics,
    setSelectedLeadId,
    createLead,
    updateLeadStatus,
    addFollowUp,
    completeFollowUp,
    addNote,
    sendMessage,
    reassignLead,
    convertLeadToBooking,
    updateFilters,
    handleSearchChange,
    handleSortChange,
    handleSelectLeadForBulkAction,
    exportLeads
  } = useLeadManagement();

  // Create a compatible filter function that converts the string parameters to a Partial<LeadFilter>
  const handleFilterChange = (filterKey: string, value: string) => {
    updateFilters({ [filterKey]: value } as Partial<LeadFilter>);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Leads Management</h2>
          <p className="text-muted-foreground">Track and manage potential customers</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setFilterOpen(true)}
            className="flex items-center gap-1"
          >
            <Filter className="h-4 w-4" /> Filters
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setViewMode(viewMode === "list" ? "kanban" : "list")}
            className="flex items-center gap-1"
          >
            <List className="h-4 w-4" /> {viewMode === "list" ? "Kanban View" : "List View"}
          </Button>
          {currentUser?.role === 'superadmin' && (
            <Button
              variant="outline"
              size="sm"
              onClick={exportLeads}
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" /> Export
            </Button>
          )}
          <Button 
            size="sm"
            onClick={() => setShowAddLeadDialog(true)} 
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add Lead
          </Button>
        </div>
      </div>

      {/* Analytics Section */}
      <LeadAnalytics analytics={leadAnalytics} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Lead List/Kanban Section */}
        <div className={`${selectedLeadId ? 'md:col-span-2' : 'md:col-span-3'}`}>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span>All Leads</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    updateFilters({
                      searchQuery: "",
                      source: "all",
                      status: "all",
                      interest: "all",
                      franchise_id: currentUser?.role === "superadmin" ? "all" : currentUser?.franchiseId || "all",
                      assigned_to: "all"
                    });
                  }}
                  className="flex items-center gap-1"
                >
                  <RotateCw className="h-3.5 w-3.5" /> Clear Filters
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LeadTable 
                leads={leads} 
                isLoading={isLoadingLeads}
                selectedLeadId={selectedLeadId}
                onSelectLead={setSelectedLeadId}
                onUpdateStatus={updateLeadStatus}
                onFilterChange={handleFilterChange}
                onSortChange={handleSortChange}
                onExport={exportLeads}
                selectedLeads={selectedLeads}
                onSelectLeadForBulkAction={handleSelectLeadForBulkAction}
                enableBulkActions={true}
                currentFranchiseId={currentUser?.franchiseId}
                userRole={currentUser?.role}
              />
            </CardContent>
          </Card>
        </div>
        
        {/* Lead Details Section */}
        {selectedLeadId && (
          <div className="md:col-span-1">
            <LeadDetail
              lead={leads.find(l => l.id === selectedLeadId) || null}
              activities={activities.filter(a => a.lead_id === selectedLeadId)}
              followUps={followUps.filter(f => f.lead_id === selectedLeadId)}
              messages={messages.filter(m => m.lead_id === selectedLeadId)}
              onClose={() => setSelectedLeadId(null)}
              onAddNote={addNote}
              onAddFollowUp={addFollowUp}
              onCompleteFollowUp={completeFollowUp}
              onUpdateStatus={updateLeadStatus}
              onConvertToBooking={convertLeadToBooking}
              onReassign={reassignLead}
              onSendMessage={sendMessage}
            />
          </div>
        )}
      </div>
      
      <LeadFilters 
        open={filterOpen}
        onOpenChange={setFilterOpen}
        filters={filters}
        onUpdateFilters={updateFilters}
      />
      
      <AddLeadDialog
        open={showAddLeadDialog}
        onOpenChange={setShowAddLeadDialog}
        onAddLead={createLead}
      />
    </div>
  );
}
