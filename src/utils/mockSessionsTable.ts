import { v4 as uuidv4 } from "uuid";
import { SessionDB, Session } from "@/types/sessionTypes";
import { sampleSessions } from "@/data/sampleSessions";

// In-memory database for sessions
let sessions: SessionDB[] = [];

// Initialize with some sample data
const initializeMockData = () => {
  if (sessions.length === 0) {
    sessions = sampleSessions.map(session => ({
      id: session.id,
      name: session.name,
      type: session.type,
      start_date: session.date,
      start_time: session.startTime,
      end_time: session.endTime || '',
      duration: session.duration,
      max_capacity: session.maxCapacity,
      booked_count: session.bookedCount || 0,
      is_active: session.isActive,
      is_special_date: session.isSpecialDate,
      special_date_name: session.specialDateName,
      special_pricing: session.specialPricing,
      special_addons: session.specialAddOns,
      special_conditions: session.specialConditions,
      is_recurring: session.isRecurring,
      recurring_type: session.recurringType,
      franchise_id: session.franchise_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
    
    console.log("Initialized mock sessions database with", sessions.length, "sessions");
  }
};

// Create a fully mocked sessions database implementation
export const mockSessionsDB = {
  // Select operations
  select: () => {
    initializeMockData();
    
    return {
      eq: (column: string, value: any) => {
        return {
          single: () => {
            const result = sessions.find(s => s[column as keyof SessionDB] === value);
            return Promise.resolve({ 
              data: result || null, 
              error: result ? null : new Error('Not found') 
            });
          },
          async execute() {
            const filtered = sessions.filter(s => s[column as keyof SessionDB] === value);
            return { data: filtered, error: null };
          }
        };
      },
      async execute() {
        return { data: sessions, error: null };
      }
    };
  },
  
  // Insert operations
  insert: (data: Partial<SessionDB> | Partial<SessionDB>[]) => {
    initializeMockData();
    
    const dataToInsert = Array.isArray(data) ? data : [data];
    const insertedData = dataToInsert.map(item => {
      const newItem: SessionDB = {
        id: item.id || uuidv4(),
        name: item.name || '',
        type: item.type || 'Regular',
        start_date: item.start_date || new Date().toISOString(),
        start_time: item.start_time || '09:00',
        end_time: item.end_time || '11:00',
        duration: item.duration || 120,
        max_capacity: item.max_capacity || 20,
        booked_count: item.booked_count || 0,
        is_active: item.is_active !== undefined ? item.is_active : true,
        is_special_date: item.is_special_date,
        special_date_name: item.special_date_name,
        special_pricing: item.special_pricing,
        special_addons: item.special_addons,
        special_conditions: item.special_conditions,
        is_recurring: item.is_recurring,
        recurring_type: item.recurring_type,
        franchise_id: item.franchise_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      sessions.push(newItem);
      return newItem;
    });
    
    console.log("Inserted mock session:", insertedData);
    
    return {
      select: () => {
        return {
          single: () => {
            return Promise.resolve({ data: insertedData[0], error: null });
          },
          execute: async () => {
            return { data: insertedData, error: null };
          }
        };
      },
      async execute() {
        return { data: insertedData, error: null };
      },
      data: insertedData,
      error: null
    };
  },
  
  // Update operations
  update: (data: Partial<SessionDB>) => {
    initializeMockData();
    
    return {
      eq: (column: string, value: any) => {
        const index = sessions.findIndex(s => s[column as keyof SessionDB] === value);
        if (index !== -1) {
          sessions[index] = { ...sessions[index], ...data, updated_at: new Date().toISOString() };
          return { data: sessions[index], error: null };
        }
        return { data: null, error: new Error('Not found') };
      }
    };
  },
  
  // Delete operations
  delete: () => {
    initializeMockData();
    
    return {
      eq: (column: string, value: any) => {
        const index = sessions.findIndex(s => s[column as keyof SessionDB] === value);
        if (index !== -1) {
          const deleted = sessions.splice(index, 1)[0];
          return { data: deleted, error: null };
        }
        return { data: null, error: new Error('Not found') };
      }
    };
  }
};

// Function to get the current state of the sessions (useful for testing)
export const getSessionsState = (): Session[] => {
  initializeMockData();
  
  return sessions.map(dbSession => ({
    id: dbSession.id,
    name: dbSession.name,
    type: dbSession.type,
    date: dbSession.start_date,
    startTime: dbSession.start_time,
    endTime: dbSession.end_time || "",
    duration: dbSession.duration,
    maxCapacity: dbSession.max_capacity,
    bookedCount: dbSession.booked_count || 0,
    isActive: dbSession.is_active,
    isSpecialDate: dbSession.is_special_date,
    specialDateName: dbSession.special_date_name,
    specialPricing: dbSession.special_pricing,
    specialAddOns: dbSession.special_addons,
    specialConditions: dbSession.special_conditions,
    isRecurring: dbSession.is_recurring,
    recurringType: dbSession.recurring_type,
  }));
};
