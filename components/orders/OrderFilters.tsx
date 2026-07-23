"use client";

import {
  CalendarRange,
  Search,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/order";

export type OrderSortOption =
  | "newest"
  | "oldest"
  | "highestValue"
  | "lowestValue";

export interface OrderFilterValues {
  readonly query: string;
  readonly status: OrderStatus | "all";
  readonly sort: OrderSortOption;
  readonly dateFrom: string;
  readonly dateTo: string;
}

interface OrderFiltersProps {
  readonly values: OrderFilterValues;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly onChange: (
    values: OrderFilterValues
  ) => void;
}

const statusOptions = [
  { value: "all", label: "All Orders" },
  { value: "pending", label: "Pending" },
  { value: "paymentPending", label: "Payment Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "In Preparation" },
  { value: "readyToShip", label: "Ready to Ship" },
  { value: "shipped", label: "Dispatched" },
  { value: "outForDelivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "returnRequested", label: "Return Requested" },
  { value: "refunded", label: "Refunded" },
] as const;

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "highestValue", label: "Highest Value" },
  { value: "lowestValue", label: "Lowest Value" },
] as const;

const defaultValues: OrderFilterValues = {
  query: "",
  status: "all",
  sort: "newest",
  dateFrom: "",
  dateTo: "",
};

export function OrderFilters({
  className,
  disabled = false,
  onChange,
  values,
}: OrderFiltersProps): React.JSX.Element {
  const active =
    values.query.trim().length > 0 ||
    values.status !== "all" ||
    values.sort !== "newest" ||
    values.dateFrom.length > 0 ||
    values.dateTo.length > 0;

  return (
    <section
      aria-label="Order filters"
      className={cn(
        "grid gap-4 rounded-[var(--radius-xl)] border border-border bg-card p-4",
        "shadow-[var(--shadow-card)]",
        className
      )}
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_210px_200px_auto] xl:items-center">
        <SearchInput
          value={values.query}
          disabled={disabled}
          placeholder="Search order number, product or Studio"
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
          aria-label="Filter orders by status"
          onChange={(event) =>
            onChange({
              ...values,
              status: event.target
                .value as OrderFilterValues["status"],
            })
          }
        />

        <Select
          value={values.sort}
          options={sortOptions}
          disabled={disabled}
          aria-label="Sort orders"
          onChange={(event) =>
            onChange({
              ...values,
              sort: event.target
                .value as OrderSortOption,
            })
          }
        />

        {active ? (
          <Button
            variant="ghost"
            disabled={disabled}
            onClick={() => onChange(defaultValues)}
          >
            <X
              aria-hidden="true"
              className="size-4"
            />
            Reset
          </Button>
        ) : null}
      </div>

      <div className="grid gap-4 border-t border-border pt-4 sm:grid-cols-2 lg:max-w-2xl">
        <label className="grid gap-2 text-sm font-medium text-foreground">
          <span className="inline-flex items-center gap-2">
            <CalendarRange
              aria-hidden="true"
              className="size-4 text-[var(--color-gold-600)]"
            />
            From
          </span>

          <input
            type="date"
            value={values.dateFrom}
            disabled={disabled}
            max={values.dateTo || undefined}
            className="h-11 rounded-[var(--radius-md)] border border-border bg-background px-4 text-sm outline-none transition-colors focus:border-[var(--color-gold-500)]"
            onChange={(event) =>
              onChange({
                ...values,
                dateFrom: event.target.value,
              })
            }
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-foreground">
          <span>To</span>

          <input
            type="date"
            value={values.dateTo}
            disabled={disabled}
            min={values.dateFrom || undefined}
            className="h-11 rounded-[var(--radius-md)] border border-border bg-background px-4 text-sm outline-none transition-colors focus:border-[var(--color-gold-500)]"
            onChange={(event) =>
              onChange({
                ...values,
                dateTo: event.target.value,
              })
            }
          />
        </label>
      </div>
    </section>
  );
}
