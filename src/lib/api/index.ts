
// Export all API services for easy imports
export { GuestService } from './guests';
export { BookingService } from './bookings';
export { SessionService } from './sessions';
export { FranchiseService } from './franchises';
export { OfferService } from './offers';

// Export new API wrapper functions
export { 
  getBookings, 
  getBookingById, 
  createBooking, 
  updateBooking, 
  deleteBooking 
} from './bookings';

export {
  getSessions,
  getSessionById,
  createSession,
  updateSession,
  deactivateSession
} from './sessions';

export {
  getFranchises,
  getFranchiseById,
  createFranchise,
  updateFranchise,
  deactivateFranchise
} from './franchises';

// Re-export types
export type { Guest, GuestFilters } from '@/types/guestTypes';
export type { Booking, BookingFilters, CreateBookingPayload, UpdateBookingPayload } from './bookings';
export type { Session, SessionFilters, CreateSessionPayload, UpdateSessionPayload } from './sessions';
export type { Franchise, FranchiseFilters, CreateFranchisePayload, UpdateFranchisePayload } from './franchises';
export type { Offer, OfferFilters } from './offers';
