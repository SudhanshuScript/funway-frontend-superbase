
import { apiClient } from '../apiClient';

// Booking types (simplified for now)
export interface Booking {
  id: string;
  guestId: string;
  sessionId: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  guestCount: number;
  bookingDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingFilters {
  status?: string;
  dateRange?: { from: Date; to: Date };
  guestId?: string;
  sessionId?: string;
}

// Create booking payload types
export interface CreateBookingPayload {
  sessionId: string;
  guestId: string;
  guestCount: number;
  bookingDate: string;
  sessionTime: string;
  paymentStatus: 'Pending' | 'Partially Paid' | 'Paid';
  checkInStatus: 'Awaited' | 'Checked-In';
  guestName: string;
  guestType: 'Regular' | 'First Timer' | 'VIP';
  addOns?: string[];
  notes?: string;
}

export interface UpdateBookingPayload {
  sessionId?: string;
  guestId?: string;
  guestCount?: number;
  bookingDate?: string;
  sessionTime?: string;
  paymentStatus?: 'Pending' | 'Partially Paid' | 'Paid';
  checkInStatus?: 'Awaited' | 'Checked-In';
  guestName?: string;
  guestType?: 'Regular' | 'First Timer' | 'VIP';
  addOns?: string[];
  notes?: string;
}

// API wrapper functions
export async function getBookings(params?: {
  date?: string;
  status?: 'upcoming' | 'past' | 'ongoing';
}) {
  try {
    // TODO: Replace with real API call when backend is ready
    // return await apiClient.get('/bookings', { params });
    
    // Temporary mock implementation
    console.log('getBookings - Using mock data', params);
    return [];
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
}

export async function getBookingById(id: string) {
  try {
    // TODO: Replace with real API call when backend is ready
    // return await apiClient.get(`/bookings/${id}`);
    
    // Temporary mock implementation
    console.log('getBookingById - Using mock data', id);
    return null;
  } catch (error) {
    console.error('Error fetching booking by ID:', error);
    throw error;
  }
}

export async function createBooking(payload: CreateBookingPayload) {
  try {
    // TODO: Replace with real API call when backend is ready
    // return await apiClient.post('/bookings', payload);
    
    // Temporary mock implementation
    console.log('createBooking - Using mock data', payload);
    const newBooking = {
      ...payload,
      id: `booking-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'pending' as const,
    };
    return newBooking;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

export async function updateBooking(id: string, payload: Partial<UpdateBookingPayload>) {
  try {
    // TODO: Replace with real API call when backend is ready
    // return await apiClient.put(`/bookings/${id}`, payload);
    
    // Temporary mock implementation
    console.log('updateBooking - Using mock data', id, payload);
    
    // Return a mock updated booking instead of throwing an error
    const updatedBooking: Booking = {
      id,
      guestId: payload.guestId || 'mock-guest-id',
      sessionId: payload.sessionId || 'mock-session-id',
      status: payload.notes?.includes('cancelled') ? 'cancelled' : 'confirmed',
      guestCount: payload.guestCount || 2,
      bookingDate: payload.bookingDate || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return updatedBooking;
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
}

export async function deleteBooking(id: string) {
  try {
    // TODO: Replace with real API call when backend is ready
    // return await apiClient.delete(`/bookings/${id}`);
    
    // Temporary mock implementation
    console.log('deleteBooking - Using mock data', id);
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
}

// Legacy BookingService class for backward compatibility
export class BookingService {
  
  /**
   * Get all bookings with optional filtering
   */
  static async getBookings(filters?: Partial<BookingFilters>): Promise<Booking[]> {
    try {
      // Convert filters to API params format
      const params: any = {};
      if (filters?.status) {
        params.status = filters.status;
      }
      if (filters?.dateRange) {
        params.date = filters.dateRange.from?.toISOString().split('T')[0];
      }
      
      return await getBookings(params);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  }

  /**
   * Get booking by ID
   */
  static async getBookingById(id: string): Promise<Booking | null> {
    return await getBookingById(id);
  }

  /**
   * Create a new booking
   */
  static async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
    // Convert legacy format to new API format
    const payload: CreateBookingPayload = {
      sessionId: bookingData.sessionId,
      guestId: bookingData.guestId,
      guestCount: bookingData.guestCount,
      bookingDate: bookingData.bookingDate,
      sessionTime: '12:00', // Default time, should be provided in real data
      paymentStatus: 'Pending',
      checkInStatus: 'Awaited',
      guestName: `Guest ${bookingData.guestId}`,
      guestType: 'Regular',
    };
    
    return await createBooking(payload);
  }

  /**
   * Update booking by ID
   */
  static async updateBooking(id: string, updateData: Partial<Booking>): Promise<Booking> {
    const payload: Partial<UpdateBookingPayload> = {
      sessionId: updateData.sessionId,
      guestId: updateData.guestId,
      guestCount: updateData.guestCount,
      bookingDate: updateData.bookingDate,
    };
    
    return await updateBooking(id, payload);
  }

  /**
   * Cancel booking by ID
   */
  static async cancelBooking(id: string): Promise<void> {
    // For cancellation, we update the booking status to 'cancelled' instead of deleting
    await updateBooking(id, { notes: 'Booking cancelled' });
  }
}
