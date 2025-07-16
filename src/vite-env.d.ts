
/// <reference types="vite/client" />

import { MockBookingSystem } from "@/utils/mockBookingSystem";

declare global {
  interface Window {
    mockBookingSystem: MockBookingSystem;
  }
}
