
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { ReminderMethod, ReminderTemplate } from '@/types/bookingTypes';
import { toast } from "sonner";
import { TemplateTable } from './templates/TemplateTable';
import { TemplateForm } from './templates/TemplateForm';
import { DeleteTemplateDialog } from './templates/DeleteTemplateDialog';

interface ReminderTemplatesProps {
  templates: ReminderTemplate[];
  onCreateTemplate: (template: Omit<ReminderTemplate, 'id'>) => Promise<void>;
  onUpdateTemplate: (id: string, template: Partial<ReminderTemplate>) => Promise<void>;
  onDeleteTemplate: (id: string) => Promise<void>;
}

export function ReminderTemplates({ 
  templates, 
  onCreateTemplate, 
  onUpdateTemplate,
  onDeleteTemplate 
}: ReminderTemplatesProps) {
  // State management
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ReminderTemplate | null>(null);
  const [formData, setFormData] = useState<Omit<ReminderTemplate, 'id'>>({
    name: '',
    subject: '',
    body: '',
    method: 'email' as ReminderMethod,
    isDefault: false
  });

  // Handler functions
  const handleOpenCreateDialog = () => {
    setSelectedTemplate(null);
    setFormData({
      name: '',
      subject: '',
      body: '',
      method: 'email' as ReminderMethod,
      isDefault: false
    });
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (template: ReminderTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      name: template.name,
      subject: template.subject || '',
      body: template.body,
      method: template.method,
      isDefault: template.isDefault
    });
    setIsDialogOpen(true);
  };

  const handleOpenDeleteDialog = (template: ReminderTemplate) => {
    setSelectedTemplate(template);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async () => {
    try {
      if (selectedTemplate) {
        await onUpdateTemplate(selectedTemplate.id, formData);
        toast.success("Template updated successfully");
      } else {
        await onCreateTemplate(formData);
        toast.success("Template created successfully");
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to save template");
      console.error("Error saving template:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedTemplate) return;

    try {
      await onDeleteTemplate(selectedTemplate.id);
      toast.success("Template deleted successfully");
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete template");
      console.error("Error deleting template:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Reminder Templates</h2>
        <Button onClick={handleOpenCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>

      <TemplateTable 
        templates={templates}
        onEditTemplate={handleOpenEditDialog}
        onDeleteTemplate={handleOpenDeleteDialog}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <TemplateForm 
          formData={formData}
          onInputChange={handleInputChange}
          onSelectChange={handleSelectChange}
          onCheckboxChange={handleCheckboxChange}
          onCancel={() => setIsDialogOpen(false)}
          onSubmit={handleSubmit}
          isEditing={!!selectedTemplate}
        />
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DeleteTemplateDialog
          template={selectedTemplate}
          onCancel={() => setIsDeleteDialogOpen(false)}
          onConfirmDelete={handleDelete}
        />
      </Dialog>
    </div>
  );
}
