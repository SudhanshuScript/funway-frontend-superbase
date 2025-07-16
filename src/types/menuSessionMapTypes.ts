
import { MenuItem } from "./menuTypes";
import { Session } from "./sessionTypes";
import { DiningSession } from "./diningTypes";

export interface MenuSessionMap {
  id: string;
  menu_id: string;
  session_id: string;
  created_at: string;
}

export interface MenuSessionMapWithItems extends MenuSessionMap {
  menu_items?: MenuItem;
  sessions?: Session | DiningSession;
}

export interface SessionWithMenuItems extends DiningSession {
  menuItems: MenuItem[];
}
