
import React from 'react';
import { useOnboarding } from './OnboardingContext';
import FranchiseIdentityStep from './steps/FranchiseIdentityStep';
import LocationAddressStep from './steps/LocationAddressStep';
import RegistrationStep from './steps/RegistrationStep';
import BrandAppearanceStep from './steps/BrandAppearanceStep';
import HoursSetupStep from './steps/HoursSetupStep';
import OperationalSetupStep from './steps/OperationalSetupStep';
import ReviewStep from './steps/ReviewStep';
import { motion } from 'framer-motion';

const StepRenderer: React.FC = () => {
  const { currentStep } = useOnboarding();
  
  // Animation variants for smooth transitions
  const contentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: { 
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };
  
  // Render the appropriate step content with animation
  const renderStepContent = () => {
    switch (currentStep) {
      case "franchise-identity":
        return <FranchiseIdentityStep />;
      case "location-address":
        return <LocationAddressStep />;
      case "registration":
        return <RegistrationStep />;
      case "brand-appearance":
        return <BrandAppearanceStep />;
      case "hours-setup":
        return <HoursSetupStep />;
      case "operational-setup":
        return <OperationalSetupStep />;
      case "review":
        return <ReviewStep />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      key={currentStep}
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-card border rounded-lg p-6"
    >
      {renderStepContent()}
    </motion.div>
  );
};

export default StepRenderer;
