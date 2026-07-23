"use client";

import {
  MessageSquareText,
} from "lucide-react";

import { ReviewSortMenu } from "@/components/reviews/ReviewSortMenu";
import type { ReviewPublicSort } from "@/components/reviews/ReviewSortMenu";
import { cn } from "@/lib/utils";

interface ReviewListToolbarProps {
  readonly resultCount: number;
  readonly sort: ReviewPublicSort;
  readonly loading?: boolean;
  readonly className?: string;
  readonly onSortChange: (
    sort: ReviewPublicSort
  ) => void;
}

export function ReviewListToolbar({
  className,
  loading = false,
  onSortChange,
  resultCount,
  sort,
}: ReviewListToolbarProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <p className="inline-flex items-center gap-2 text-sm text-muted">
        <MessageSquareText
          aria-hidden={true}
          className="size-4 text-[var(--color-gold-600)]"
        />

        <strong className="font-medium text-foreground">
          {resultCount.toLocaleString(
            "en-IN"
          )}
        </strong>{" "}
        verified{" "}
        {resultCount === 1
          ? "review"
          : "reviews"}
      </p>

      <ReviewSortMenu
        value={sort}
        disabled={loading}
        onChange={onSortChange}
      />
    </div>
  );
}
