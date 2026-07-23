"use client";

import {
  Search,
  X,
} from "lucide-react";

import {
  Button,
} from "@/components/ui/Button";
import {
  SearchInput,
} from "@/components/ui/SearchInput";
import {
  Select,
} from "@/components/ui/Select";
import type {
  WarrantyClaimStatus,
  WarrantyPriority,
} from "@/types/warranty";

export type WarrantyClaimSortOption =
  | "newest"
  | "oldest"
  | "responseDue"
  | "highestPriority"
  | "highestCoverage"
  | "lowestCoverage";

export interface WarrantyClaimFilterValues {
  readonly query: string;
  readonly status:
    | WarrantyClaimStatus
    | "all";
  readonly priority:
    | WarrantyPriority
    | "all";
  readonly sort: WarrantyClaimSortOption;
  readonly assignedToMeOnly: boolean;
  readonly evidenceRequiredOnly: boolean;
  readonly servicePendingOnly: boolean;
}

interface WarrantyClaimFiltersProps {
  readonly values: WarrantyClaimFilterValues;
  readonly disabled?: boolean;
  readonly onChange: (
    values: WarrantyClaimFilterValues
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
    value: "evidenceRequired",
    label: "Evidence Required",
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
    value: "repairScheduled",
    label: "Repair Scheduled",
  },
  {
    value: "replacementApproved",
    label: "Replacement Approved",
  },
  {
    value: "refundApproved",
    label: "Refund Approved",
  },
  {
    value: "inService",
    label: "In Service",
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
    value: "highestPriority",
    label: "Highest Priority",
  },
  {
    value: "highestCoverage",
    label: "Highest Coverage",
  },
  {
    value: "lowestCoverage",
    label: "Lowest Coverage",
  },
] as const;

const defaultValues: WarrantyClaimFilterValues =
  {
    query: "",
    status: "all",
    priority: "all",
    sort: "newest",
    assignedToMeOnly: false,
    evidenceRequiredOnly:
      false,
    servicePendingOnly:
      false,
  };

export function WarrantyClaimFilters({
  disabled = false,
  onChange,
  values,
}: WarrantyClaimFiltersProps): React.JSX.Element {
  const active =
    values.query.trim().length >
      0 ||
    values.status !== "all" ||
    values.priority !== "all" ||
    values.sort !== "newest" ||
    values.assignedToMeOnly ||
    values.evidenceRequiredOnly ||
    values.servicePendingOnly;

  return (
    <section className="grid gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_210px_170px_200px_auto] xl:items-center">
        <SearchInput
          value={values.query}
          disabled={disabled}
          placeholder="Search claim, warranty, product or customer"
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
                event.target.value,
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
          aria-label="Warranty claim status"
          onChange={(event) =>
            onChange({
              ...values,
              status:
                event.target
                  .value as WarrantyClaimFilterValues["status"],
            })
          }
        />

        <Select
          value={values.priority}
          options={
            priorityOptions
          }
          disabled={disabled}
          aria-label="Warranty claim priority"
          onChange={(event) =>
            onChange({
              ...values,
              priority:
                event.target
                  .value as WarrantyClaimFilterValues["priority"],
            })
          }
        />

        <Select
          value={values.sort}
          options={sortOptions}
          disabled={disabled}
          aria-label="Sort warranty claims"
          onChange={(event) =>
            onChange({
              ...values,
              sort:
                event.target
                  .value as WarrantyClaimSortOption,
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
              values.assignedToMeOnly
            }
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
            checked={
              values.evidenceRequiredOnly
            }
            disabled={disabled}
            onChange={(event) =>
              onChange({
                ...values,
                evidenceRequiredOnly:
                  event.target.checked,
              })
            }
            className="size-4 accent-[var(--color-gold-500)]"
          />
          Evidence required
        </label>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm">
          <input
            type="checkbox"
            checked={
              values.servicePendingOnly
            }
            disabled={disabled}
            onChange={(event) =>
              onChange({
                ...values,
                servicePendingOnly:
                  event.target.checked,
              })
            }
            className="size-4 accent-[var(--color-gold-500)]"
          />
          Service pending
        </label>
      </div>
    </section>
  );
}
