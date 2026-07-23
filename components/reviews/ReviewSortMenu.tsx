"use client";

import {
  ArrowDownUp,
} from "lucide-react";

import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/utils";

export type ReviewPublicSort =
  | "newest"
  | "highestRating"
  | "lowestRating"
  | "mostHelpful";

interface ReviewSortMenuProps {
  readonly value: ReviewPublicSort;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly onChange: (
    value: ReviewPublicSort
  ) => void;
}

const options = [
  {
    value: "newest",
    label: "Newest Reviews",
  },
  {
    value: "highestRating",
    label: "Highest Rated",
  },
  {
    value: "lowestRating",
    label: "Lowest Rated",
  },
  {
    value: "mostHelpful",
    label: "Most Helpful",
  },
] as const;

export function ReviewSortMenu({
  className,
  disabled = false,
  onChange,
  value,
}: ReviewSortMenuProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "relative min-w-[210px]",
        className
      )}
    >
      <ArrowDownUp
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 z-10 size-4 -translate-y-1/2 text-muted"
      />

      <Select
        value={value}
        options={options}
        disabled={disabled}
        aria-label="Sort product reviews"
        className="pl-11"
        onChange={(event) =>
          onChange(
            event.target
              .value as ReviewPublicSort
          )
        }
      />
    </div>
  );
}
