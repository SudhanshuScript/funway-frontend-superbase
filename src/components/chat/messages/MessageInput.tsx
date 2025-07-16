
import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUploadHandler, FilePreviewList } from '../files/FileUploadHandler';
import { AutoSuggestionPanel } from '../suggestions/AutoSuggestionPanel';
import { BookingSummary, QuickReply } from '@/types/chatTypes';

interface MessageInputProps {
  onSendMessage: (content: string, files?: File[]) => void;
  isLoading: boolean;
  bookingSummary?: BookingSummary | null;
  quickReplies?: QuickReply[];
  onSendPaymentLink?: () => void;
}

export function MessageInput({ 
  onSendMessage, 
  isLoading, 
  bookingSummary = null,
  quickReplies = [],
  onSendPaymentLink
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Show suggestions when input is focused
  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleSendMessage = () => {
    if (message.trim() || files.length > 0) {
      onSendMessage(message, files);
      setMessage("");
      setFiles([]);
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };
  
  const handleSendSuggestion = (content: string) => {
    onSendMessage(content);
    setShowSuggestions(false);
  };
  
  const handleSendBookingConfirmation = () => {
    if (bookingSummary) {
      const confirmationMessage = `Here's your booking confirmation:\n\nDate: ${new Date(bookingSummary.date).toLocaleDateString()}\nTime: ${bookingSummary.time}\nSession: ${bookingSummary.session_name}\nGuests: ${bookingSummary.guest_count}\n\nWe look forward to welcoming you at SkyBistro!`;
      onSendMessage(confirmationMessage);
    }
    setShowSuggestions(false);
  };
  
  const handleSendDirections = () => {
    onSendMessage("Here are directions to our location: https://maps.google.com/?q=SkyBistro");
    setShowSuggestions(false);
  };
  
  const handleClickOutside = (e: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
      setShowSuggestions(false);
    }
  };
  
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <AutoSuggestionPanel
        isVisible={showSuggestions}
        bookingSummary={bookingSummary}
        quickReplies={quickReplies}
        onSendSuggestion={handleSendSuggestion}
        onSendBookingConfirmation={handleSendBookingConfirmation}
        onSendDirections={handleSendDirections}
        onSendPaymentLink={onSendPaymentLink || (() => {})}
      />
      
      <FilePreviewList files={files} onRemoveFile={handleRemoveFile} />
      
      <div className="border-t p-3 flex gap-2 items-center">
        <FileUploadHandler onFilesSelected={handleFilesSelected} />
        
        <Input
          placeholder="Type your message..."
          className="flex-1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          onFocus={handleInputFocus}
          disabled={isLoading}
          ref={inputRef}
        />
        
        <Button 
          size="icon" 
          onClick={handleSendMessage} 
          disabled={(!message.trim() && files.length === 0) || isLoading}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
