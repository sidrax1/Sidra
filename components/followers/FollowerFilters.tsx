"use client";

import {
  Search,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";

export type FollowerSort =
  | "newest"
  | "oldest"
  | "mostOrders"
  | "name";

export interface FollowerFilterValues {
  readonly query: string;
  readonly customerOnly: boolean;
  readonly sort: FollowerSort;
}

interface FollowerFiltersProps {
  readonly values: FollowerFilterValues;
  readonly disabled?: boolean;
  readonly onChange: (
    values: FollowerFilterValues
  ) => void;
}

const sortOptions = [
  {
    value: "newest",
    label: "Newest Followers",
  },
  {
    value: "oldest",
    label: "Oldest Followers",
  },
  {
    value: "mostOrders",
    label: "Most Orders",
  },
  {
    value: "name",
    label: "Collector Name",
  },
] as const;

export function FollowerFilters({
  disabled = false,
  onChange,
  values,
}: FollowerFiltersProps): React.JSX.Element {
  const active =
    values.query.trim().length >
      0 ||
    values.customerOnly ||
    values.sort !== "newest";

  return (
    <section className="grid gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-4 shadow-[var(--shadow-card)] lg:grid-cols-[minmax(0,1fr)_220px_auto] lg:items-center">
      <SearchInput
        value={values.query}
        disabled={disabled}
        placeholder="Search collectors"
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
        value={values.sort}
        options={sortOptions}
        disabled={disabled}
        aria-label="Sort followers"
        onChange={(event) =>
          onChange({
            ...values,
            sort:
              event.target
                .value as FollowerSort,
          })
        }
      />

      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm">
          <input
            type="checkbox"
            checked={
              values.customerOnly
            }
            disabled={disabled}
            onChange={(event) =>
              onChange({
                ...values,
                customerOnly:
                  event.target.checked,
              })
            }
            className="size-4 accent-[var(--color-gold-500)]"
          />
          Customers only
        </label>

        {active ? (
          <Button
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={() =>
              onChange({
                query: "",
                customerOnly: false,
                sort: "newest",
              })
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
    </section>
  );
}
