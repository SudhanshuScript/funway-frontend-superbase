
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Upload, File, X, Check } from "lucide-react";
import { toast } from "sonner";

interface FileUploadFieldProps {
  label: string;
  description?: string;
  accept?: string;
  required?: boolean;
  onChange: (file: File | null) => void;
  value?: File | string | null;
  id?: string;
}

export const FileUploadField = ({
  label,
  description,
  accept = "image/*,.pdf",
  required = false,
  onChange,
  value,
  id,
}: FileUploadFieldProps) => {
  const [fileName, setFileName] = useState<string | null>(
    typeof value === "string" ? value : value instanceof File ? value.name : null
  );
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      setIsUploading(true);
      // Simulate upload process (in real app, this would be an actual upload)
      setTimeout(() => {
        onChange(file);
        setFileName(file.name);
        setIsUploading(false);
        toast.success("File uploaded successfully");
      }, 1000);
    }
  };

  const clearFile = () => {
    onChange(null);
    setFileName(null);
  };

  return (
    <FormItem className="space-y-2">
      <FormLabel>{label}{required && <span className="text-destructive ml-1">*</span>}</FormLabel>
      <FormControl>
        <div className="flex flex-col gap-2">
          {fileName ? (
            <div className="flex items-center justify-between rounded-md border p-2 bg-secondary/50">
              <div className="flex items-center gap-2 text-sm truncate max-w-[70%]">
                <File className="h-4 w-4" />
                <span className="truncate">{fileName}</span>
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={clearFile}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>
          ) : (
            <div className="grid w-full gap-1.5">
              <label
                htmlFor={id || label}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed p-3 text-sm transition-colors hover:bg-muted"
              >
                <Upload className="h-4 w-4" />
                <span>Upload {label}</span>
              </label>
              <Input
                type="file"
                id={id || label}
                accept={accept}
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
};
