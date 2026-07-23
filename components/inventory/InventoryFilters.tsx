"use client";

import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import type { InventoryStatus } from "@/types/inventory";

export type InventorySort =
  | "recentlyUpdated"
  | "lowestStock"
  | "highestStock"
  | "sku";

export interface InventoryFilterValues {
  readonly query: string;
  readonly status: InventoryStatus | "all";
  readonly sort: InventorySort;
  readonly reorderRequiredOnly: boolean;
}

interface InventoryFiltersProps {
  readonly values: InventoryFilterValues;
  readonly disabled?: boolean;
  readonly onChange: (
    values: InventoryFilterValues
  ) => void;
}

const statusOptions = [
  { value: "all", label: "All Inventory" },
  { value: "inStock", label: "In Stock" },
  { value: "lowStock", label: "Low Stock" },
  { value: "outOfStock", label: "Out of Stock" },
  { value: "preorder", label: "Preorder" },
  { value: "discontinued", label: "Discontinued" },
] as const;

const sortOptions = [
  {
    value: "recentlyUpdated",
    label: "Recently Updated",
  },
  { value: "lowestStock", label: "Lowest Stock" },
  { value: "highestStock", label: "Highest Stock" },
  { value: "sku", label: "SKU" },
] as const;

export function InventoryFilters({
  disabled = false,
  onChange,
  values,
}: InventoryFiltersProps): React.JSX.Element {
  const active =
    values.query.trim().length > 0 ||
    values.status !== "all" ||
    values.sort !== "recentlyUpdated" ||
    values.reorderRequiredOnly;

  return (
    <section className="grid gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-4 shadow-[var(--shadow-card)] xl:grid-cols-[minmax(0,1fr)_220px_220px_auto] xl:items-center">
      <SearchInput
        value={values.query}
        disabled={disabled}
        placeholder="Search product or SKU"
        leadingIcon={<Search className="size-4" />}
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
        onChange={(event) =>
          onChange({
            ...values,
            status: event.target
              .value as InventoryFilterValues["status"],
          })
        }
      />

      <Select
        value={values.sort}
        options={sortOptions}
        disabled={disabled}
        onChange={(event) =>
          onChange({
            ...values,
            sort: event.target
              .value as InventorySort,
          })
        }
      />

      <div className="flex flex-wrap gap-2 xl:justify-end">
        <label className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm">
          <input
            type="checkbox"
            checked={values.reorderRequiredOnly}
            disabled={disabled}
            onChange={(event) =>
              onChange({
                ...values,
                reorderRequiredOnly:
                  event.target.checked,
              })
            }
            className="size-4 accent-[var(--color-gold-500)]"
          />
          Reorder required
        </label>

        {active ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              onChange({
                query: "",
                status: "all",
                sort: "recentlyUpdated",
                reorderRequiredOnly: false,
              })
            }
          >
            <X className="size-4" />
            Reset
          </Button>
        ) : null}
      </div>
    </section>
  );
}
