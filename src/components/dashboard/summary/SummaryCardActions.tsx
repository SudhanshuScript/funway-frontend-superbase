
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface CardActionHookResult {
  handleBookingsClick: () => void;
  handleRevenueClick: () => void;
  handleOccupancyClick: () => void;
  handleGuestsClick: () => void;
  handleSatisfactionClick: () => void;
}

export const useSummaryCardActions = (onViewFranchises?: () => void): CardActionHookResult => {
  const navigate = useNavigate();
  
  const handleBookingsClick = () => {
    toast.info("Navigating to Bookings page");
    navigate("/bookings");
  };

  const handleRevenueClick = () => {
    toast.info("Navigating to Revenue Analytics");
    navigate("/payments");
  };

  const handleOccupancyClick = () => {
    toast.info("Navigating to Occupancy Data");
    onViewFranchises?.();
  };

  const handleGuestsClick = () => {
    toast.info("Navigating to Guest Profiles");
    navigate("/bookings");
  };

  const handleSatisfactionClick = () => {
    toast.info("Viewing Customer Feedback");
    // This would navigate to a feedback page in a real app
    toast.success("Feedback system coming soon!");
  };

  return {
    handleBookingsClick,
    handleRevenueClick,
    handleOccupancyClick,
    handleGuestsClick,
    handleSatisfactionClick
  };
};
