
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from 'date-fns';
import { FollowUpRecord } from '@/types/bookingTypes';
import { Check, Clock, Eye, Mail, MessageSquare, X } from "lucide-react";
import { Button } from '@/components/ui/button';

interface FollowUpHistoryProps {
  followUps: FollowUpRecord[];
  onViewDetails?: (id: string) => void;
}

export function FollowUpHistory({ followUps, onViewDetails }: FollowUpHistoryProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">Delivered</Badge>;
      case 'opened':
        return <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300">Opened</Badge>;
      case 'responded':
        return <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">Responded</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'email':
        return <Mail className="h-4 w-4 mr-1" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4 mr-1" />;
      case 'whatsapp':
        return <MessageSquare className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Cart ID</TableHead>
            <TableHead>Guest</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Sent At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Response</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {followUps.map((followUp) => (
            <TableRow key={followUp.id}>
              <TableCell className="font-medium">{followUp.id}</TableCell>
              <TableCell>{followUp.cartId}</TableCell>
              <TableCell>{followUp.guestName}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  {getMethodIcon(followUp.method)}
                  {followUp.method === 'email' ? 'Email' : followUp.method === 'sms' ? 'SMS' : 'WhatsApp'}
                </div>
              </TableCell>
              <TableCell>{format(parseISO(followUp.sentAt), 'MMM d, yyyy h:mm a')}</TableCell>
              <TableCell>{getStatusBadge(followUp.status)}</TableCell>
              <TableCell>
                {followUp.responseTimestamp ? (
                  <div className="flex items-center text-green-600">
                    <Check className="h-4 w-4 mr-1" />
                    {format(parseISO(followUp.responseTimestamp), 'MMM d, yyyy')}
                  </div>
                ) : (
                  <div className="flex items-center text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    Not yet
                  </div>
                )}
              </TableCell>
              <TableCell>
                {followUp.discountOffered ? (
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-500">
                    {followUp.discountOffered}
                  </Badge>
                ) : (
                  <span className="text-gray-500">-</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onViewDetails && onViewDetails(followUp.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
