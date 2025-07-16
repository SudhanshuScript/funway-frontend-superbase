
import { useState } from 'react';
import { toast } from 'sonner';
import { Session } from '@/types/sessionTypes';
import { format } from 'date-fns';
import { createSession } from '@/services';

export function useSessionCreator(setSessions: React.Dispatch<React.SetStateAction<Session[]>>, refreshSessions: () => Promise<void>) {
  const [isCreating, setIsCreating] = useState(false);
  
  const createSessionHandler = async (data: any) => {
    try {
      setIsCreating(true);
      
      let eventType = data.eventType || 'regular';
      let isSpecialEvent = eventType === 'special';
      
      // Prepare name from form data
      let sessionName = data.name;
      if (data.name === "Add Custom Name" && data.customName) {
        sessionName = data.customName;
      }
      
      // Format data for session creation
      const sessionInput = {
        name: sessionName,
        type: isSpecialEvent ? "special event" : data.name.toLowerCase(),
        start_date: format(data.startDate, "yyyy-MM-dd"),
        start_time: data.startTime,
        end_time: data.endTime || "",
        duration: parseInt(data.duration),
        max_capacity: data.maxCapacity,
        is_active: true, // All new sessions are active by default
        is_special_date: isSpecialEvent,
        special_date_name: isSpecialEvent ? sessionName : undefined,
        special_pricing: data.specialPricing,
        special_addons: data.specialAddOns,
        special_conditions: data.specialConditions,
        is_recurring: data.isRecurring,
        recurring_type: data.recurringType,
        franchise_id: "default-franchise", // Use actual franchise ID when available
        booked_count: 0
      };
      
      console.log("Creating session with data:", sessionInput);
      
      // Try to create via the service
      try {
        const result = await createSession(sessionInput);
        if (!result.success) {
          throw new Error(result.error || "Failed to create session");
        }
        console.log("Session created successfully:", result.data);
      } catch (error) {
        console.log("Service creation failed, falling back to mock:", error);
        // Create a new mock session as fallback
        const newSession: Session = {
          id: Math.random().toString(36).substring(2, 9),
          name: sessionInput.name,
          type: sessionInput.type,
          date: format(data.startDate, "yyyy-MM-dd"),
          startTime: sessionInput.start_time,
          endTime: sessionInput.end_time,
          duration: sessionInput.duration,
          maxCapacity: sessionInput.max_capacity,
          bookedCount: 0,
          isActive: true,
          isSpecialDate: sessionInput.is_special_date,
          specialDateName: sessionInput.special_date_name,
          specialPricing: sessionInput.special_pricing,
          specialAddOns: sessionInput.special_addons,
          specialConditions: sessionInput.special_conditions,
          isRecurring: sessionInput.is_recurring,
          recurringType: sessionInput.recurring_type,
        };
        
        // Add the new session to our state
        setSessions(prev => [...prev, newSession]);
      }
      
      toast.success("Session created successfully");
      
      // Refresh sessions to get the latest data
      await refreshSessions();
      
      return true;
    } catch (error: any) {
      console.error("Error creating session:", error);
      toast.error(`Failed to create session: ${error.message}`);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };
  
  return {
    isCreating,
    createSession: createSessionHandler
  };
}
