
import React from 'react';
import { Session } from '@/types';
import { SessionDetailModal } from '../modal/SessionDetailModal';
import { SessionDeactivateModal } from '../modal/SessionDeactivateModal';
import { PublishSessionModal } from '../modal/PublishSessionModal';

interface SessionModalsProps {
  selectedSession: Session | null;
  isDetailModalOpen: boolean;
  isDeactivateModalOpen: boolean;
  isPublishModalOpen: boolean;
  setIsDetailModalOpen: (isOpen: boolean) => void;
  setIsDeactivateModalOpen: (isOpen: boolean) => void;
  setIsPublishModalOpen: (isOpen: boolean) => void;
  onEdit: (session: Session) => void;
  onDeactivate: (session: Session) => void;
  onClone: (session: Session) => void;
  publishSession: (session: Partial<Session>) => Promise<boolean>;
  deactivateSession: (sessionId: string, reason: string, comments?: string) => Promise<boolean>;
}

const SessionModals: React.FC<SessionModalsProps> = ({
  selectedSession,
  isDetailModalOpen,
  isDeactivateModalOpen,
  isPublishModalOpen,
  setIsDetailModalOpen,
  setIsDeactivateModalOpen,
  setIsPublishModalOpen,
  onEdit,
  onDeactivate,
  onClone,
  publishSession,
  deactivateSession
}) => {
  if (!selectedSession) {
    return (
      <PublishSessionModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        initialSession={null}
        onPublish={publishSession}
      />
    );
  }

  return (
    <>
      <PublishSessionModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        initialSession={selectedSession}
        onPublish={publishSession}
      />

      <SessionDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        session={selectedSession}
        onEdit={() => {
          setIsDetailModalOpen(false);
          onEdit(selectedSession);
        }}
        onDeactivate={() => {
          setIsDetailModalOpen(false);
          onDeactivate(selectedSession);
        }}
        onClone={() => {
          setIsDetailModalOpen(false);
          onClone(selectedSession);
        }}
      />
      
      <SessionDeactivateModal
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        session={selectedSession}
        onDeactivate={deactivateSession}
      />
    </>
  );
};

export default SessionModals;
