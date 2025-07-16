
import { useState } from 'react';
import { FollowUp, Lead } from '@/types/leadTypes';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { useLeadActivities } from './useLeadActivities';

export function useLeadFollowUps(leads: Lead[], setLeads: React.Dispatch<React.SetStateAction<Lead[]>>) {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const { addActivity } = useLeadActivities();

  const addFollowUp = async (leadId: string, data: { notes: string, scheduled_for: string }, userId: string | undefined, userFranchiseId?: string): Promise<boolean> => {
    const lead = leads.find(l => l.id === leadId);
    
    if (!lead) {
      toast.error("Lead not found");
      return false;
    }
    
    if (userId !== "superadmin" && lead.franchise_id !== userFranchiseId) {
      toast.error("You don't have permission to add follow-up for this lead");
      return false;
    }
    
    const currentTime = new Date().toISOString();
    
    const newFollowUp: FollowUp = {
      id: `follow-up-${uuidv4()}`,
      lead_id: leadId,
      scheduled_for: data.scheduled_for,
      notes: data.notes,
      completed: false,
      assigned_to: userId || 'unknown',
      created_by: userId || 'unknown',
      created_at: currentTime
    };
    
    setFollowUps(prev => [...prev, newFollowUp]);
    
    const updatedLeads = leads.map(lead => {
      if (lead.id === leadId) {
        return {
          ...lead,
          next_follow_up: data.scheduled_for,
          updated_at: currentTime,
          last_activity: "Follow-up scheduled"
        };
      }
      return lead;
    });
    
    setLeads(updatedLeads);
    
    await addActivity({
      leadId,
      activityType: 'follow_up',
      details: `Scheduled follow-up for ${new Date(data.scheduled_for).toLocaleDateString()}`,
      performedBy: userId || 'unknown',
      franchiseId: lead.franchise_id,
    });
    
    toast.success("Follow-up scheduled successfully");
    return true;
  };

  const completeFollowUp = async (followUpId: string, userId: string | undefined, userFranchiseId?: string): Promise<boolean> => {
    const followUp = followUps.find(f => f.id === followUpId);
    
    if (!followUp) {
      toast.error("Follow-up not found");
      return false;
    }
    
    const lead = leads.find(l => l.id === followUp.lead_id);
    
    if (!lead) {
      toast.error("Lead not found");
      return false;
    }
    
    if (userId !== "superadmin" && lead.franchise_id !== userFranchiseId) {
      toast.error("You don't have permission to update this follow-up");
      return false;
    }
    
    const currentTime = new Date().toISOString();
    
    const updatedFollowUps = followUps.map(f => {
      if (f.id === followUpId) {
        return {
          ...f,
          completed: true,
          completed_at: currentTime
        };
      }
      return f;
    });
    
    setFollowUps(updatedFollowUps);
    
    const updatedLeads = leads.map(l => {
      if (l.id === followUp.lead_id) {
        return {
          ...l,
          last_activity: "Follow-up completed",
          updated_at: currentTime
        };
      }
      return l;
    });
    
    setLeads(updatedLeads);
    
    await addActivity({
      leadId: followUp.lead_id,
      activityType: 'note',
      details: `Completed follow-up: ${followUp.notes}`,
      performedBy: userId || 'unknown',
      franchiseId: lead.franchise_id,
    });
    
    toast.success("Follow-up marked as completed");
    return true;
  };

  return {
    followUps,
    setFollowUps,
    addFollowUp,
    completeFollowUp
  };
}
