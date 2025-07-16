
export interface DiningSession {
  id: string | number;
  name: string;
  days: string | string[];
  time: string;
  capacity?: number;
  menu: string;
  description?: string;
}

export interface DiningSessionWithMenuItems extends DiningSession {
  menuItems: any[];
}
