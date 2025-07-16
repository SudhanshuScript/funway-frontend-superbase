
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserRole } from "@/providers/UserRoleProvider";
import { useNavigate } from "react-router-dom";
import { CreditCard, Download, Filter, Search, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingTable } from "@/components/payments/BookingTable";
import { Transaction } from "@/components/payments/types";
import { usePendingPayments } from "@/components/payments/usePendingPayments";
import { BookingFilters, FilterOption } from "@/components/payments/BookingFilters";
import { toast } from "sonner";

const transactions: Transaction[] = [
  {
    id: "TRX-001",
    date: "2023-05-10",
    bookingId: "BK-2023-001",
    customer: "John Smith",
    totalGuests: 2,
    amount: 199.99,
    status: "Paid",
    checkInStatus: "Checked-In",
    method: "Credit Card",
    franchise: "SkyBistro Central",
    sessionName: "Breakfast",
    guestType: "Regular"
  },
  {
    id: "TRX-002",
    date: "2023-05-12",
    bookingId: "BK-2023-002",
    customer: "Emily Johnson",
    totalGuests: 1,
    amount: 89.99,
    status: "Pending",
    checkInStatus: "Awaited",
    method: "PayPal",
    franchise: "SkyBistro North",
    sessionName: "Lunch",
    guestType: "First Timer"
  },
  {
    id: "TRX-003",
    date: "2023-05-15",
    bookingId: "BK-2023-003",
    customer: "Robert Chen",
    totalGuests: 5,
    amount: 349.99,
    status: "Paid",
    checkInStatus: "Checked-In",
    method: "Credit Card",
    franchise: "FunWay East",
    sessionName: "Sunset Dinner",
    guestType: "VIP"
  },
  {
    id: "TRX-004",
    date: "2023-05-17",
    bookingId: "BK-2023-004",
    customer: "Sarah Williams",
    totalGuests: 3,
    amount: 159.99,
    status: "Refunded",
    checkInStatus: "Awaited",
    method: "Credit Card",
    franchise: "SkyBistro Central",
    sessionName: "Brunch",
    guestType: "Regular"
  },
  {
    id: "TRX-005",
    date: "2023-05-20",
    bookingId: "BK-2023-005",
    customer: "Michael Davis",
    totalGuests: 4,
    amount: 249.99,
    status: "Paid",
    checkInStatus: "Checked-In",
    method: "Bank Transfer",
    franchise: "FunWay West",
    sessionName: "Dinner",
    guestType: "VIP"
  }
];

const Payments = () => {
  const { currentUser } = useUserRole();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const { pendingPayments: pendingBookings, sendPaymentReminder } = usePendingPayments();
  const [showStatsView, setShowStatsView] = useState(true);
  const [activeFilters, setActiveFilters] = useState<FilterOption[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    let filtered = transactions;
    
    if (activeTab !== "all") {
      filtered = filtered.filter(transaction => 
        transaction.status.toLowerCase() === activeTab
      );
    }
    
    activeFilters.forEach(filter => {
      filtered = filtered.filter(transaction => {
        const transactionValue = transaction[filter.column as keyof Transaction];
        
        if (!transactionValue) return false;
        
        switch (filter.type) {
          case 'text':
            return String(transactionValue).toLowerCase().includes(String(filter.value).toLowerCase());
          case 'select':
            return String(transactionValue) === String(filter.value);
          case 'dateRange':
            const dateValue = new Date(String(transactionValue));
            const [startDate, endDate] = filter.value as [Date | undefined, Date | undefined];
            if (startDate && endDate) {
              return dateValue >= startDate && dateValue <= endDate;
            } else if (startDate) {
              return dateValue >= startDate;
            } else if (endDate) {
              return dateValue <= endDate;
            }
            return true;
          case 'numberRange':
            const numValue = Number(transactionValue);
            const [min, max] = filter.value as [number, number];
            return numValue >= min && numValue <= max;
          default:
            return true;
        }
      });
    });
    
    setFilteredTransactions(filtered);
  }, [activeTab, activeFilters]);

  if (!currentUser) {
    return null;
  }

  const handleSendReminder = async (bookingId: string) => {
    try {
      await sendPaymentReminder(bookingId);
      toast.success("Payment reminder sent successfully!");
    } catch (error) {
      toast.error("Failed to send payment reminder. Please try again.");
    }
  };

  const handleBulkReminders = () => {
    toast.success("Bulk reminders sent successfully!");
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    toast.success(`Status for booking ${id} updated to ${newStatus}`);
  };

  const handleUpdateCheckIn = (id: string, newStatus: string) => {
    toast.success(`Check-in status for booking ${id} updated to ${newStatus}`);
  };

  const handleExportStats = () => {
    toast.success("Stats exported successfully!");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CreditCard className="h-6 w-6 mr-2" />
            <h2 className="text-2xl font-bold">Booking Management</h2>
          </div>
          <div className="flex space-x-2">
            <Button>
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Pending Payment Guests</CardTitle>
              <Button onClick={handleBulkReminders}>
                <Send className="mr-2 h-4 w-4" /> Send Bulk Reminders
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <BookingTable 
              transactions={pendingBookings.map(booking => ({
                id: booking.id,
                date: booking.bookingDate,
                bookingId: booking.id,
                customer: booking.guestName,
                totalGuests: booking.totalGuests,
                amount: booking.dueAmount,
                status: booking.paymentStatus,
                method: "Credit Card",
                franchise: "SkyBistro Central",
                sessionName: booking.sessionName,
                guestType: booking.guestType as any,
                checkInStatus: "Awaited"
              }))} 
              onUpdateStatus={handleUpdateStatus}
              onUpdateCheckIn={handleUpdateCheckIn}
              onSendReminder={handleSendReminder}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Bookings</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="refunded">Refunded</TabsTrigger>
              </TabsList>
              
              <div className="mb-4">
                <BookingFilters 
                  onFilterChange={setActiveFilters} 
                  activeFilters={activeFilters} 
                />
              </div>
              
              <BookingTable 
                transactions={filteredTransactions} 
                onUpdateStatus={handleUpdateStatus}
                onUpdateCheckIn={handleUpdateCheckIn}
                onSendReminder={handleSendReminder}
              />
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Payments;
