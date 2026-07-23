"use client";

import {
  Search,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import type {
  ReviewReportReason,
  ReviewReportStatus,
} from "@/types/review-report";

export type ReviewReportSortOption =
  | "newest"
  | "oldest"
  | "highestRisk"
  | "lowestRisk"
  | "mostReported";

export interface ReviewReportFilterValues {
  readonly query: string;
  readonly status:
    | ReviewReportStatus
    | "all";
  readonly reason:
    | ReviewReportReason
    | "all";
  readonly sort: ReviewReportSortOption;
  readonly assignedToMeOnly: boolean;
  readonly highRiskOnly: boolean;
}

interface ReviewReportFiltersProps {
  readonly values: ReviewReportFilterValues;
  readonly disabled?: boolean;
  readonly onChange: (
    values: ReviewReportFilterValues
  ) => void;
}

const statusOptions = [
  {
    value: "all",
    label: "All Statuses",
  },
  {
    value: "submitted",
    label: "Submitted",
  },
  {
    value: "underReview",
    label: "Under Review",
  },
  {
    value: "actionRequired",
    label: "Action Required",
  },
  {
    value: "resolved",
    label: "Resolved",
  },
  {
    value: "dismissed",
    label: "Dismissed",
  },
  {
    value: "escalated",
    label: "Escalated",
  },
] as const;

const reasonOptions = [
  {
    value: "all",
    label: "All Reasons",
  },
  {
    value: "spam",
    label: "Spam",
  },
  {
    value: "harassment",
    label: "Harassment",
  },
  {
    value: "hateSpeech",
    label: "Hate Speech",
  },
  {
    value: "personalInformation",
    label: "Personal Information",
  },
  {
    value: "falseInformation",
    label: "False Information",
  },
  {
    value: "irrelevantContent",
    label: "Irrelevant Content",
  },
  {
    value: "commercialPromotion",
    label: "Commercial Promotion",
  },
  {
    value: "conflictOfInterest",
    label: "Conflict of Interest",
  },
  {
    value: "prohibitedContent",
    label: "Prohibited Content",
  },
  {
    value: "other",
    label: "Other",
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
    value: "highestRisk",
    label: "Highest Risk",
  },
  {
    value: "lowestRisk",
    label: "Lowest Risk",
  },
  {
    value: "mostReported",
    label: "Most Reported",
  },
] as const;

const defaultValues: ReviewReportFilterValues = {
  query: "",
  status: "all",
  reason: "all",
  sort: "newest",
  assignedToMeOnly: false,
  highRiskOnly: false,
};

export function ReviewReportFilters({
  disabled = false,
  onChange,
  values,
}: ReviewReportFiltersProps): React.JSX.Element {
  const active =
    values.query.trim().length > 0 ||
    values.status !== "all" ||
    values.reason !== "all" ||
    values.sort !== "newest" ||
    values.assignedToMeOnly ||
    values.highRiskOnly;

  return (
    <section className="grid gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_190px_220px_190px_auto] xl:items-center">
        <SearchInput
          value={values.query}
          disabled={disabled}
          placeholder="Search report, review or reporter"
          leadingIcon={
            <Search
              aria-hidden="true"
              className="size-4"
            />
          }
          onChange={(event) =>
            onChange({
              ...values,
              query: event.target.value,
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
          value={values.status}
          options={statusOptions}
          disabled={disabled}
          aria-label="Report status"
          onChange={(event) =>
            onChange({
              ...values,
              status:
                event.target
                  .value as ReviewReportFilterValues["status"],
            })
          }
        />

        <Select
          value={values.reason}
          options={reasonOptions}
          disabled={disabled}
          aria-label="Report reason"
          onChange={(event) =>
            onChange({
              ...values,
              reason:
                event.target
                  .value as ReviewReportFilterValues["reason"],
            })
          }
        />

        <Select
          value={values.sort}
          options={sortOptions}
          disabled={disabled}
          aria-label="Sort reports"
          onChange={(event) =>
            onChange({
              ...values,
              sort:
                event.target
                  .value as ReviewReportSortOption,
            })
          }
        />

        {active ? (
          <Button
            variant="ghost"
            disabled={disabled}
            onClick={() =>
              onChange(defaultValues)
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
            checked={values.assignedToMeOnly}
            disabled={disabled}
            onChange={(event) =>
              onChange({
                ...values,
                assignedToMeOnly:
                  event.target.checked,
              })
            }
            className="size-4 accent-[var(--color-gold-500)]"
          />
          Assigned to me
        </label>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm">
          <input
            type="checkbox"
            checked={values.highRiskOnly}
            disabled={disabled}
            onChange={(event) =>
              onChange({
                ...values,
                highRiskOnly:
                  event.target.checked,
              })
            }
            className="size-4 accent-[var(--color-gold-500)]"
          />
          High risk only
        </label>
      </div>
    </section>
  );
}
