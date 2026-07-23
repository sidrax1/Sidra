import type {
  ReactNode,
} from "react";

import { AccountMetricCard } from "@/components/account/AccountMetricCard";
import { cn } from "@/lib/utils";

export interface AccountMetric {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly description?: string;
  readonly icon: ReactNode;
  readonly trend?: string;
}

interface AccountMetricGridProps {
  readonly metrics: readonly AccountMetric[];
  readonly className?: string;
}

export function AccountMetricGrid({
  className,
  metrics,
}: AccountMetricGridProps): React.JSX.Element {
  return (
    <section
      aria-label="Account summary metrics"
      className={cn(
        "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
        className
      )}
    >
      {metrics.map((metric) => (
        <AccountMetricCard
          key={metric.id}
          label={metric.label}
          value={metric.value}
          description={
            metric.description
          }
          icon={metric.icon}
          trend={metric.trend}
        />
      ))}
    </section>
  );
}
