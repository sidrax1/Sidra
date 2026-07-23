"use client";

import {
  Filter,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select, type SelectOption } from "@/components/ui/Select";
import { cn } from "@/lib/utils";

interface AdminSearchToolbarProps {
  readonly query: string;
  readonly status?: string;

    readonly statusOptions?: readonly SelectOption[];
    readonly loading?: boolean;
    readonly className?: string;
    readonly onQueryChange: (query: string) => void;
    readonly onStatusChange?: (status: string) => void;
    readonly onRefresh: () => void | Promise<void>;
    readonly onOpenFilters?: () => void;
}

export function AdminSearchToolbar({
  className,
  loading = false,
  onOpenFilters,
  onQueryChange,
  onRefresh,
  onStatusChange,
  query,
  status,
  statusOptions,
}: AdminSearchToolbarProps): React.JSX.Element {
  return (
    <div
     className={cn(
       "flex flex-col gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-4shadow-[var(--shadow-card)]",
       "lg:flex-row lg:items-center",
       className
     )}
    >
     <SearchInput
       value={query}
       disabled={loading}
       placeholder="Search records..."
       className="lg:min-w-80 lg:flex-1"
       onChange={(event) => onQueryChange(event.target.value)}
       onClear={() => onQueryChange("")}
     />

      {statusOptions && onStatusChange ? (
       <Select
         value={status ?? ""}
         options={statusOptions}
         disabled={loading}
         aria-label="Filter by status"

          className="lg:w-56"
          onChange={(event) => onStatusChange(event.target.value)}
        />
      ) : null}

      {onOpenFilters ? (
        <Button
          variant="outline"
          disabled={loading}
          onClick={onOpenFilters}
        >
          <Filter aria-hidden={true} />
          Filters
        </Button>
      ) : null}

    <Button
     variant="ghost"
     disabled={loading}
     onClick={() => {
       void onRefresh();
     }}
    >
     <RefreshCw
       aria-hidden={true}
       className={cn("size-4", loading && "animate-spin")}
     />
     Refresh
    </Button>
   </div>
 );
}
