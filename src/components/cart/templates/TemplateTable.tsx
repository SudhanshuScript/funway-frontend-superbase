
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash, Mail, MessageSquare } from "lucide-react";
import { ReminderMethod, ReminderTemplate } from '@/types/bookingTypes';

interface TemplateTableProps {
  templates: ReminderTemplate[];
  onEditTemplate: (template: ReminderTemplate) => void;
  onDeleteTemplate: (template: ReminderTemplate) => void;
}

export function TemplateTable({ templates, onEditTemplate, onDeleteTemplate }: TemplateTableProps) {
  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'email':
        return <Mail className="h-4 w-4 mr-1" />;
      case 'sms':
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
            <TableHead>Name</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Body</TableHead>
            <TableHead>Default</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template) => (
            <TableRow key={template.id}>
              <TableCell className="font-medium">{template.name}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  {getMethodIcon(template.method)}
                  {template.method === 'email' ? 'Email' : template.method === 'sms' ? 'SMS' : 'WhatsApp'}
                </div>
              </TableCell>
              <TableCell>{template.subject || '-'}</TableCell>
              <TableCell className="max-w-[300px] truncate">{template.body}</TableCell>
              <TableCell>
                {template.isDefault && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                    Default
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => onEditTemplate(template)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDeleteTemplate(template)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
