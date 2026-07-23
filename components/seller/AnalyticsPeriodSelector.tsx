"use client";

import { CalendarRange } from "lucide-react";

import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/utils";

export type AnalyticsPeriod =
 | "day"
 | "week"
 | "month"
 | "year"
 | "lifetime";

interface AnalyticsPeriodSelectorProps {
  readonly value: AnalyticsPeriod;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly onChange: (value: AnalyticsPeriod) => void;
}

const options = [
 {
   value: "day",
   label: "Today",
 },
 {
   value: "week",
   label: "This Week",
 },
 {
   value: "month",
   label: "This Month",

  },
  {
    value: "year",
    label: "This Year",
  },
  {
    value: "lifetime",
    label: "Lifetime",
  },
] as const;

export function AnalyticsPeriodSelector({
  className,
  disabled = false,
  onChange,
  value,
}: AnalyticsPeriodSelectorProps): React.JSX.Element {
  return (
   <div
     className={cn(
       "flex items-center gap-3",
       className
     )}
   >
     <CalendarRange
       aria-hidden={true}
       className="size-4 text-muted"
     />

    <Select
     value={value}
     options={options}
     disabled={disabled}
     aria-label="Analytics period"
     className="min-w-44"
     onChange={(event) =>
       onChange(event.target.value as AnalyticsPeriod)
     }
    />
   </div>
 );
}
