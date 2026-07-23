import type {
  ReactNode,
} from "react";

import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/Card";

import {
  cn,
} from "@/lib/utils";

interface MetricCardProps {
  readonly label: string;
  readonly value: ReactNode;

    readonly description?: string;
    readonly percentageChange?: number;
    readonly icon?: ReactNode;
    readonly className?: string;
}

export function MetricCard({
  className,
  description,
  icon,
  label,
  percentageChange,
  value,
}: MetricCardProps): React.JSX.Element {
  const hasChange =
    typeof percentageChange === "number";

    const positive =
     hasChange && percentageChange > 0;

    const negative =
     hasChange && percentageChange < 0;

    const ChangeIcon = positive
     ? ArrowUpRight
     : negative
       ? ArrowDownRight
       : Minus;

    return (
     <Card
       className={cn(
         "group overflow-hidden",
         className
       )}
     >
       <CardHeader className="flex-row items-start justify-between">
         <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            {label}
          </p>

       <div className="mt-3 font-heading text-4xl font-medium tracking-[-0.04em]
text-foreground">

       {value}
      </div>
     </div>

      {icon ? (
        <div className="flex size-11 items-center justify-center rounded-full border
border-[color:rgb(200_169_106_/_0.28)] bg-[color:rgb(200_169_106_/_0.08)]
text-[var(--color-gold-600)] transition-transform duration-[var(--duration-base)]
group-hover:scale-105">
          {icon}
        </div>
      ) : null}
    </CardHeader>

   <CardContent>
    <div className="flex flex-wrap items-center gap-3">
     {hasChange ? (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
          positive &&
            "bg-[color:rgb(62_107_82_/_0.1)] text-[var(--color-success)]",
          negative &&
            "bg-[color:rgb(140_59_52_/_0.1)] text-[var(--color-error)]",
          !positive &&
            !negative &&
            "bg-[var(--color-gray-100)] text-muted"
        )}
      >
        <ChangeIcon
          aria-hidden="true"
          className="size-3.5"
        />

          {Math.abs(
            percentageChange
          ).toFixed(1)}
          %
        </span>
      ) : null}

      {description ? (
       <span className="text-sm text-muted">
        {description}

        </span>
      ) : null}
     </div>
    </CardContent>
   </Card>
 );
}
