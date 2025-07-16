
import React from 'react';
import { MessageTag } from '@/types/chatTypes';
import { Tag, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface MessageTagsProps {
  tags?: MessageTag[];
  onAddTag?: (tag: MessageTag) => void;
  onRemoveTag?: (tag: MessageTag) => void;
  isReadOnly?: boolean;
}

export function MessageTags({ 
  tags = [], 
  onAddTag, 
  onRemoveTag,
  isReadOnly = false 
}: MessageTagsProps) {
  const getTagColor = (tag: MessageTag) => {
    switch (tag) {
      case 'payment':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'offer_inquiry':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'reschedule':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'complaint':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'menu':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'directions':
        return 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200';
      case 'feedback':
        return 'bg-pink-100 text-pink-800 hover:bg-pink-200';
      case 'general':
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getTagLabel = (tag: MessageTag) => {
    switch (tag) {
      case 'payment':
        return 'Payment';
      case 'offer_inquiry':
        return 'Offer';
      case 'reschedule':
        return 'Reschedule';
      case 'complaint':
        return 'Complaint';
      case 'menu':
        return 'Menu';
      case 'directions':
        return 'Directions';
      case 'feedback':
        return 'Feedback';
      case 'general':
        return 'General';
      default:
        return tag;
    }
  };
  
  const allTags: MessageTag[] = [
    'payment', 
    'offer_inquiry', 
    'reschedule', 
    'complaint', 
    'menu', 
    'directions',
    'feedback',
    'general'
  ];

  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag) => (
        <Badge 
          key={tag} 
          variant="outline"
          className={`text-xs py-0 ${getTagColor(tag)}`}
        >
          {getTagLabel(tag)}
          {!isReadOnly && onRemoveTag && (
            <button
              className="ml-1 hover:bg-opacity-20 hover:bg-gray-400 rounded-full"
              onClick={() => onRemoveTag(tag)}
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </Badge>
      ))}
      
      {!isReadOnly && onAddTag && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-5 px-2 text-xs">
              <Tag className="h-3 w-3 mr-1" />
              Add Tag
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {allTags
              .filter(tag => !tags.includes(tag))
              .map(tag => (
                <DropdownMenuItem 
                  key={tag}
                  onClick={() => onAddTag(tag)}
                >
                  <span className={`w-2 h-2 rounded-full mr-2 ${getTagColor(tag)}`} />
                  {getTagLabel(tag)}
                </DropdownMenuItem>
              ))
            }
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
