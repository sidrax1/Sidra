"use client";

import {
  Search,
  X,
} from "lucide-react";

import {
  type ReviewModerationStatus,
} from "@/components/reviews/ReviewModerationStatusBadge";
import {
  Button,
} from "@/components/ui/Button";
import {
  SearchInput,
} from "@/components/ui/SearchInput";
import {
  Select,
} from "@/components/ui/Select";

export type ReviewSortOption =
  | "newest"
  | "oldest"
  | "highestRating"
  | "lowestRating"
  | "mostHelpful"
  | "mostReported";

export interface ReviewFilterValues {
  readonly query: string;
  readonly rating:
    | "all"
    | "5"
    | "4"
    | "3"
    | "2"
    | "1";
  readonly status:
    | ReviewModerationStatus
    | "all";
  readonly verifiedOnly: boolean;
  readonly withMediaOnly: boolean;
  readonly sort: ReviewSortOption;
}

interface ReviewFiltersProps {
  readonly values: ReviewFilterValues;
  readonly disabled?: boolean;
  readonly moderationMode?: boolean;
  readonly onChange: (
    values: ReviewFilterValues
  ) => void;
}

const ratingOptions = [
  {
    value: "all",
    label: "All Ratings",
  },
  {
    value: "5",
    label: "5 Stars",
  },
  {
    value: "4",
    label: "4 Stars",
  },
  {
    value: "3",
    label: "3 Stars",
  },
  {
    value: "2",
    label: "2 Stars",
  },
  {
    value: "1",
    label: "1 Star",
  },
] as const;

const statusOptions = [
  {
    value: "all",
    label: "All Statuses",
  },
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "published",
    label: "Published",
  },
  {
    value: "flagged",
    label: "Flagged",
  },
  {
    value: "underReview",
    label: "Under Review",
  },
  {
    value: "hidden",
    label: "Hidden",
  },
  {
    value: "rejected",
    label: "Rejected",
  },
] as const;

const sortOptions = [
  {
    value: "newest",
    label: "Newest First",
  },
  {
    value: "oldest",
    label: "Oldest First",
  },
  {
    value: "highestRating",
    label: "Highest Rating",
  },
  {
    value: "lowestRating",
    label: "Lowest Rating",
  },
  {
    value: "mostHelpful",
    label: "Most Helpful",
  },
  {
    value: "mostReported",
    label: "Most Reported",
  },
] as const;

const defaultValues: ReviewFilterValues =
  {
    query: "",
    rating: "all",
    status: "all",
    verifiedOnly: false,
    withMediaOnly: false,
    sort: "newest",
  };

export function ReviewFilters({
  disabled = false,
  moderationMode = false,
  onChange,
  values,
}: ReviewFiltersProps): React.JSX.Element {
  const active =
    values.query.trim().length >
      0 ||
    values.rating !== "all" ||
    values.status !== "all" ||
    values.verifiedOnly ||
    values.withMediaOnly ||
    values.sort !== "newest";

  return (
    <section className="grid gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <div
        className={[
          "grid gap-4",
          moderationMode
            ? "xl:grid-cols-[minmax(0,1fr)_180px_190px_200px_auto]"
            : "xl:grid-cols-[minmax(0,1fr)_180px_200px_auto]",
        ].join(" ")}
      >
        <SearchInput
          value={values.query}
          disabled={disabled}
          placeholder="Search review, customer or product"
          leadingIcon={
            <Search
              aria-hidden="true"
              className="size-4"
            />
          }
          onChange={(event) =>
            onChange({
              ...values,
              query:
                event.target
                  .value,
            })
          }
          onClear={() =>
            onChange({
              ...values,
              query: "",
            })
          }
        />

        <Select
          value={values.rating}
          options={
            ratingOptions
          }
          disabled={disabled}
          aria-label="Review rating"
          onChange={(event) =>
            onChange({
              ...values,
              rating:
                event.target
                  .value as ReviewFilterValues["rating"],
            })
          }
        />

        {moderationMode ? (
          <Select
            value={values.status}
            options={
              statusOptions
            }
            disabled={disabled}
            aria-label="Moderation status"
            onChange={(event) =>
              onChange({
                ...values,
                status:
                  event.target
                    .value as ReviewFilterValues["status"],
              })
            }
          />
        ) : null}

        <Select
          value={values.sort}
          options={sortOptions}
          disabled={disabled}
          aria-label="Sort reviews"
          onChange={(event) =>
            onChange({
              ...values,
              sort:
                event.target
                  .value as ReviewSortOption,
            })
          }
        />

        {active ? (
          <Button
            variant="ghost"
            disabled={disabled}
            onClick={() =>
              onChange(
                defaultValues
              )
            }
          >
            <X
              aria-hidden="true"
              className="size-4"
            />
            Reset
          </Button>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-3 border-t border-border pt-4">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm">
          <input
            type="checkbox"
            checked={
              values.verifiedOnly
            }
            disabled={disabled}
            onChange={(event) =>
              onChange({
                ...values,
                verifiedOnly:
                  event.target
                    .checked,
              })
            }
            className="size-4 accent-[var(--color-gold-500)]"
          />
          Verified purchases
        </label>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm">
          <input
            type="checkbox"
            checked={
              values.withMediaOnly
            }
            disabled={disabled}
            onChange={(event) =>
              onChange({
                ...values,
                withMediaOnly:
                  event.target
                    .checked,
              })
            }
            className="size-4 accent-[var(--color-gold-500)]"
          />
          With customer media
        </label>
      </div>
    </section>
  );
}
