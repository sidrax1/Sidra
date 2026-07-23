"use client";

import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import type {
  PromotionStatus,
  PromotionType,
} from "@/types/promotion";

export interface PromotionFilterValues {
  readonly query: string;
  readonly status: PromotionStatus | "all";
  readonly type: PromotionType | "all";
  readonly automaticOnly: boolean;
}

interface PromotionFiltersProps {
  readonly values: PromotionFilterValues;
  readonly disabled?: boolean;
  readonly onChange: (
    values: PromotionFilterValues
  ) => void;
}

const statusOptions = [
  {
    value: "all",
    label: "All Statuses",
  },
  {
    value: "draft",
    label: "Draft",
  },
  {
    value: "scheduled",
    label: "Scheduled",
  },
  {
    value: "active",
    label: "Active",
  },
  {
    value: "paused",
    label: "Paused",
  },
  {
    value: "expired",
    label: "Expired",
  },
  {
    value: "archived",
    label: "Archived",
  },
] as const;

const typeOptions = [
  {
    value: "all",
    label: "All Types",
  },
  {
    value: "percentage",
    label: "Percentage",
  },
  {
    value: "fixedAmount",
    label: "Fixed Amount",
  },
  {
    value: "freeShipping",
    label: "Free Shipping",
  },
  {
    value: "buyXGetY",
    label: "Buy X Get Y",
  },
] as const;

export function PromotionFilters({
  disabled = false,
  onChange,
  values,
}: PromotionFiltersProps): React.JSX.Element {
  const active =
    values.query.trim().length > 0 ||
    values.status !== "all" ||
    values.type !== "all" ||
    values.automaticOnly;

  return (
    <section className="grid gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-4 shadow-[var(--shadow-card)] xl:grid-cols-[minmax(0,1fr)_200px_200px_auto] xl:items-center">
      <SearchInput
        value={values.query}
        disabled={disabled}
        placeholder="Search promotion or coupon code"
        leadingIcon={
          <Search
            aria-hidden={true}
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
        aria-label="Promotion status"
        onChange={(event) =>
          onChange({
            ...values,
            status: event.target
              .value as PromotionFilterValues["status"],
          })
        }
      />

      <Select
        value={values.type}
        options={typeOptions}
        disabled={disabled}
        aria-label="Promotion type"
        onChange={(event) =>
          onChange({
            ...values,
            type: event.target
              .value as PromotionFilterValues["type"],
          })
        }
      />

      <div className="flex flex-wrap gap-2 xl:justify-end">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm">
          <input
            type="checkbox"
            checked={values.automaticOnly}
            disabled={disabled}
            onChange={(event) =>
              onChange({
                ...values,
                automaticOnly: event.target.checked,
              })
            }
            className="size-4 accent-[var(--color-gold-500)]"
          />
          Automatic
        </label>

        {active ? (
          <Button
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={() =>
              onChange({
                query: "",
                status: "all",
                type: "all",
                automaticOnly: false,
              })
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
    </section>
  );
}
