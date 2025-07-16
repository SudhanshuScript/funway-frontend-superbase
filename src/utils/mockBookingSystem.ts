
import { UpcomingBooking } from "@/types/bookingTypes";

// Interface for the booking system
export interface MockBookingSystem {
  addBooking: (booking: UpcomingBooking) => void;
  getBookings: () => UpcomingBooking[];
  updateBooking: (id: string, updates: Partial<UpcomingBooking>) => boolean;
  deleteBooking: (id: string) => boolean;
  addListener: (listener: () => void) => () => void;
}

// Mock system implementation for handling bookings
class MockBookingSystemImpl implements MockBookingSystem {
  private bookings: UpcomingBooking[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    // Try to load any saved bookings from localStorage
    try {
      const savedBookings = localStorage.getItem('mockBookings');
      if (savedBookings) {
        this.bookings = JSON.parse(savedBookings);
      }
    } catch (error) {
      console.error("Error loading saved bookings:", error);
    }
  }

  // Save bookings to localStorage
  private saveBookings(): void {
    try {
      localStorage.setItem('mockBookings', JSON.stringify(this.bookings));
    } catch (error) {
      console.error("Error saving bookings:", error);
    }
  }

  // Add a new booking
  public addBooking(booking: UpcomingBooking): void {
    this.bookings.push(booking);
    this.saveBookings();
    this.notifyListeners();
  }

  // Get all bookings
  public getBookings(): UpcomingBooking[] {
    return [...this.bookings];
  }

  // Update a booking
  public updateBooking(id: string, updates: Partial<UpcomingBooking>): boolean {
    const index = this.bookings.findIndex(b => b.id === id);
    if (index !== -1) {
      this.bookings[index] = { ...this.bookings[index], ...updates };
      this.saveBookings();
      this.notifyListeners();
      return true;
    }
    return false;
  }

  // Delete a booking
  public deleteBooking(id: string): boolean {
    const initialLength = this.bookings.length;
    this.bookings = this.bookings.filter(b => b.id !== id);
    
    if (this.bookings.length !== initialLength) {
      this.saveBookings();
      this.notifyListeners();
      return true;
    }
    return false;
  }

  // Add a listener that will be called when bookings change
  public addListener(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }
}

// Create a singleton instance
export const mockBookingSystem = new MockBookingSystemImpl();

// Add to window object for global access
declare global {
  interface Window {
    mockBookingSystem: MockBookingSystem;
  }
}

// Expose the booking system to the window object
if (typeof window !== 'undefined') {
  window.mockBookingSystem = mockBookingSystem;
}
