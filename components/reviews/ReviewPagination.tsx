"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ReviewPaginationProps {
  readonly page: number;
  readonly pageCount: number;
  readonly loading?: boolean;
  readonly className?: string;
  readonly onPageChange: (
    page: number
  ) => void;
}

export function ReviewPagination({
  className,
  loading = false,
  onPageChange,
  page,
  pageCount,
}: ReviewPaginationProps): React.JSX.Element | null {
  if (pageCount <= 1) {
    return null;
  }

  const safePage = Math.min(
    Math.max(page, 1),
    pageCount
  );

  return (
    <nav
      aria-label="Review pagination"
      className={cn(
        "flex flex-col gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-4 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <p className="text-sm text-muted">
        Page{" "}
        <strong className="font-medium text-foreground">
          {safePage.toLocaleString("en-IN")}
        </strong>{" "}
        of{" "}
        <strong className="font-medium text-foreground">
          {pageCount.toLocaleString("en-IN")}
        </strong>
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={
            loading ||
            safePage <= 1
          }
          onClick={() =>
            onPageChange(
              safePage - 1
            )
          }
        >
          <ChevronLeft
            aria-hidden="true"
            className="size-4"
          />
          Previous
        </Button>

        <Button
          variant="outline"
          size="sm"
          disabled={
            loading ||
            safePage >= pageCount
          }
          onClick={() =>
            onPageChange(
              safePage + 1
            )
          }
        >
          Next
          <ChevronRight
            aria-hidden="true"
            className="size-4"
          />
        </Button>
      </div>
    </nav>
  );
}
