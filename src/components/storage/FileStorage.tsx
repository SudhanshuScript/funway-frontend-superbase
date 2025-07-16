
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/providers/UserRoleProvider";
import { Loader2, Upload, Download, Trash2 } from "lucide-react";
import { trackStorage } from "@/utils/supabaseUsageTracker";

const FileStorage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { currentUser } = useUserRole();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .storage
        .from('user-files')
        .list(`${currentUser?.id || 'shared'}`, {
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (error) {
        throw error;
      }

      setFiles(data || []);
    } catch (error: any) {
      console.error('Error fetching files:', error);
      toast({
        variant: "destructive",
        title: "Error fetching files",
        description: error.message || "Could not load your files",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !currentUser) return;
    
    try {
      setUploading(true);
      
      // Create a unique file name to prevent conflicts
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 11)}_${Date.now()}.${fileExt}`;
      const filePath = `${currentUser.id}/${fileName}`;
      
      const { error } = await supabase
        .storage
        .from('user-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (error) {
        throw error;
      }
      
      // Track storage upload
      trackStorage('upload');
      
      toast({
        title: "File uploaded",
        description: "Your file was uploaded successfully",
      });
      
      setFile(null);
      fetchFiles();
    } catch (error: any) {
      console.error('Error uploading:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (filePath: string) => {
    try {
      const { data, error } = await supabase
        .storage
        .from('user-files')
        .download(`${currentUser?.id || 'shared'}/${filePath}`);
        
      if (error) {
        throw error;
      }
      
      // Track storage download
      trackStorage('download');
      
      // Create a download link and click it
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = filePath;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      a.remove();
    } catch (error: any) {
      console.error('Error downloading:', error);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: error.message,
      });
    }
  };

  const handleDelete = async (filePath: string) => {
    try {
      const { error } = await supabase
        .storage
        .from('user-files')
        .remove([`${currentUser?.id || 'shared'}/${filePath}`]);
        
      if (error) {
        throw error;
      }
      
      // Track storage delete
      trackStorage('delete');
      
      toast({
        title: "File deleted",
        description: "Your file was deleted successfully",
      });
      
      fetchFiles();
    } catch (error: any) {
      console.error('Error deleting:', error);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error.message,
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>File Storage</CardTitle>
        <CardDescription>Upload, download, and manage your files</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Input 
              type="file" 
              onChange={handleFileChange}
              disabled={uploading}
              className="flex-1"
            />
            <Button 
              onClick={handleUpload} 
              disabled={!file || uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" /> Upload
                </>
              )}
            </Button>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Your Files</h3>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : files.length > 0 ? (
              <ul className="divide-y">
                {files.map((file) => (
                  <li key={file.id} className="flex justify-between items-center py-2">
                    <span>{file.name}</span>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDownload(file.name)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(file.name)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No files found. Upload your first file!
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">Files are stored securely in Supabase Storage</p>
      </CardFooter>
    </Card>
  );
};

export default FileStorage;
