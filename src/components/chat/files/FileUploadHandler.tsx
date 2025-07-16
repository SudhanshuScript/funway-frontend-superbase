
import React, { useState } from 'react';
import { Paperclip, X, FileText, Image, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FileUploadHandlerProps {
  onFilesSelected: (files: File[]) => void;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
}

export function FileUploadHandler({
  onFilesSelected,
  maxSize = 10, // Default 10MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain']
}: FileUploadHandlerProps) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      processFiles(Array.from(fileList));
    }
  };
  
  const processFiles = (files: File[]) => {
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      // Check file type
      if (!acceptedTypes.includes(file.type)) {
        toast.error(`File type not supported: ${file.name}`);
        return false;
      }
      
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`File too large: ${file.name}. Max size: ${maxSize}MB`);
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
      
      // Reset file input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };
  
  const handleDragLeave = () => {
    setDragOver(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div
      className={`relative ${dragOver ? 'border-primary' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input 
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={handleFileChange}
      />
      
      <Button 
        type="button"
        variant="ghost"
        size="icon"
        onClick={triggerFileInput}
      >
        <Paperclip className="h-4 w-4" />
      </Button>
      
      {dragOver && (
        <div className="absolute -top-20 left-0 right-0 bg-background border border-dashed border-primary rounded-md p-4 shadow-md z-10 text-center">
          <p className="text-sm text-muted-foreground">Drop files here to attach</p>
        </div>
      )}
    </div>
  );
}

export function FilePreview({ file, onRemove }: { file: File, onRemove: () => void }) {
  const getFileIcon = () => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-4 w-4" />;
    } else if (file.type === 'application/pdf') {
      return <FileText className="h-4 w-4" />;
    }
    return <File className="h-4 w-4" />;
  };
  
  return (
    <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
      {getFileIcon()}
      <span className="text-xs truncate max-w-[150px]">{file.name}</span>
      <Button 
        variant="ghost"
        size="icon"
        className="h-5 w-5"
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}

export function FilePreviewList({ files, onRemoveFile }: { files: File[], onRemoveFile: (index: number) => void }) {
  if (files.length === 0) return null;
  
  return (
    <div className="p-2 border-t bg-muted/30">
      <div className="flex flex-wrap gap-2">
        {files.map((file, index) => (
          <FilePreview 
            key={index} 
            file={file} 
            onRemove={() => onRemoveFile(index)} 
          />
        ))}
      </div>
    </div>
  );
}
