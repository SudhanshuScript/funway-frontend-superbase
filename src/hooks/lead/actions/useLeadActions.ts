
import { useState } from 'react';
import { toast } from 'sonner';
import { Lead, LeadStatus } from '@/types/leadTypes';
import { v4 as uuidv4 } from 'uuid';
import { useLeadActivities } from './useLeadActivities';

export function useLeadActions(leads: Lead[], setLeads: React.Dispatch<React.SetStateAction<Lead[]>>) {
  const { addActivity } = useLeadActivities();

  const updateLeadStatus = async (leadId: string, status: LeadStatus, userId: string | undefined, userFranchiseId?: string): Promise<boolean> => {
    const lead = leads.find(l => l.id === leadId);
    
    if (!lead) {
      toast.error("Lead not found");
      return false;
    }
    
    // Check permission
    if (userId !== "superadmin" && lead.franchise_id !== userFranchiseId) {
      toast.error("You don't have permission to update this lead");
      return false;
    }
    
    const currentTime = new Date().toISOString();
    
    // Update lead status
    const updatedLeads = leads.map(lead => {
      if (lead.id === leadId) {
        return {
          ...lead,
          status,
          updated_at: currentTime,
          last_activity: `Status changed to ${status}`
        };
      }
      return lead;
    });
    
    setLeads(updatedLeads);
    
    // Add activity
    await addActivity({
      leadId,
      activityType: 'status_change',
      details: `Changed status to ${status}`,
      performedBy: userId || 'unknown',
      franchiseId: lead.franchise_id,
    });
    
    toast.success(`Lead status updated to ${status}`);
    return true;
  };

  const reassignLead = async (leadId: string, assignedTo: string, userId: string | undefined, userFranchiseId?: string): Promise<boolean> => {
    const lead = leads.find(l => l.id === leadId);
    
    if (!lead) {
      toast.error("Lead not found");
      return false;
    }
    
    if (userId !== "superadmin" && lead.franchise_id !== userFranchiseId) {
      toast.error("You don't have permission to reassign this lead");
      return false;
    }
    
    const currentTime = new Date().toISOString();
    
    const updatedLeads = leads.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          assigned_to: assignedTo,
          last_activity: "Reassigned",
          updated_at: currentTime
        };
      }
      return l;
    });
    
    setLeads(updatedLeads);
    
    await addActivity({
      leadId,
      activityType: 'note',
      details: `Lead reassigned to staff member ${assignedTo}`,
      performedBy: userId || 'unknown',
      franchiseId: lead.franchise_id,
    });
    
    toast.success("Lead reassigned successfully");
    return true;
  };

  return {
    updateLeadStatus,
    reassignLead
  };
}
