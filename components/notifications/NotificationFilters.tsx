"use client";

import {
  Chip,
} from "@/components/ui/Chip";
import {
  cn,
} from "@/lib/utils";

export type NotificationFilter =
 | "all"
 | "unread"
 | "orders"
 | "payments"
 | "studios"
 | "system";

interface NotificationFiltersProps {
  readonly value: NotificationFilter;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly onChange: (
    value: NotificationFilter
  ) => void;
}

const options: readonly {
  readonly value: NotificationFilter;
  readonly label: string;
}[] = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "unread",
    label: "Unread",
  },
  {
    value: "orders",
    label: "Orders",
  },
  {
    value: "payments",

    label: "Payments",
  },
  {
    value: "studios",
    label: "Studios",
  },
  {
    value: "system",
    label: "System",
  },
];

export function NotificationFilters({
  className,
  disabled = false,
  onChange,
  value,
}: NotificationFiltersProps): React.JSX.Element {
  return (
    <div
     role="list"
     aria-label="Notification filters"
     className={cn(
       "flex flex-wrap gap-2",
       className
     )}
    >
     {options.map((option) => (
       <Chip
         key={option.value}
         label={option.label}
         selected={
           value === option.value
         }
         disabled={disabled}
         onClick={() =>
           onChange(option.value)
         }
       />
     ))}
    </div>
  );
}
