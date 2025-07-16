
import { apiClient } from '../apiClient';

// Session types - updated to match expected data fields
export interface Session {
  id: string;
  sessionName: string;
  sessionType: 'Regular Event' | 'Special Event';
  startTime: string;
  endTime: string;
  date: string;
  guestCapacity: number;
  assignedMenuId?: string;
  isActive: boolean;
  assignedStaff: { name: string; id: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface SessionFilters {
  date?: string;
  franchiseId?: string;
  sessionType?: string;
  isActive?: boolean;
}

// Create session payload types
export interface CreateSessionPayload {
  sessionName: string;
  sessionType: 'Regular Event' | 'Special Event';
  startTime: string;
  endTime: string;
  date: string;
  guestCapacity: number;
  assignedMenuId?: string;
  isActive?: boolean;
  assignedStaff?: { name: string; id: string }[];
}

export interface UpdateSessionPayload {
  sessionName?: string;
  sessionType?: 'Regular Event' | 'Special Event';
  startTime?: string;
  endTime?: string;
  date?: string;
  guestCapacity?: number;
  assignedMenuId?: string;
  isActive?: boolean;
  assignedStaff?: { name: string; id: string }[];
}

// New API wrapper functions
export async function getSessions(params?: {
  date?: string;
  franchiseId?: string;
}) {
  try {
    // TODO: Replace with real API call when backend is ready
    // return await apiClient.get('/sessions', { params });
    
    // Temporary mock implementation
    console.log('getSessions - Using mock data', params);
    return [];
  } catch (error) {
    console.error('Error fetching sessions:', error);
    throw error;
  }
}

export async function getSessionById(id: string) {
  try {
    // TODO: Replace with real API call when backend is ready
    // return await apiClient.get(`/sessions/${id}`);
    
    // Temporary mock implementation
    console.log('getSessionById - Using mock data', id);
    return null;
  } catch (error) {
    console.error('Error fetching session by ID:', error);
    throw error;
  }
}

export async function createSession(payload: CreateSessionPayload) {
  try {
    // TODO: Replace with real API call when backend is ready
    // return await apiClient.post('/sessions', payload);
    
    // Temporary mock implementation
    console.log('createSession - Using mock data', payload);
    const newSession: Session = {
      ...payload,
      id: `session-${Date.now()}`,
      isActive: payload.isActive !== false, // Default to true
      assignedStaff: payload.assignedStaff || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newSession;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
}

export async function updateSession(id: string, payload: Partial<UpdateSessionPayload>) {
  try {
    // TODO: Replace with real API call when backend is ready
    // return await apiClient.put(`/sessions/${id}`, payload);
    
    // Temporary mock implementation
    console.log('updateSession - Using mock data', id, payload);
    
    // Return a mock updated session
    const updatedSession: Session = {
      id,
      sessionName: payload.sessionName || 'Mock Session',
      sessionType: payload.sessionType || 'Regular Event',
      startTime: payload.startTime || '09:00',
      endTime: payload.endTime || '17:00',
      date: payload.date || new Date().toISOString().split('T')[0],
      guestCapacity: payload.guestCapacity || 20,
      assignedMenuId: payload.assignedMenuId,
      isActive: payload.isActive !== false,
      assignedStaff: payload.assignedStaff || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return updatedSession;
  } catch (error) {
    console.error('Error updating session:', error);
    throw error;
  }
}

export async function deactivateSession(id: string, reason: string) {
  try {
    // TODO: Replace with real API call when backend is ready
    // return await apiClient.post(`/sessions/${id}/deactivate`, { reason });
    
    // Temporary mock implementation
    console.log('deactivateSession - Using mock data', id, reason);
    
    // Return success indicator
    return { success: true, message: 'Session deactivated successfully' };
  } catch (error) {
    console.error('Error deactivating session:', error);
    throw error;
  }
}

// Legacy SessionService class for backward compatibility
export class SessionService {
  
  /**
   * Get all sessions with optional filtering
   */
  static async getSessions(filters?: Partial<SessionFilters>): Promise<Session[]> {
    try {
      // Convert filters to API params format
      const params: any = {};
      if (filters?.date) {
        params.date = filters.date;
      }
      if (filters?.franchiseId) {
        params.franchiseId = filters.franchiseId;
      }
      
      return await getSessions(params);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      throw error;
    }
  }

  /**
   * Get sessions by date
   */
  static async getSessionsByDate(date: string): Promise<Session[]> {
    return await getSessions({ date });
  }

  /**
   * Create a new session
   */
  static async createSession(sessionData: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>): Promise<Session> {
    // Convert legacy format to new API format
    const payload: CreateSessionPayload = {
      sessionName: sessionData.sessionName,
      sessionType: sessionData.sessionType,
      startTime: sessionData.startTime,
      endTime: sessionData.endTime,
      date: sessionData.date,
      guestCapacity: sessionData.guestCapacity,
      assignedMenuId: sessionData.assignedMenuId,
      isActive: sessionData.isActive,
      assignedStaff: sessionData.assignedStaff,
    };
    
    return await createSession(payload);
  }

  /**
   * Update session by ID
   */
  static async updateSession(id: string, updateData: Partial<Session>): Promise<Session> {
    const payload: Partial<UpdateSessionPayload> = {
      sessionName: updateData.sessionName,
      sessionType: updateData.sessionType,
      startTime: updateData.startTime,
      endTime: updateData.endTime,
      date: updateData.date,
      guestCapacity: updateData.guestCapacity,
      assignedMenuId: updateData.assignedMenuId,
      isActive: updateData.isActive,
      assignedStaff: updateData.assignedStaff,
    };
    
    return await updateSession(id, payload);
  }

  /**
   * Delete session by ID
   */
  static async deleteSession(id: string): Promise<void> {
    // For deactivation, we use the deactivate endpoint instead of delete
    await deactivateSession(id, 'Session deleted');
  }
}
