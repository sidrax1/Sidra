import type { LucideIcon } from "lucide-react";

import { MetricCard } from "@/components/ui/MetricCard";
import { cn } from "@/lib/utils";

export interface SellerMetric {
  readonly id: string;
  readonly label: string;
  readonly value: string | number;
  readonly description?: string;
  readonly percentageChange?: number;
  readonly icon?: LucideIcon;
}

interface SellerMetricGridProps {
  readonly metrics: readonly SellerMetric[];
  readonly className?: string;
}

export function SellerMetricGrid({
  className,
  metrics,
}: SellerMetricGridProps): React.JSX.Element {
  return (
   <section
     aria-label="Studio performance metrics"
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

           <Icon
             aria-hidden="true"
             className="size-5"
           />
         ) : undefined
         }
        />
      );
    })}
   </section>
 );
}
