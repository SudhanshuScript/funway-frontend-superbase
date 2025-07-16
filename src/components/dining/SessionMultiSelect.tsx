
import React, { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CheckIcon, ChevronDown, CircleCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface SessionOption {
  id: string;
  name: string;
  type: string;
}

interface SessionMultiSelectProps {
  availableSessions: SessionOption[];
  selectedSessions: string[];
  setSelectedSessions: (selectedSessions: string[]) => void;
}

export function SessionMultiSelect({
  availableSessions,
  selectedSessions,
  setSelectedSessions
}: SessionMultiSelectProps) {
  const [open, setOpen] = useState(false);

  // Group sessions by type for better organization
  const sessionTypes: Record<string, SessionOption[]> = {};
  availableSessions.forEach(session => {
    if (!sessionTypes[session.type]) {
      sessionTypes[session.type] = [];
    }
    sessionTypes[session.type].push(session);
  });

  const toggleSession = (sessionId: string) => {
    console.log("Toggling session:", sessionId);
    setSelectedSessions(
      selectedSessions.includes(sessionId)
        ? selectedSessions.filter(id => id !== sessionId)
        : [...selectedSessions, sessionId]
    );
  };
  
  const removeSession = (sessionId: string, e: React.MouseEvent) => {
    console.log("Removing session:", sessionId);
    e.stopPropagation(); // Prevent opening the popover when removing a session
    setSelectedSessions(selectedSessions.filter(id => id !== sessionId));
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between z-10"
            data-testid="session-select-trigger"
          >
            {selectedSessions.length > 0
              ? `${selectedSessions.length} session${selectedSessions.length > 1 ? 's' : ''} selected`
              : "Select sessions..."}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0 z-50" align="start">
          <Command className="z-50">
            <CommandInput placeholder="Search sessions..." />
            <CommandList className="max-h-[300px]">
              <CommandEmpty>No sessions found.</CommandEmpty>
              {Object.keys(sessionTypes).map((type) => (
                <CommandGroup key={type} heading={`${type} Sessions`} className="overflow-visible">
                  {sessionTypes[type].map((session) => {
                    const isSelected = selectedSessions.includes(session.id);
                    return (
                      <CommandItem
                        key={session.id}
                        value={`${session.name}-${session.id}`}
                        onSelect={() => {
                          console.log("Selected session:", session.name, session.id);
                          toggleSession(session.id);
                        }}
                        className={cn(
                          "flex items-center gap-3 py-3 cursor-pointer",
                          isSelected ? "bg-[#7B61FF]/10" : ""
                        )}
                      >
                        <div className={cn(
                          "flex h-4 w-4 items-center justify-center rounded-sm border",
                          isSelected ? "border-[#7B61FF] bg-[#7B61FF] text-white" : "border-muted-foreground"
                        )}>
                          {isSelected && <CheckIcon className="h-3 w-3" />}
                        </div>
                        <span>{session.name}</span>
                        <Badge variant="outline" className="ml-auto text-xs rounded-lg">
                          {type}
                        </Badge>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Display selected sessions as badges */}
      {selectedSessions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedSessions.map(sessionId => {
            const session = availableSessions.find(s => s.id === sessionId);
            return session ? (
              <Badge key={sessionId} variant="outline" className="flex items-center gap-1 bg-[#7B61FF]/10 rounded-lg border-[#7B61FF]/30 pr-1">
                <CircleCheck className="h-3 w-3 mr-1" />
                <span>{session.name}</span>
                <button 
                  type="button"
                  onClick={(e) => removeSession(sessionId, e)}
                  className="ml-1 h-4 w-4 rounded-full hover:bg-[#7B61FF]/20 inline-flex items-center justify-center"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}
