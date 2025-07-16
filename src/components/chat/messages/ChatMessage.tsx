
import React from 'react';
import { Message } from '@/types/chatTypes';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, Circle } from 'lucide-react';
import { MessageTags } from './MessageTags';
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { useUserRole } from '@/providers/UserRoleProvider';

interface ChatMessageProps {
  message: Message;
  onAddTag?: (messageId: string, tag: string) => void;
  onRemoveTag?: (messageId: string, tag: string) => void;
}

export function ChatMessage({ 
  message, 
  onAddTag, 
  onRemoveTag 
}: ChatMessageProps) {
  const isOutbound = message.direction === 'outbound';
  const { currentUser } = useUserRole();
  const isSuperAdmin = currentUser?.role === 'superadmin';

  const renderMessageStatus = () => {
    if (message.direction !== 'outbound') return null;
    
    switch (message.status) {
      case 'sent':
        return <Circle className="h-3 w-3 text-muted-foreground" />;
      case 'delivered':
        return <CheckCircle2 className="h-3 w-3 text-muted-foreground" />;
      case 'read':
        return <CheckCircle2 className="h-3 w-3 text-green-500" />;
      default:
        return null;
    }
  };
  
  const renderFilePreview = () => {
    if (!message.media_url) return null;
    
    if (message.file_type?.startsWith('image/')) {
      return (
        <div className="mt-2 rounded-md overflow-hidden">
          <img 
            src={message.media_url} 
            alt="Attached" 
            className="max-h-60 object-contain"
          />
        </div>
      );
    }
    
    return (
      <a 
        href={message.media_url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 flex items-center gap-2 bg-muted p-2 rounded-md text-sm hover:bg-accent"
      >
        <div className="w-8 h-8 bg-primary/10 flex items-center justify-center rounded">
          <span className="text-xs uppercase font-bold">{message.file_type?.split('/')[1]?.substring(0, 3) || 'Doc'}</span>
        </div>
        <span className="flex-1 truncate">
          {message.media_url.split('/').pop()}
        </span>
      </a>
    );
  };
  
  const handleAddTag = (tag: any) => {
    if (onAddTag) {
      onAddTag(message.id, tag);
    }
  };
  
  const handleRemoveTag = (tag: any) => {
    if (onRemoveTag) {
      onRemoveTag(message.id, tag);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className={cn(
          "flex",
          isOutbound ? "justify-end" : "justify-start"
        )}>
          <div className={cn(
            "max-w-[80%] rounded-lg p-3",
            isOutbound 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted text-foreground"
          )}>
            {/* Message content */}
            <div className="whitespace-pre-wrap break-words">{message.content}</div>
            
            {/* File preview */}
            {renderFilePreview()}
            
            {/* Message info */}
            <div className={cn(
              "flex items-center justify-end gap-1 mt-1 text-xs",
              isOutbound ? "text-primary-foreground/70" : "text-muted-foreground"
            )}>
              <span>
                {formatDistanceToNow(new Date(message.sent_at), { addSuffix: true })}
              </span>
              {renderMessageStatus()}
            </div>
          </div>
        </div>
        
        {/* Message Tags */}
        {message.tags && message.tags.length > 0 && (
          <div className={cn(
            "mt-1 mb-2",
            isOutbound ? "flex justify-end" : "flex justify-start"
          )}>
            <MessageTags 
              tags={message.tags}
              isReadOnly={!isSuperAdmin}
              onRemoveTag={isSuperAdmin ? (tag) => handleRemoveTag(tag) : undefined}
            />
          </div>
        )}
      </ContextMenuTrigger>
      
      <ContextMenuContent>
        {(isSuperAdmin || currentUser?.role === 'franchise_owner') && (
          <>
            <ContextMenuItem>Copy</ContextMenuItem>
            <ContextMenuItem>Forward</ContextMenuItem>
            {isSuperAdmin && (
              <ContextMenuItem onClick={() => handleAddTag('payment')}>
                Tag as Payment
              </ContextMenuItem>
            )}
            {isSuperAdmin && (
              <ContextMenuItem onClick={() => handleAddTag('reschedule')}>
                Tag as Reschedule
              </ContextMenuItem>
            )}
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
