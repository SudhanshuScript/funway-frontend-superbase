
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface Template {
  id: string;
  name: string;
  content: string;
  category: string;
}

export function AutomatedReplies() {
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: "1",
      name: "Initial Greeting",
      content: "Thank you for your interest in SkyBistro! How can we assist you today?",
      category: "Welcome"
    },
    {
      id: "2",
      name: "Session Inquiry Response",
      content: "We offer multiple dining experiences throughout the day. Would you like to know more about our breakfast, lunch, or dinner sessions?",
      category: "Inquiries"
    },
    {
      id: "3",
      name: "Follow-up Message",
      content: "I wanted to follow up on our previous conversation. Are you still interested in dining with us?",
      category: "Follow-up"
    },
    {
      id: "4",
      name: "Booking Confirmation",
      content: "Your booking has been confirmed! We look forward to hosting you soon.",
      category: "Booking"
    }
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    content: "",
    category: "Welcome"
  });
  
  const handleOpenDialog = (template?: Template) => {
    if (template) {
      setCurrentTemplate(template);
      setFormData({
        name: template.name,
        content: template.content,
        category: template.category
      });
    } else {
      setCurrentTemplate(null);
      setFormData({
        name: "",
        content: "",
        category: "Welcome"
      });
    }
    setIsDialogOpen(true);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentTemplate) {
      // Update existing template
      setTemplates(prev => 
        prev.map(t => 
          t.id === currentTemplate.id 
            ? { ...t, name: formData.name, content: formData.content, category: formData.category } 
            : t
        )
      );
      toast.success("Template updated successfully");
    } else {
      // Add new template
      const newTemplate: Template = {
        id: `${Date.now()}`,
        name: formData.name,
        content: formData.content,
        category: formData.category
      };
      setTemplates(prev => [...prev, newTemplate]);
      toast.success("Template added successfully");
    }
    
    setIsDialogOpen(false);
  };
  
  const handleDeleteClick = (template: Template) => {
    setCurrentTemplate(template);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDelete = () => {
    if (currentTemplate) {
      setTemplates(prev => prev.filter(t => t.id !== currentTemplate.id));
      toast.success("Template deleted successfully");
    }
    setIsDeleteDialogOpen(false);
  };
  
  const categories = Array.from(new Set(templates.map(t => t.category)));

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Automated Replies</h2>
          <p className="text-muted-foreground">Manage templates for quick responses</p>
        </div>
        
        <Button onClick={() => handleOpenDialog()} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Add Template
        </Button>
      </div>
      
      <div className="space-y-6">
        {categories.map(category => (
          <Card key={category} className="overflow-hidden">
            <CardHeader className="bg-muted/50 pb-2">
              <CardTitle className="text-lg">{category}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates
                    .filter(t => t.category === category)
                    .map(template => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">{template.name}</TableCell>
                        <TableCell className="max-w-md truncate">
                          {template.content}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenDialog(template)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(template)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentTemplate ? "Edit Template" : "Add Template"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Template Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                placeholder="Template Category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Template Content</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Template Content"
                value={formData.content}
                onChange={handleChange}
                rows={5}
                required
              />
            </div>
            
            <DialogFooter className="sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {currentTemplate ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the template "{currentTemplate?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
