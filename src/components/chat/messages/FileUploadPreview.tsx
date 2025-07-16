
import React from 'react';
import { Button } from "@/components/ui/button";

interface FileUploadPreviewProps {
  files: File[];
  onRemoveFile: (index: number) => void;
}

export function FileUploadPreview({ files, onRemoveFile }: FileUploadPreviewProps) {
  if (files.length === 0) return null;

  return (
    <div className="px-3 pb-3">
      <div className="flex flex-wrap gap-2">
        {files.map((file, index) => (
          <div key={index} className="bg-secondary rounded px-2 py-1 text-xs flex items-center">
            <span className="truncate max-w-[150px]">{file.name}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 ml-1"
              onClick={() => onRemoveFile(index)}
            >
              <span className="sr-only">Remove</span>
              ×
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
