
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Search, Filter } from "lucide-react";

interface CartManagerHeaderProps {
  onOpenBulkReminder: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function CartManagerHeader({
  onOpenBulkReminder,
  searchQuery,
  onSearchChange
}: CartManagerHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 items-center mb-6">
      <h2 className="text-2xl font-bold uppercase tracking-wide bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Abandoned Cart Management</h2>
      
      <div className="flex flex-col sm:flex-row gap-3 items-center w-full sm:w-auto">
        <div className="relative w-full sm:w-auto">
          <Input
            placeholder="Search by name, session or ID…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 w-full sm:w-[280px] rounded-lg shadow-sm border-gyro-border bg-gyro-dark text-white focus:border-gyro-blue/50 focus:ring-1 focus:ring-gyro-blue/30"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
        
        <Button 
          onClick={onOpenBulkReminder} 
          className="w-full sm:w-auto transition-all duration-300 bg-gradient-to-r from-gyro-blue to-gyro-purple hover:shadow-lg hover:shadow-gyro-purple/20 hover:-translate-y-0.5 active:translate-y-0.5 rounded-full"
        >
          <Send className="h-4 w-4 mr-2" /> Send Bulk Reminders
        </Button>
      </div>
    </div>
  );
}
