
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';

interface EmptySessionsStateProps {
  onCreateNew: () => void;
}

const EmptySessionsState: React.FC<EmptySessionsStateProps> = ({ onCreateNew }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted/30 p-4 rounded-full mb-4">
        <Calendar className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-muted-foreground mb-2">No sessions found</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        Start creating sessions to manage your dining experiences and track bookings.
      </p>
      <Button 
        onClick={onCreateNew}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Create New Session
      </Button>
    </div>
  );
};

export default EmptySessionsState;
