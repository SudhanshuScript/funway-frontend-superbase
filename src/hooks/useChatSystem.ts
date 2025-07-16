
// Re-export the refactored hooks for backward compatibility
import { useChatSystem as refactoredUseChatSystem } from './chat/useChatSystem';
export { useChatSystem };

// This maintains backward compatibility with existing imports
function useChatSystem() {
  return refactoredUseChatSystem();
}
