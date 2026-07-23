"use client";

import {
  Grid2X2,
  List,
  SlidersHorizontal,
} from "lucide-react";

import {
 ActiveFilters,
 type ActiveFilter,

} from "@/components/marketplace/ActiveFilters";

import {
  SortControl,
  type MarketplaceSortValue,
} from "@/components/marketplace/SortControl";

import {
  IconButton,
} from "@/components/ui/IconButton";

import {
  cn,
} from "@/lib/utils";

export type MarketplaceViewMode =
 | "grid"
 | "list";

interface MarketplaceToolbarProps {
  readonly resultCount: number;
  readonly sort: MarketplaceSortValue;
  readonly viewMode: MarketplaceViewMode;
  readonly activeFilters?: readonly ActiveFilter[];
  readonly disabled?: boolean;
  readonly className?: string;
  readonly onSortChange: (
    sort: MarketplaceSortValue
  ) => void;
  readonly onViewModeChange: (
    mode: MarketplaceViewMode
  ) => void;
  readonly onOpenFilters?: () => void;
  readonly onRemoveFilter?: (
    filter: ActiveFilter
  ) => void;
  readonly onClearFilters?: () => void;
}

export function MarketplaceToolbar({
 activeFilters = [],
 className,
 disabled = false,
 onClearFilters,

  onOpenFilters,
  onRemoveFilter,
  onSortChange,
  onViewModeChange,
  resultCount,
  sort,
  viewMode,
}: MarketplaceToolbarProps): React.JSX.Element {
  return (
   <div
     className={cn(
       "grid gap-4 border-y border-border py-4",
       className
     )}
   >
     <div className="flex flex-wrap items-center justify-between gap-4">
       <div className="flex items-center gap-3">
        {onOpenFilters ? (
          <IconButton
            label="Open filters"
            icon={
              <SlidersHorizontal
               aria-hidden={true}
              />
            }
            appearance="ghost"
            className="lg:hidden"
            disabled={disabled}
            onClick={onOpenFilters}
          />
        ) : null}

      <p
       aria-live="polite"
       className="text-sm text-muted"
      >
       <strong className="font-semibold text-foreground">
         {resultCount.toLocaleString(
           "en-IN"
         )}
       </strong>{" "}
       {resultCount === 1
         ? "piece"
         : "pieces"}

     </p>
    </div>

    <div className="flex flex-wrap items-center gap-3">
     <SortControl
      value={sort}
      disabled={disabled}
      onChange={onSortChange}
     />

     <div className="hidden items-center rounded-full border border-border bg-card p-1
shadow-[var(--shadow-card)] sm:flex">
      <IconButton
       label="Grid view"
       icon={
         <Grid2X2
           aria-hidden={true}
         />
       }
       size="sm"
       appearance={
         viewMode === "grid"
           ? "default"
           : "ghost"
       }
       disabled={disabled}
       onClick={() =>
         onViewModeChange(
           "grid"
         )
       }
      />

       <IconButton
        label="List view"
        icon={
          <List
           aria-hidden={true}
          />
        }
        size="sm"
        appearance={
          viewMode === "list"
           ? "default"

            : "ghost"
           }
           disabled={disabled}
           onClick={() =>
             onViewModeChange(
               "list"
             )
           }
          />
        </div>
       </div>
      </div>

    {activeFilters.length > 0 &&
    onRemoveFilter &&
    onClearFilters ? (
      <ActiveFilters
        filters={activeFilters}
        disabled={disabled}
        onRemove={onRemoveFilter}
        onClearAll={
          onClearFilters
        }
      />
    ) : null}
   </div>
 );
}
