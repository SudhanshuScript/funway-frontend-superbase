
export interface Transaction {
  id: string;
  date: string;
  bookingId: string;
  customer: string;
  totalGuests: number;
  amount: number;
  status: string;
  checkInStatus?: string;
  method: string;
  franchise: string;
  sessionName: string;
  guestType?: "Regular" | "VIP" | "First Timer";
  dueAmount?: number;
}

export interface Column {
  id: string;
  name: string;
  visible: boolean;
  order: number;
}
