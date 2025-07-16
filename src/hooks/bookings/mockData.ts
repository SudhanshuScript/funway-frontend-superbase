
import { UpcomingBooking, BookingStats, PopularSession } from '@/types/bookingTypes';

// Mock upcoming bookings
export const mockUpcomingBookings: UpcomingBooking[] = [
  {
    id: "bk-001",
    guestName: "John Smith",
    guestType: "Regular",
    sessionName: "Sunset Dinner",
    sessionId: "ses-001",
    bookingDate: "2025-04-10T18:30:00.000Z",
    createdAt: "2025-04-01T12:30:00.000Z",
    status: "confirmed",
    paymentStatus: "paid",
    totalGuests: 4,
    specialRequests: "Window seat if possible",
    reminderStatus: "sent",
    lastReminderSent: "2025-04-05T15:00:00.000Z",
    reminderCount: 1,
    contactDetails: {
      email: "john.smith@example.com",
      phone: "555-123-4567"
    },
    vegCount: 2,
    nonVegCount: 2,
    addonPackage: "Premium"
  },
  {
    id: "bk-002",
    guestName: "Jane Cooper",
    guestType: "VIP",
    sessionName: "Brunch Experience",
    sessionId: "ses-002",
    bookingDate: "2025-04-12T11:00:00.000Z",
    createdAt: "2025-04-02T09:45:00.000Z",
    status: "pending",
    paymentStatus: "pending",
    totalGuests: 2,
    reminderStatus: "not_sent",
    reminderCount: 0,
    contactDetails: {
      email: "jane.cooper@example.com",
      phone: "555-987-6543"
    }
  },
  {
    id: "bk-003",
    guestName: "Robert Chen",
    guestType: "First Timer",
    sessionName: "Sunset Dinner",
    sessionId: "ses-001",
    bookingDate: "2025-04-15T18:30:00.000Z",
    createdAt: "2025-04-03T14:20:00.000Z",
    status: "confirmed",
    paymentStatus: "paid",
    totalGuests: 6,
    specialRequests: "Birthday celebration",
    reminderStatus: "responded",
    lastReminderSent: "2025-04-07T10:00:00.000Z",
    reminderCount: 1,
    contactDetails: {
      email: "robert.chen@example.com",
      phone: "555-456-7890"
    },
    vegCount: 3,
    nonVegCount: 3
  },
  {
    id: "bk-004",
    guestName: "Sarah Williams",
    guestType: "Regular",
    sessionName: "Brunch Experience",
    sessionId: "ses-002",
    bookingDate: "2025-04-18T11:00:00.000Z",
    createdAt: "2025-04-04T16:30:00.000Z",
    status: "pending",
    paymentStatus: "pending",
    totalGuests: 3,
    reminderStatus: "not_sent",
    reminderCount: 0,
    contactDetails: {
      email: "sarah.williams@example.com",
      phone: "555-789-0123"
    }
  },
  {
    id: "bk-005",
    guestName: "Michael Johnson",
    guestType: "VIP",
    sessionName: "Lunch Special",
    sessionId: "ses-003",
    bookingDate: "2025-04-20T13:00:00.000Z",
    createdAt: "2025-04-05T11:15:00.000Z",
    status: "confirmed",
    paymentStatus: "paid",
    totalGuests: 2,
    specialRequests: "Gluten-free options",
    reminderStatus: "sent",
    lastReminderSent: "2025-04-15T14:00:00.000Z",
    reminderCount: 1,
    contactDetails: {
      email: "michael.johnson@example.com",
      phone: "555-234-5678"
    },
    vegCount: 1,
    nonVegCount: 1,
    addonPackage: "Standard"
  }
];

// Mock stats data
export const mockStats: BookingStats = {
  totalBookings: 275,
  confirmedBookings: 195,
  pendingBookings: 65,
  cancelledBookings: 15,
  averagePartySize: 3.8,
  popularSessions: [
    { name: "Sunset Dinner", bookings: 120 },
    { name: "Brunch Experience", bookings: 85 },
    { name: "Lunch Special", bookings: 70 }
  ],
  vipGuestPercentage: 22,
  firstTimeGuestPercentage: 35
};
