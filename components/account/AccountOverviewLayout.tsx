import type {
  ReactNode,
} from "react";

import { cn } from "@/lib/utils";

interface AccountOverviewLayoutProps {
  readonly hero: ReactNode;
  readonly metrics: ReactNode;
  readonly quickActions: ReactNode;
  readonly recentOrders: ReactNode;
  readonly activity?: ReactNode;
  readonly className?: string;
}

export function AccountOverviewLayout({
  activity,
  className,
  hero,
  metrics,
  quickActions,
  recentOrders,
}: AccountOverviewLayoutProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "grid gap-8",
        className
      )}
    >
      {hero}
      {metrics}
      {quickActions}

      <div
        className={cn(
          "grid gap-8",
          activity &&
            "xl:grid-cols-[minmax(0,1fr)_420px]"
        )}
      >
        <div className="min-w-0">
          {recentOrders}
        </div>

        {activity ? (
          <aside className="min-w-0">
            {activity}
          </aside>
        ) : null}
      </div>
    </div>
  );
}
