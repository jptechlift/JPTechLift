import { Home, User, FileText, Settings, type LucideIcon } from "lucide-react";

export interface DashboardMenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const dashboardMenu: DashboardMenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "profile", label: "Profile", icon: User },
  { id: "blog", label: "Blog Posts", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
];