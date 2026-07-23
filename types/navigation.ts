import type { LucideIcon } from "lucide-react";

export interface NavigationLink {
  label: string;
  href: string;
  description?: string;
  external?: boolean;
  disabled?: boolean;
}

export interface NavigationGroup {
  title: string;
  links: NavigationLink[];
}

export interface DashboardNavigationLink extends NavigationLink {
  icon: LucideIcon;
  badge?: string | number;
}
