
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/providers/UserRoleProvider';

interface AuditLogEvent {
  entity_type: string;
  entity_id: string;
  action: string;
  details?: any;
  timestamp?: string;
  user_id?: string;
  franchise_id?: string;
}

// Function for direct logging without hooks (for services)
export const logAuditEvent = async (
  entityType: string,
  entityId: string,
  action: string,
  details?: any,
  userId?: string,
  franchiseId?: string
) => {
  try {
    console.log(`AUDIT: ${entityType}:${entityId} - ${action}`, details);
    
    // In production, log to database
    // Uncomment this code when ready to log to the database
    /*
    const auditEvent: AuditLogEvent = {
      entity_type: entityType,
      entity_id: entityId,
      action: action,
      details: details ? JSON.stringify(details) : null,
      user_id: userId,
      franchise_id: franchiseId,
      timestamp: new Date().toISOString()
    };
    
    await supabase.from('audit_logs').insert(auditEvent);
    */
  } catch (error) {
    console.error("Error logging audit event:", error);
  }
};

// Hook for components
export const useAuditLogger = () => {
  const { currentUser } = useUserRole();
  
  const logEvent = useCallback(async (
    entityType: string,
    entityId: string,
    action: string,
    details?: any
  ) => {
    try {
      if (!currentUser) {
        console.warn("Cannot log event: No authenticated user");
        return;
      }
      
      // Log to console during development
      console.log(`AUDIT: ${entityType}:${entityId} - ${action}`, details);
      
      // In production, log to database
      // Uncomment this code when ready to log to the database
      /*
      const auditEvent: AuditLogEvent = {
        entity_type: entityType,
        entity_id: entityId,
        action: action,
        details: details ? JSON.stringify(details) : null,
        user_id: currentUser.id,
        franchise_id: currentUser.franchise_id,
        timestamp: new Date().toISOString()
      };
      
      await supabase.from('audit_logs').insert(auditEvent);
      */
      
    } catch (error) {
      console.error("Error logging audit event:", error);
    }
  }, [currentUser]);
  
  return { logEvent };
};
