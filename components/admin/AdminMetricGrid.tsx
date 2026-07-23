import type { LucideIcon } from "lucide-react";

import { MetricCard } from "@/components/ui/MetricCard";
import { cn } from "@/lib/utils";

export interface AdminMetric {
  readonly id: string;
  readonly label: string;
  readonly value: string | number;
  readonly description?: string;
  readonly percentageChange?: number;
  readonly icon?: LucideIcon;
}

interface AdminMetricGridProps {
  readonly metrics: readonly AdminMetric[];
  readonly className?: string;
}

export function AdminMetricGrid({
  className,
  metrics,
}: AdminMetricGridProps): React.JSX.Element {
  return (
   <section
     aria-label="Administrative metrics"
     className={cn(
       "grid gap-5 sm:grid-cols-2 xl:grid-cols-4",
       className
     )}
   >
     {metrics.map((metric) => {
       const Icon = metric.icon;

     return (
       <MetricCard
        key={metric.id}
        label={metric.label}
        value={metric.value}
        description={metric.description}
        percentageChange={metric.percentageChange}
        icon={
          Icon ? (
            <Icon aria-hidden={true} className="size-5" />
          ) : undefined
        }
       />
     );

    })}
   </section>
 );
}
