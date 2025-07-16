
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Edit, Copy, Power, Trash, MoreHorizontal, Star, Check, PowerOff } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface SessionCardProps {
  id: string;
  name: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  bookedCount: number;
  isActive: boolean;
  isSpecialDate?: boolean;
  specialDateName?: string;
  specialPricing?: number;
  deactivationReason?: string;
  onEdit: () => void;
  onDelete: () => void;
  onDeactivate: () => void;
  onClone: () => void;
  onToggleActive: () => void;
}

export function SessionCard({
  id,
  name,
  type,
  date,
  startTime,
  endTime,
  maxCapacity,
  bookedCount,
  isActive,
  isSpecialDate,
  specialDateName,
  specialPricing,
  deactivationReason,
  onEdit,
  onDelete,
  onDeactivate,
  onClone,
  onToggleActive
}: SessionCardProps) {
  const bookingPercentage = Math.round((bookedCount / maxCapacity) * 100);
  const formattedDate = format(new Date(date), "EEE, MMM d, yyyy");

  const getTypeColor = () => {
    if (isSpecialDate) return "bg-purple-500/20 text-purple-600";
    
    switch(type.toLowerCase()) {
      case "airline":
      case "flight":
        return "bg-blue-500/20 text-blue-600";
      case "dining":
      case "dinner":
      case "lunch":
        return "bg-amber-500/20 text-amber-600";
      case "amusement":
      case "entertainment":
        return "bg-green-500/20 text-green-600";
      default:
        return "bg-gray-500/20 text-gray-600";
    }
  };

  const getBookingStatusColor = () => {
    if (bookingPercentage >= 90) return "bg-red-100 text-red-700";
    if (bookingPercentage >= 70) return "bg-amber-100 text-amber-700";
    if (bookingPercentage >= 40) return "bg-green-100 text-green-700";
    return "bg-blue-100 text-blue-700";
  };

  const getBookingStatusText = () => {
    if (bookingPercentage === 100) return "Fully Booked";
    if (bookingPercentage >= 90) return "Almost Full";
    if (bookingPercentage >= 70) return "Filling Fast";
    if (bookingPercentage >= 40) return "Good Availability";
    return "High Availability";
  };

  return (
    <Card className="overflow-hidden border-l-4 transition-all hover:shadow-md" style={{
      borderLeftColor: isActive ? (isSpecialDate ? "#9333ea" : "#3b82f6") : "#6b7280"
    }}>
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className={`md:w-24 p-4 flex items-center justify-center ${getTypeColor()}`}>
            <div className="text-center">
              <div className="text-sm font-medium">{startTime}</div>
              <div className="text-xs">to</div>
              <div className="text-sm font-medium">{endTime}</div>
            </div>
          </div>
          
          <div className="p-4 flex-1">
            <div className="flex flex-col md:flex-row md:items-start gap-4 justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-base">{name}</h3>
                  {isSpecialDate && (
                    <Badge variant="outline" className="border-purple-500 text-purple-600 flex items-center gap-1">
                      <Star className="h-3 w-3" fill="currentColor" />
                      Special
                    </Badge>
                  )}
                  {!isActive && (
                    <Badge variant="outline" className="border-gray-500 text-gray-600 flex items-center gap-1">
                      <PowerOff className="h-3 w-3" />
                      Inactive
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{formattedDate}</p>
                
                {!isActive && deactivationReason && (
                  <div className="mt-1 text-xs text-gray-500 italic">
                    Reason: {deactivationReason}
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-3 md:text-right">
                <div className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap 
                  ${getBookingStatusColor()}">
                  {bookingPercentage}% Booked
                </div>
                
                <div className="text-xs md:text-right">
                  <span className="font-medium">{bookedCount}</span>
                  <span className="text-muted-foreground">/{maxCapacity} seats</span>
                </div>
                
                {specialPricing && (
                  <div className="text-xs md:text-right whitespace-nowrap">
                    <span className="font-medium">${specialPricing.toFixed(2)}</span>
                    <span className="text-muted-foreground">/person</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t flex justify-between items-center">
              <div className="flex-1">
                <div className="bg-muted rounded-full h-1.5 w-full overflow-hidden">
                  <div className="h-full rounded-full" style={{
                    width: `${bookingPercentage}%`,
                    backgroundColor: bookingPercentage >= 90 ? '#ef4444' : 
                                    bookingPercentage >= 70 ? '#f59e0b' : 
                                    bookingPercentage >= 40 ? '#22c55e' : '#3b82f6'
                  }}></div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {getBookingStatusText()}
                </div>
              </div>
              
              <div className="flex gap-2 ml-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onEdit}>
                      <Edit className="mr-2 h-4 w-4" /> Edit Session
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onClone}>
                      <Copy className="mr-2 h-4 w-4" /> Clone Session
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {isActive ? (
                      <DropdownMenuItem onClick={onDeactivate} className="text-amber-600">
                        <PowerOff className="mr-2 h-4 w-4" /> Deactivate Session
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={onToggleActive} className="text-green-600">
                        <Check className="mr-2 h-4 w-4" /> Activate Session
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={onDelete} className="text-destructive">
                      <Trash className="mr-2 h-4 w-4" /> Delete Session
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button variant="outline" size="sm" onClick={onEdit}>
                  <Edit className="h-4 w-4" />
                </Button>
                
                {isActive ? (
                  <Button variant="outline" size="sm" onClick={onDeactivate}>
                    <PowerOff className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="text-green-600" onClick={onToggleActive}>
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                
                <Button variant="outline" size="sm" onClick={onClone}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
