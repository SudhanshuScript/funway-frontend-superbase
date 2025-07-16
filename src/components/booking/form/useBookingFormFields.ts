
import { BookingFormValues } from "../MultiStepBookingFormTypes";

export const getFieldsForStep = (step: number): Array<keyof BookingFormValues> => {
  switch (step) {
    case 0:
      return ["experienceDate", "sessionType"];
    case 1:
      return ["guestName", "contactNumber", "email", "numberOfGuests"];
    case 2:
      return ["paymentStatus", "paymentMethod"];
    default:
      return [];
  }
};
