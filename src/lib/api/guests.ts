
import { apiClient } from '../apiClient';
import { Guest, GuestFilters } from '@/types/guestTypes';
import { generateMockGuests } from '@/hooks/guest/mockGuestData';

// Guest API service layer
export class GuestService {
  
  /**
   * Get all guests with optional filtering
   */
  static async getGuests(filters?: Partial<GuestFilters>): Promise<Guest[]> {
    try {
      // TODO: Replace with real API call
      // return await apiClient.get<Guest[]>('/guests', { params: filters });
      
      // Temporary mock data implementation
      console.log('GuestService.getGuests - Using mock data');
      return generateMockGuests();
    } catch (error) {
      console.error('Error fetching guests:', error);
      throw error;
    }
  }

  /**
   * Get guest by ID
   */
  static async getGuestById(id: string): Promise<Guest | null> {
    try {
      // TODO: Replace with real API call
      // return await apiClient.get<Guest>(`/guests/${id}`);
      
      // Temporary mock data implementation
      console.log('GuestService.getGuestById - Using mock data');
      const guests = generateMockGuests();
      return guests.find(guest => guest.id === id) || null;
    } catch (error) {
      console.error('Error fetching guest by ID:', error);
      throw error;
    }
  }

  /**
   * Create a new guest
   */
  static async createGuest(guestData: Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>): Promise<Guest> {
    try {
      // TODO: Replace with real API call
      // return await apiClient.post<Guest>('/guests', guestData);
      
      // Temporary mock implementation
      console.log('GuestService.createGuest - Using mock data');
      const newGuest: Guest = {
        ...guestData,
        id: `guest-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return newGuest;
    } catch (error) {
      console.error('Error creating guest:', error);
      throw error;
    }
  }

  /**
   * Update guest by ID
   */
  static async updateGuest(id: string, updateData: Partial<Guest>): Promise<Guest> {
    try {
      // TODO: Replace with real API call
      // return await apiClient.put<Guest>(`/guests/${id}`, updateData);
      
      // Temporary mock implementation
      console.log('GuestService.updateGuest - Using mock data');
      const existingGuest = await this.getGuestById(id);
      if (!existingGuest) {
        throw new Error('Guest not found');
      }
      
      return {
        ...existingGuest,
        ...updateData,
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error updating guest:', error);
      throw error;
    }
  }

  /**
   * Delete guest by ID
   */
  static async deleteGuest(id: string): Promise<void> {
    try {
      // TODO: Replace with real API call
      // await apiClient.delete(`/guests/${id}`);
      
      // Temporary mock implementation
      console.log('GuestService.deleteGuest - Using mock data');
      // In real implementation, this would delete the guest
    } catch (error) {
      console.error('Error deleting guest:', error);
      throw error;
    }
  }

  /**
   * Get guest preferences
   */
  static async getGuestPreferences(): Promise<string[]> {
    try {
      // TODO: Replace with real API call
      // return await apiClient.get<string[]>('/guests/preferences');
      
      // Temporary mock implementation
      console.log('GuestService.getGuestPreferences - Using mock data');
      const guests = generateMockGuests();
      const allPreferences = new Set<string>();
      guests.forEach(guest => {
        guest.preferences?.forEach(pref => {
          allPreferences.add(pref.preference);
        });
      });
      return Array.from(allPreferences);
    } catch (error) {
      console.error('Error fetching guest preferences:', error);
      throw error;
    }
  }
}
