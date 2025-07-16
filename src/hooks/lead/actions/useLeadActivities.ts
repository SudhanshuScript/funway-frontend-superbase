
import { useState } from 'react';
import { LeadActivity } from '@/types/leadTypes';
import { v4 as uuidv4 } from 'uuid';

interface AddActivityParams {
  leadId: string;
  activityType: LeadActivity['activity_type'];
  details: string;
  performedBy: string;
  franchiseId: string;
}

export function useLeadActivities() {
  const [activities, setActivities] = useState<LeadActivity[]>([]);

  const addActivity = async ({ leadId, activityType, details, performedBy, franchiseId }: AddActivityParams) => {
    const currentTime = new Date().toISOString();
    const newActivity: LeadActivity = {
      id: `activity-${uuidv4()}`,
      lead_id: leadId,
      activity_type: activityType,
      details,
      performed_by: performedBy,
      performed_at: currentTime,
      franchise_id: franchiseId
    };
    
    setActivities(prev => [newActivity, ...prev]);
    return newActivity;
  };

  const addNote = async (leadId: string, note: string, userId: string | undefined, userFranchiseId?: string): Promise<boolean> => {
    if (!leadId || !note) {
      return false;
    }
    
    try {
      await addActivity({
        leadId,
        activityType: 'note',
        details: note,
        performedBy: userId || 'unknown',
        franchiseId: userFranchiseId || '',
      });
      return true;
    } catch (error) {
      console.error("Error adding note:", error);
      return false;
    }
  };

  return {
    activities,
    setActivities,
    addActivity,
    addNote
  };
}
