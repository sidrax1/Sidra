"use client";

import {
  X,
} from "lucide-react";

import {
  Button,
} from "@/components/ui/Button";

import {
  Chip,
} from "@/components/ui/Chip";

import {
 cn,

} from "@/lib/utils";

export interface ActiveFilter {
  readonly id: string;
  readonly label: string;
  readonly value: string;
}

interface ActiveFiltersProps {
  readonly filters: readonly ActiveFilter[];
  readonly disabled?: boolean;
  readonly className?: string;
  readonly onRemove: (
    filter: ActiveFilter
  ) => void;
  readonly onClearAll: () => void;
}

export function ActiveFilters({
  className,
  disabled = false,
  filters,
  onClearAll,
  onRemove,
}: ActiveFiltersProps): React.JSX.Element | null {
  if (filters.length === 0) {
    return null;
  }

 return (
  <section
    aria-label="Active filters"
    className={cn(
      "flex flex-wrap items-center gap-2",
      className
    )}
  >
    <span className="mr-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
      Applied
    </span>

    {filters.map((filter) => (
      <Chip
        key={filter.id}

          label={filter.label}
          removable
          selected
          disabled={disabled}
          onRemove={() =>
            onRemove(filter)
          }
        />
      ))}

    <Button
     variant="ghost"
     size="sm"
     disabled={disabled}
     onClick={onClearAll}
     className="ml-1"
    >
     <X
       aria-hidden={true}
       className="size-3.5"
     />
     Clear all
    </Button>
   </section>
 );
}
