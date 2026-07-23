import type { ReactNode } from "react";

import {
  DashboardSidebar,
  type DashboardNavigationItem,
} from "@/components/layout/DashboardSidebar";

interface DashboardShellProps {
  readonly sidebarTitle: string;
  readonly navigation: readonly DashboardNavigationItem[];
  readonly children: ReactNode;

}

export function DashboardShell({
  children,
  navigation,
  sidebarTitle,
}: DashboardShellProps): React.JSX.Element {
  return (
   <div className="flex min-h-screen bg-background text-foreground">
     <DashboardSidebar
      title={sidebarTitle}
      items={navigation}
     />

       <div className="min-w-0 flex-1">{children}</div>
      </div>
    );
}
