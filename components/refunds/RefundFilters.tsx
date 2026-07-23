"use client";

import {
  Search,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import type {
  RefundStatus,
} from "@/types/refund";

export type RefundSortOption =
  | "newest"
  | "oldest"
  | "highestAmount"
  | "lowestAmount";

export interface RefundFilterValues {
  readonly query: string;
  readonly status:
    | RefundStatus
    | "all";
  readonly sort: RefundSortOption;
  readonly processedByMeOnly: boolean;
  readonly dateFrom: string;
  readonly dateTo: string;
}

interface RefundFiltersProps {
  readonly values: RefundFilterValues;
  readonly disabled?: boolean;
  readonly onChange: (
    values: RefundFilterValues
  ) => void;
}

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
    value: "approved",
    label: "Approved",
  },
  {
    value: "processing",
    label: "Processing",
  },
  {
    value: "completed",
    label: "Completed",
  },
  {
    value: "failed",
    label: "Failed",
  },
  {
    value: "cancelled",
    label: "Cancelled",
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
    value: "highestAmount",
    label: "Highest Amount",
  },
  {
    value: "lowestAmount",
    label: "Lowest Amount",
  },
] as const;

const defaultValues: RefundFilterValues = {
  query: "",
  status: "all",
  sort: "newest",
  processedByMeOnly: false,
  dateFrom: "",
  dateTo: "",
};

export function RefundFilters({
  disabled = false,
  onChange,
  values,
}: RefundFiltersProps): React.JSX.Element {
  const active =
    values.query.trim().length > 0 ||
    values.status !== "all" ||
    values.sort !== "newest" ||
    values.processedByMeOnly ||
    Boolean(values.dateFrom) ||
    Boolean(values.dateTo);

  return (
    <section className="grid gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_190px_190px_170px_170px_auto] xl:items-center">
        <SearchInput
          value={values.query}
          disabled={disabled}
          placeholder="Search refund, order or payment"
          leadingIcon={
            <Search
              aria-hidden={true}
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
          aria-label="Refund status"
          onChange={(event) =>
            onChange({
              ...values,
              status:
                event.target
                  .value as RefundFilterValues["status"],
            })
          }
        />

        <Select
          value={values.sort}
          options={sortOptions}
          disabled={disabled}
          aria-label="Sort refunds"
          onChange={(event) =>
            onChange({
              ...values,
              sort:
                event.target
                  .value as RefundSortOption,
            })
          }
        />

        <input
          type="date"
          value={values.dateFrom}
          disabled={disabled}
          aria-label="Refund date from"
          className="h-11 rounded-[var(--radius-md)] border border-border bg-background px-4 text-sm text-foreground outline-none transition-[border-color,box-shadow] focus:border-[var(--color-gold-500)] focus:ring-2 focus:ring-[color:rgb(200_169_106_/_0.15)]"
          onChange={(event) =>
            onChange({
              ...values,
              dateFrom:
                event.target.value,
            })
          }
        />

        <input
          type="date"
          value={values.dateTo}
          disabled={disabled}
          aria-label="Refund date to"
          min={
            values.dateFrom ||
            undefined
          }
          className="h-11 rounded-[var(--radius-md)] border border-border bg-background px-4 text-sm text-foreground outline-none transition-[border-color,box-shadow] focus:border-[var(--color-gold-500)] focus:ring-2 focus:ring-[color:rgb(200_169_106_/_0.15)]"
          onChange={(event) =>
            onChange({
              ...values,
              dateTo:
                event.target.value,
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
              aria-hidden={true}
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
              values.processedByMeOnly
            }
            disabled={disabled}
            onChange={(event) =>
              onChange({
                ...values,
                processedByMeOnly:
                  event.target
                    .checked,
              })
            }
            className="size-4 accent-[var(--color-gold-500)]"
          />
          Processed by me
        </label>
      </div>
    </section>
  );
}
