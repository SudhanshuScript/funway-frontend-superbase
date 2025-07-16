
import React, { useState, useEffect } from 'react';
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useAuditLogger } from "@/utils/auditLogger";
import { Transaction, Column } from './types';
import { TableHeaderCell } from './components/TableHeader';
import { StatusBadge } from './components/StatusBadge';
import { BookingIdCell, GuestCell, SessionCell, DateCell, AmountCell } from './components/TableCellContent';
import { PaymentStatusCell, CheckInStatusCell } from './components/StatusCells';
import { ActionButtons } from './components/ActionButtons';
import { RescheduleDialog } from './dialogs/RescheduleDialog';
import { AddGuestsDialog } from './dialogs/AddGuestsDialog';

interface BookingTableProps {
  transactions: Transaction[];
  onUpdateStatus?: (id: string, newStatus: string) => void;
  onUpdateCheckIn?: (id: string, newStatus: string) => void;
  onSendReminder?: (id: string) => void;
}

export function BookingTable({ 
  transactions, 
  onUpdateStatus,
  onUpdateCheckIn,
  onSendReminder
}: BookingTableProps) {
  const { logEvent } = useAuditLogger();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [showAddGuestsDialog, setShowAddGuestsDialog] = useState(false);
  const [newGuestCount, setNewGuestCount] = useState(0);
  const [additionalAmount, setAdditionalAmount] = useState(0);
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>(undefined);
  const [rescheduleSession, setRescheduleSession] = useState("");
  const [columns, setColumns] = useState<Column[]>([
    { id: "bookingId", name: "Booking ID", visible: true, order: 0 },
    { id: "guest", name: "Guest", visible: true, order: 1 },
    { id: "session", name: "Session", visible: true, order: 2 },
    { id: "date", name: "Date", visible: true, order: 3 },
    { id: "amount", name: "Amount", visible: true, order: 4 },
    { id: "paymentStatus", name: "Payment Status", visible: true, order: 5 },
    { id: "checkInStatus", name: "Check-In Status", visible: true, order: 6 },
    { id: "actions", name: "Actions", visible: true, order: 7 },
  ]);

  const [draggedColumn, setDraggedColumn] = useState<Column | null>(null);

  const handleDragStart = (column: Column) => {
    setDraggedColumn(column);
  };

  const handleDragOver = (e: React.DragEvent, targetColumn: Column) => {
    e.preventDefault();
    if (!draggedColumn || draggedColumn.id === targetColumn.id) return;
    
    const updatedColumns = [...columns];
    const draggedIndex = updatedColumns.findIndex(col => col.id === draggedColumn.id);
    const targetIndex = updatedColumns.findIndex(col => col.id === targetColumn.id);
    
    const tempOrder = updatedColumns[draggedIndex].order;
    updatedColumns[draggedIndex].order = updatedColumns[targetIndex].order;
    updatedColumns[targetIndex].order = tempOrder;
    
    updatedColumns.sort((a, b) => a.order - b.order);
    setColumns(updatedColumns);
  };

  const handleDragEnd = () => {
    setDraggedColumn(null);
    localStorage.setItem("bookingTableColumns", JSON.stringify(columns));
  };

  useEffect(() => {
    const savedColumns = localStorage.getItem("bookingTableColumns");
    if (savedColumns) {
      setColumns(JSON.parse(savedColumns));
    }
  }, []);

  const handleStatusUpdate = (id: string, newStatus: string) => {
    if (onUpdateStatus) {
      onUpdateStatus(id, newStatus);
      logEvent("booking", id, "status_changed", { new_status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
    }
  };

  const handleCheckInUpdate = (id: string, newStatus: string) => {
    if (onUpdateCheckIn) {
      onUpdateCheckIn(id, newStatus);
      logEvent("booking", id, "status_changed", { check_in_status: newStatus });
      toast.success(`Check-in status updated to ${newStatus}`);
    }
  };

  const handleSendReminder = (id: string) => {
    if (onSendReminder) {
      onSendReminder(id);
      logEvent("booking", id, "reminder_sent");
    }
  };

  const handleReschedule = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setRescheduleDate(undefined);
    setRescheduleSession("");
    setShowRescheduleDialog(true);
  };

  const confirmReschedule = () => {
    if (!selectedTransaction || !rescheduleDate || !rescheduleSession) {
      toast.error("Please select a date and session");
      return;
    }
    
    logEvent(
      "booking", 
      selectedTransaction.id, 
      "booking_rescheduled", 
      { 
        original_date: selectedTransaction.date, 
        new_date: format(rescheduleDate, "yyyy-MM-dd"),
        new_session: rescheduleSession 
      }
    );
    
    toast.success("Booking rescheduled successfully");
    setShowRescheduleDialog(false);
  };

  const handleAddGuests = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setNewGuestCount(0);
    setAdditionalAmount(0);
    setShowAddGuestsDialog(true);
  };

  const calculateAdditionalAmount = (count: number) => {
    if (!selectedTransaction) return 0;
    const perGuestRate = selectedTransaction.amount / selectedTransaction.totalGuests;
    setAdditionalAmount(count * perGuestRate);
    return count * perGuestRate;
  };

  const confirmAddGuests = () => {
    if (!selectedTransaction || newGuestCount <= 0) {
      toast.error("Please enter a valid number of guests");
      return;
    }
    
    logEvent(
      "booking", 
      selectedTransaction.id, 
      "guests_added", 
      { 
        original_count: selectedTransaction.totalGuests, 
        additional_count: newGuestCount,
        additional_amount: additionalAmount
      }
    );
    
    toast.success(`Added ${newGuestCount} guests and charged $${additionalAmount.toFixed(2)}`);
    setShowAddGuestsDialog(false);
  };

  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);
  const visibleColumns = sortedColumns.filter(col => col.visible);

  return (
    <>
      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.map((column) => (
                <TableHeaderCell
                  key={column.id}
                  column={column}
                  handleDragStart={handleDragStart}
                  handleDragOver={handleDragOver}
                  handleDragEnd={handleDragEnd}
                />
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                {visibleColumns.map(column => {
                  switch (column.id) {
                    case "bookingId":
                      return (
                        <TableCell key={`${transaction.id}-${column.id}`}>
                          <BookingIdCell id={transaction.bookingId} />
                        </TableCell>
                      );
                    case "guest":
                      return (
                        <TableCell key={`${transaction.id}-${column.id}`}>
                          <GuestCell transaction={transaction} />
                        </TableCell>
                      );
                    case "session":
                      return (
                        <TableCell key={`${transaction.id}-${column.id}`}>
                          <SessionCell name={transaction.sessionName} />
                        </TableCell>
                      );
                    case "date":
                      return (
                        <TableCell key={`${transaction.id}-${column.id}`}>
                          <DateCell date={transaction.date} />
                        </TableCell>
                      );
                    case "amount":
                      return (
                        <TableCell key={`${transaction.id}-${column.id}`}>
                          <AmountCell amount={transaction.amount} />
                        </TableCell>
                      );
                    case "paymentStatus":
                      return (
                        <TableCell key={`${transaction.id}-${column.id}`}>
                          <PaymentStatusCell 
                            status={transaction.status} 
                            id={transaction.id}
                            onStatusUpdate={handleStatusUpdate}
                          />
                        </TableCell>
                      );
                    case "checkInStatus":
                      return (
                        <TableCell key={`${transaction.id}-${column.id}`}>
                          <CheckInStatusCell 
                            status={transaction.checkInStatus} 
                            id={transaction.id}
                            onStatusUpdate={handleCheckInUpdate}
                          />
                        </TableCell>
                      );
                    case "actions":
                      return (
                        <TableCell key={`${transaction.id}-${column.id}`} className="sticky right-0 bg-background/90 dark:bg-background/30 shadow-sm">
                          <ActionButtons 
                            transaction={transaction}
                            onSendReminder={handleSendReminder}
                            onReschedule={handleReschedule}
                            onAddGuests={handleAddGuests}
                          />
                        </TableCell>
                      );
                    default:
                      return <TableCell key={`${transaction.id}-${column.id}`}></TableCell>;
                  }
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <RescheduleDialog
        open={showRescheduleDialog}
        onOpenChange={setShowRescheduleDialog}
        selectedTransaction={selectedTransaction}
        rescheduleDate={rescheduleDate}
        setRescheduleDate={setRescheduleDate}
        rescheduleSession={rescheduleSession}
        setRescheduleSession={setRescheduleSession}
        onConfirm={confirmReschedule}
      />

      <AddGuestsDialog
        open={showAddGuestsDialog}
        onOpenChange={setShowAddGuestsDialog}
        selectedTransaction={selectedTransaction}
        newGuestCount={newGuestCount}
        setNewGuestCount={setNewGuestCount}
        additionalAmount={additionalAmount}
        calculateAdditionalAmount={calculateAdditionalAmount}
        onConfirm={confirmAddGuests}
      />
    </>
  );
}
