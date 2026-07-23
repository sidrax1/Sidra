"use client";

import {
  Search,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import type {
  ReturnReason,
  ReturnStatus,
} from "@/types/return";

export type ReturnSortOption =
  | "newest"
  | "oldest"
  | "responseDue"
  | "highestValue"
  | "lowestValue"
  | "highestPriority";

export interface ReturnFilterValues {
  readonly query: string;
  readonly status:
    | ReturnStatus
    | "all";
  readonly reason:
    | ReturnReason
    | "all";
  readonly priority:
    | "low"
    | "normal"
    | "high"
    | "urgent"
    | "all";
  readonly sort: ReturnSortOption;
  readonly pickupRequiredOnly: boolean;
  readonly inspectionPendingOnly: boolean;
}

interface ReturnFiltersProps {
  readonly values: ReturnFilterValues;
  readonly disabled?: boolean;
  readonly onChange: (
    values: ReturnFilterValues
  ) => void;
}

const statusOptions = [
  {
    value: "all",
    label: "All Statuses",
  },
  {
    value: "requested",
    label: "Requested",
  },
  {
    value: "underReview",
    label: "Under Review",
  },
  {
    value: "approved",
    label: "Approved",
  },
  {
    value: "rejected",
    label: "Rejected",
  },
  {
    value: "pickupScheduled",
    label: "Pickup Scheduled",
  },
  {
    value: "inTransit",
    label: "In Transit",
  },
  {
    value: "received",
    label: "Received",
  },
  {
    value: "inspectionInProgress",
    label: "Inspection in Progress",
  },
  {
    value: "inspectionPassed",
    label: "Inspection Passed",
  },
  {
    value: "inspectionFailed",
    label: "Inspection Failed",
  },
  {
    value: "refundInitiated",
    label: "Refund Initiated",
  },
  {
    value: "replacementInitiated",
    label: "Replacement Initiated",
  },
  {
    value: "completed",
    label: "Completed",
  },
  {
    value: "cancelled",
    label: "Cancelled",
  },
] as const;

const reasonOptions = [
  {
    value: "all",
    label: "All Reasons",
  },
  {
    value: "damaged",
    label: "Damaged",
  },
  {
    value: "defective",
    label: "Defective",
  },
  {
    value: "wrongItem",
    label: "Wrong Item",
  },
  {
    value: "notAsDescribed",
    label: "Not as Described",
  },
  {
    value: "missingParts",
    label: "Missing Parts",
  },
  {
    value: "qualityConcern",
    label: "Quality Concern",
  },
  {
    value: "sizeOrDimensionIssue",
    label: "Size or Dimension",
  },
  {
    value: "changedMind",
    label: "Changed Mind",
  },
  {
    value: "lateDelivery",
    label: "Late Delivery",
  },
  {
    value: "other",
    label: "Other",
  },
] as const;

const priorityOptions = [
  {
    value: "all",
    label: "All Priorities",
  },
  {
    value: "urgent",
    label: "Urgent",
  },
  {
    value: "high",
    label: "High",
  },
  {
    value: "normal",
    label: "Normal",
  },
  {
    value: "low",
    label: "Low",
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
    value: "responseDue",
    label: "Response Due",
  },
  {
    value: "highestValue",
    label: "Highest Value",
  },
  {
    value: "lowestValue",
    label: "Lowest Value",
  },
  {
    value: "highestPriority",
    label: "Highest Priority",
  },
] as const;

const defaultValues: ReturnFilterValues =
  {
    query: "",
    status: "all",
    reason: "all",
    priority: "all",
    sort: "newest",
    pickupRequiredOnly:
      false,
    inspectionPendingOnly:
      false,
  };

export function ReturnFilters({
  disabled = false,
  onChange,
  values,
}: ReturnFiltersProps): React.JSX.Element {
  const active =
    values.query.trim().length >
      0 ||
    values.status !== "all" ||
    values.reason !== "all" ||
    values.priority !== "all" ||
    values.sort !== "newest" ||
    values.pickupRequiredOnly ||
    values.inspectionPendingOnly;

  return (
    <section className="grid gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_200px_210px_170px_190px_auto] xl:items-center">
        <SearchInput
          value={values.query}
          disabled={disabled}
          placeholder="Search return, order, product or customer"
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
          value={values.status}
          options={statusOptions}
          disabled={disabled}
          aria-label="Return status"
          onChange={(event) =>
            onChange({
              ...values,
              status:
                event.target
                  .value as ReturnFilterValues["status"],
            })
          }
        />

        <Select
          value={values.reason}
          options={reasonOptions}
          disabled={disabled}
          aria-label="Return reason"
          onChange={(event) =>
            onChange({
              ...values,
              reason:
                event.target
                  .value as ReturnFilterValues["reason"],
            })
          }
        />

        <Select
          value={values.priority}
          options={priorityOptions}
          disabled={disabled}
          aria-label="Return priority"
          onChange={(event) =>
            onChange({
              ...values,
              priority:
                event.target
                  .value as ReturnFilterValues["priority"],
            })
          }
        />

        <Select
          value={values.sort}
          options={sortOptions}
          disabled={disabled}
          aria-label="Sort returns"
          onChange={(event) =>
            onChange({
              ...values,
              sort:
                event.target
                  .value as ReturnSortOption,
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
              values.pickupRequiredOnly
            }
            disabled={disabled}
            onChange={(event) =>
              onChange({
                ...values,
                pickupRequiredOnly:
                  event.target
                    .checked,
              })
            }
            className="size-4 accent-[var(--color-gold-500)]"
          />
          Pickup required
        </label>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm">
          <input
            type="checkbox"
            checked={
              values.inspectionPendingOnly
            }
            disabled={disabled}
            onChange={(event) =>
              onChange({
                ...values,
                inspectionPendingOnly:
                  event.target
                    .checked,
              })
            }
            className="size-4 accent-[var(--color-gold-500)]"
          />
          Inspection pending
        </label>
      </div>
    </section>
  );
}
