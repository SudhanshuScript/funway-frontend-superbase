
import { z } from "zod";
import { GuestType, PaymentMethodType } from "@/types/bookingTypes";

export const bookingFormSchema = z.object({
  experienceDate: z.date({
    required_error: "Please select a date for your experience",
  }),
  sessionType: z.string().min(1, "Please select a session type"),
  sessionName: z.string().optional(),
  customSessionName: z.string().optional(),
  bookingDate: z.string().optional(),
  bookingTime: z.string().optional(),
  addonPackage: z.string().optional(),
  
  guestName: z.string().min(2, "Guest name is required"),
  contactNumber: z.string().min(7, "Valid contact number is required"),
  email: z.string().email("Valid email address is required"),
  customerType: z.string().default("First-Time"),
  numberOfGuests: z.number().min(1, "At least one guest is required").max(12, "Maximum 12 guests allowed"),
  totalGuests: z.number().optional(),
  vegCount: z.number().optional(),
  nonVegCount: z.number().optional(),
  
  paymentStatus: z.string().default("Unpaid"),
  paymentMethod: z.string().optional(),
  upiId: z.string().optional(),
  walletProvider: z.string().optional(),
  walletNumber: z.string().optional(),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifscCode: z.string().optional(),
  
  bookingStatus: z.string().default("Confirmed"),
  offerCode: z.string().default("none"),
  specialRequests: z.string().optional(),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

export interface BookingFormProps {
  onSubmit: (data: BookingFormValues) => Promise<void>;
  onCancel: () => void;
  initialValues?: Partial<BookingFormValues>;
}

export const BOOKING_FORM_STEPS = [
  { id: "session", title: "Select Date & Session" },
  { id: "guest", title: "Guest Details" },
  { id: "payment", title: "Payment & Summary" },
  { id: "success", title: "Booking Confirmed" }
];
