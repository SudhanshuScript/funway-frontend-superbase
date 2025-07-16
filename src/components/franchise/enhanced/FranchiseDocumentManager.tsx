
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { File, Upload, Calendar, Download, Eye, Trash2, AlertTriangle } from 'lucide-react';
import { FranchiseDocument, DocumentType, DocumentStatus } from '@/types/franchiseManagement';

interface FranchiseDocumentManagerProps {
  franchiseId: string;
  canManage: boolean;
}

const FranchiseDocumentManager: React.FC<FranchiseDocumentManagerProps> = ({ 
  franchiseId,
  canManage 
}) => {
  // Mock documents - in a real app, these would come from the API
  const [documents, setDocuments] = useState<FranchiseDocument[]>([]);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'business_license' as DocumentType,
    expirationDate: '',
    notes: ''
  });
  
  const handleUploadDocument = () => {
    setOpenUploadDialog(true);
  };
  
  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleFormSubmit = () => {
    // Validation
    if (!formData.name) {
      toast.error("Document name is required");
      return;
    }
    
    // In a real app, this would upload the file to storage and create a DB record
    const newDocument: FranchiseDocument = {
      id: `doc-${Date.now()}`,
      franchiseId,
      name: formData.name,
      type: formData.type,
      fileUrl: '#', // Would be the actual URL in a real app
      status: 'pending',
      uploadedBy: 'Current User',
      uploadedAt: new Date().toISOString(),
      expirationDate: formData.expirationDate || undefined,
      notes: formData.notes || undefined
    };
    
    setDocuments(prev => [...prev, newDocument]);
    toast.success("Document uploaded successfully");
    setOpenUploadDialog(false);
    
    // Reset form
    setFormData({
      name: '',
      type: 'business_license',
      expirationDate: '',
      notes: ''
    });
  };
  
  const handleDeleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    toast.success("Document deleted");
  };
  
  const getDocumentTypeName = (type: DocumentType) => {
    switch (type) {
      case 'business_license': return 'Business License';
      case 'tax': return 'Tax Document';
      case 'kyc': return 'KYC Document';
      case 'legal': return 'Legal Document';
      default: return 'Other Document';
    }
  };
  
  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'valid':
        return <Badge className="bg-green-500 hover:bg-green-600">Valid</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300">Pending</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Document Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage documents for this franchise
          </p>
        </div>
        
        {canManage && (
          <Button onClick={handleUploadDocument}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        )}
      </div>
      
      {documents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <File className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Documents Yet</h3>
            <p className="text-muted-foreground text-center mb-6">
              This franchise doesn't have any documents uploaded yet.
            </p>
            {canManage && (
              <Button onClick={handleUploadDocument}>
                <Upload className="h-4 w-4 mr-2" />
                Upload First Document
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-0">
            <CardTitle>Franchise Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Expiration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <File className="h-4 w-4 mr-2 text-muted-foreground" />
                        {doc.name}
                      </div>
                    </TableCell>
                    <TableCell>{getDocumentTypeName(doc.type)}</TableCell>
                    <TableCell>{formatDate(doc.uploadedAt)}</TableCell>
                    <TableCell>{formatDate(doc.expirationDate)}</TableCell>
                    <TableCell>
                      {getStatusBadge(doc.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                        {canManage && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                            onClick={() => handleDeleteDocument(doc.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      <Dialog open={openUploadDialog} onOpenChange={setOpenUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a document for this franchise.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Document Name</Label>
              <Input
                id="name"
                placeholder="Enter document name"
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="type">Document Type</Label>
              <Select 
                value={formData.type}
                onValueChange={(value) => handleFormChange('type', value)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business_license">Business License</SelectItem>
                  <SelectItem value="tax">Tax Document</SelectItem>
                  <SelectItem value="kyc">KYC Document</SelectItem>
                  <SelectItem value="legal">Legal Document</SelectItem>
                  <SelectItem value="other">Other Document</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="file">Document File</Label>
              <div className="border border-input rounded-md p-6 bg-background">
                <div className="flex flex-col items-center gap-4">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-sm font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground">
                      PDF, JPG, PNG, or DOC up to 10MB
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Note: Document upload will be implemented in a future update
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="expirationDate">Expiration Date (if applicable)</Label>
              <Input
                id="expirationDate"
                type="date"
                value={formData.expirationDate}
                onChange={(e) => handleFormChange('expirationDate', e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional information about this document"
                value={formData.notes}
                onChange={(e) => handleFormChange('notes', e.target.value)}
              />
            </div>
            
            <div className="bg-muted p-3 rounded-md flex items-start gap-2 mt-1">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Uploaded documents will be reviewed by the admin team before being marked as valid.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenUploadDialog(false)}>Cancel</Button>
            <Button onClick={handleFormSubmit}>Upload Document</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FranchiseDocumentManager;
