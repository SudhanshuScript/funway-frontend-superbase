
// Re-export all types from various files
export * from './franchise';

// Export all types from franchiseTypes except those that would cause conflicts
export type {
  PerformanceStats,
  OnboardingStep,
  GovernmentIDType,
  FranchisePerformance,
  PerformanceType
} from './franchiseTypes';

// Export constants from franchiseTypes
export {
  dummyFranchise,
  dummyPerformanceStats
} from './franchiseTypes';

// Export other modules
export * from './supabase';

// Explicitly re-export types from sessionTypes to take precedence
export type { 
  Session,
  SessionDB,
  SessionStats,
  SessionAnalytics
} from './sessionTypes';

// Explicitly re-export to avoid ambiguity
export type { InactivityReason } from './franchiseTypes';
