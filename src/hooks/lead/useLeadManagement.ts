
import { useState, useEffect } from 'react';
import { useUserRole } from '@/providers/UserRoleProvider';
import { toast } from 'sonner';
import { 
  Lead, 
  LeadFilter,
  LeadStatus,
  LeadChannel
} from '@/types/leadTypes';
import { mockLeads, mockLeadAnalytics } from './mockLeadData';
import { v4 as uuidv4 } from 'uuid';
import { useLeadActivities } from './actions/useLeadActivities';
import { useLeadFollowUps } from './actions/useLeadFollowUps';
import { useLeadMessages } from './actions/useLeadMessages';
import { useLeadActions } from './actions/useLeadActions';

export function useLeadManagement() {
  const { currentUser } = useUserRole();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [sortOption, setSortOption] = useState<string>('created_at-desc');
  const [filters, setFilters] = useState<LeadFilter>({
    searchQuery: "",
    source: "all",
    franchise_id: currentUser?.role === "superadmin" ? "all" : currentUser?.franchiseId || "all",
    status: "all",
    interest: "all",
    assigned_to: "all"
  });

  const { activities, setActivities, addActivity, addNote } = useLeadActivities();
  const { followUps, setFollowUps, addFollowUp, completeFollowUp } = useLeadFollowUps(leads, setLeads);
  const { messages, setMessages, sendMessage } = useLeadMessages(leads, setLeads);
  const { updateLeadStatus, reassignLead } = useLeadActions(leads, setLeads);

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      franchise_id: currentUser?.role === "superadmin" ? "all" : currentUser?.franchiseId || "all"
    }));
  }, [currentUser]);

  useEffect(() => {
    setIsLoadingLeads(true);
    
    setTimeout(() => {
      let filteredLeads = [...mockLeads];
      
      // Apply role-based filtering
      if (currentUser?.role !== "superadmin") {
        if (currentUser?.franchiseId) {
          filteredLeads = filteredLeads.filter(
            lead => lead.franchise_id === currentUser.franchiseId
          );
        } else if (currentUser?.role === "franchise_manager") {
          filteredLeads = filteredLeads.filter(
            lead => lead.assigned_to === currentUser.id
          );
        } else {
          filteredLeads = [];
        }
      } else if (filters.franchise_id !== "all") {
        filteredLeads = filteredLeads.filter(
          lead => lead.franchise_id === filters.franchise_id
        );
      }
      
      // Apply search filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filteredLeads = filteredLeads.filter(
          lead => lead.name.toLowerCase().includes(query) ||
                 (lead.email && lead.email.toLowerCase().includes(query)) ||
                 (lead.phone && lead.phone.includes(query))
        );
      }
      
      // Apply other filters
      if (filters.source !== "all") {
        filteredLeads = filteredLeads.filter(lead => lead.source === filters.source);
      }
      if (filters.status !== "all") {
        filteredLeads = filteredLeads.filter(lead => lead.status === filters.status);
      }
      if (filters.interest !== "all") {
        filteredLeads = filteredLeads.filter(lead => lead.interest === filters.interest);
      }
      if (filters.assigned_to !== "all") {
        filteredLeads = filteredLeads.filter(lead => lead.assigned_to === filters.assigned_to);
      }
      
      // Apply sorting
      const [sortField, sortDirection] = sortOption.split('-');
      filteredLeads.sort((a, b) => {
        let valueA: any = a[sortField as keyof Lead];
        let valueB: any = b[sortField as keyof Lead];
        
        if (sortField === 'created_at' || sortField === 'updated_at') {
          valueA = new Date(valueA).getTime();
          valueB = new Date(valueB).getTime();
        }
        
        if (sortDirection === 'asc') {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });
      
      setLeads(filteredLeads);
      setIsLoadingLeads(false);
    }, 500);
  }, [currentUser, filters, sortOption]);

  const createLead = (leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => {
    const currentTime = new Date().toISOString();
    
    if (currentUser?.role !== "superadmin" && 
        leadData.franchise_id !== currentUser?.franchiseId) {
      toast.error("You don't have permission to create a lead for this franchise");
      return null;
    }
    
    const newLead: Lead = {
      id: `lead-${uuidv4()}`,
      ...leadData,
      status: leadData.status as LeadStatus,
      created_at: currentTime,
      updated_at: currentTime,
      last_activity: "Lead created"
    };
    
    setLeads(prev => [newLead, ...prev]);
    
    return newLead;
  };

  const convertLeadToBooking = async (leadId: string, bookingId: string): Promise<boolean> => {
    const lead = leads.find(l => l.id === leadId);
    
    if (!lead) {
      toast.error("Lead not found");
      return false;
    }
    
    const currentTime = new Date().toISOString();
    
    const updatedLeads = leads.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          status: 'converted' as LeadStatus,
          booking_id: bookingId,
          converted_to_guest: true,
          converted_at: currentTime,
          updated_at: currentTime,
          last_activity: "Converted to booking"
        };
      }
      return l;
    });
    
    setLeads(updatedLeads);
    
    await addActivity({
      leadId,
      activityType: 'conversion',
      details: `Converted lead to booking with ID: ${bookingId}`,
      performedBy: currentUser?.id || 'unknown',
      franchiseId: lead.franchise_id,
    });
    
    toast.success("Lead converted to booking successfully");
    return true;
  };

  const handleSearchChange = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const handleSortChange = (sortOption: string) => {
    setSortOption(sortOption);
  };

  const handleSelectLeadForBulkAction = (leadId: string, selected: boolean) => {
    if (selected) {
      setSelectedLeads(prev => [...prev, leadId]);
    } else {
      setSelectedLeads(prev => prev.filter(id => id !== leadId));
    }
  };

  const updateFilters = (newFilters: Partial<LeadFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const exportLeads = () => {
    toast.success("Exporting leads to CSV...");
    console.log("Exporting leads:", leads);
  };

  return {
    leads,
    activities,
    messages,
    followUps,
    selectedLeadId,
    selectedLeads,
    isLoadingLeads,
    filters,
    sortOption,
    leadAnalytics: mockLeadAnalytics,
    setSelectedLeadId,
    createLead,
    updateLeadStatus: (leadId: string, status: LeadStatus) => updateLeadStatus(leadId, status, currentUser?.id, currentUser?.franchiseId),
    addFollowUp: (leadId: string, data: { notes: string, scheduled_for: string }) => addFollowUp(leadId, data, currentUser?.id, currentUser?.franchiseId),
    completeFollowUp: (followUpId: string) => completeFollowUp(followUpId, currentUser?.id, currentUser?.franchiseId),
    addNote: (leadId: string, note: string) => addNote(leadId, note, currentUser?.id, currentUser?.franchiseId),
    sendMessage: (leadId: string, message: string, channel: LeadChannel) => sendMessage(leadId, message, channel, currentUser?.id, currentUser?.franchiseId),
    reassignLead: (leadId: string, assignedTo: string) => reassignLead(leadId, assignedTo, currentUser?.id, currentUser?.franchiseId),
    convertLeadToBooking,
    updateFilters,
    handleSearchChange,
    handleSortChange,
    handleSelectLeadForBulkAction,
    exportLeads
  };
}
