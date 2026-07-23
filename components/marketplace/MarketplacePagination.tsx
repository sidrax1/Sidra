"use client";

import {
  Pagination,
} from "@/components/ui/Pagination";

import {
  cn,
} from "@/lib/utils";

interface MarketplacePaginationProps {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly pageSize: number;
  readonly disabled?: boolean;
  readonly className?: string;

    readonly onPageChange: (
      page: number
    ) => void;
}

export function MarketplacePagination({
  className,
  currentPage,
  disabled = false,
  onPageChange,
  pageSize,
  totalItems,
  totalPages,
}: MarketplacePaginationProps): React.JSX.Element | null {
  if (
    totalPages <= 1 ||
    totalItems <= 0
  ){
    return null;
  }

    const firstItem =
     (currentPage - 1) *
      pageSize +
     1;

    const lastItem =
     Math.min(
       currentPage *
        pageSize,
       totalItems
     );

    return (
     <footer
       className={cn(
         "grid gap-5 border-t border-border pt-6 sm:grid-cols-[1fr_auto_1fr] sm:items-center",
         className
       )}
     >
       <p className="text-center text-sm text-muted sm:text-left">
         Showing{" "}
         <strong className="font-semibold text-foreground">
          {firstItem.toLocaleString(

          "en-IN"
        )}
       </strong>
       –
       <strong className="font-semibold text-foreground">
        {lastItem.toLocaleString(
          "en-IN"
        )}
       </strong>{" "}
       of{" "}
       <strong className="font-semibold text-foreground">
        {totalItems.toLocaleString(
          "en-IN"
        )}
       </strong>
      </p>

      <Pagination
       currentPage={
         currentPage
       }
       totalPages={
         totalPages
       }
       disabled={disabled}
       onPageChange={
         onPageChange
       }
      />

    <p className="hidden text-right text-xs uppercase tracking-[0.14em] text-muted sm:block">
      Page {currentPage} of{" "}
      {totalPages}
    </p>
   </footer>
 );
}
