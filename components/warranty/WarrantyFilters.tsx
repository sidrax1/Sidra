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
  WarrantyStatus,
} from "@/types/warranty";

export type WarrantySortOption =
  | "newest"
  | "oldest"
  | "expiringSoon"
  | "latestExpiry"
  | "highestValue"
  | "lowestValue"
  | "mostClaims";

export interface WarrantyFilterValues {
  readonly query: string;
  readonly status:
    | WarrantyStatus
    | "all";
  readonly sort: WarrantySortOption;
  readonly registrationRequiredOnly: boolean;
  readonly transferableOnly: boolean;
  readonly expiringSoonOnly: boolean;
  readonly claimsAvailableOnly: boolean;
}

interface WarrantyFiltersProps {
  readonly values: WarrantyFilterValues;
  readonly disabled?: boolean;
  readonly onChange: (
    values: WarrantyFilterValues
  ) => void;
}

const statusOptions = [
  {
    value: "all",
    label: "All Statuses",
  },
  {
    value: "active",
    label: "Active",
  },
  {
    value: "claimInProgress",
    label: "Claim in Progress",
  },
  {
    value: "fulfilled",
    label: "Fulfilled",
  },
  {
    value: "transferred",
    label: "Transferred",
  },
  {
    value: "expired",
    label: "Expired",
  },
  {
    value: "void",
    label: "Void",
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
    value: "expiringSoon",
    label: "Expiring Soon",
  },
  {
    value: "latestExpiry",
    label: "Latest Expiry",
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
    value: "mostClaims",
    label: "Most Claims",
  },
] as const;

const defaultValues: WarrantyFilterValues =
  {
    query: "",
    status: "all",
    sort: "newest",
    registrationRequiredOnly:
      false,
    transferableOnly: false,
    expiringSoonOnly: false,
    claimsAvailableOnly: false,
  };

export function WarrantyFilters({
  disabled = false,
  onChange,
  values,
}: WarrantyFiltersProps): React.JSX.Element {
  const active =
    values.query.trim().length >
      0 ||
    values.status !== "all" ||
    values.sort !== "newest" ||
    values.registrationRequiredOnly ||
    values.transferableOnly ||
    values.expiringSoonOnly ||
    values.claimsAvailableOnly;

  return (
    <section className="grid gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_210px_210px_auto] xl:items-center">
        <SearchInput
          value={values.query}
          disabled={disabled}
          placeholder="Search warranty, product, order or owner"
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
          aria-label="Warranty status"
          onChange={(event) =>
            onChange({
              ...values,
              status:
                event.target
                  .value as WarrantyFilterValues["status"],
            })
          }
        />

        <Select
          value={values.sort}
          options={sortOptions}
          disabled={disabled}
          aria-label="Sort warranties"
          onChange={(event) =>
            onChange({
              ...values,
              sort:
                event.target
                  .value as WarrantySortOption,
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
              values.registrationRequiredOnly
            }
            disabled={disabled}
            onChange={(event) =>
              onChange({
                ...values,
                registrationRequiredOnly:
                  event.target
                    .checked,
              })
            }
            className="size-4 accent-[var(--color-gold-500)]"
          />
          Registration pending
        </label>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm">
          <input
            type="checkbox"
            checked={
              values.transferableOnly
            }
            disabled={disabled}
            onChange={(event) =>
              onChange({
                ...values,
                transferableOnly:
                  event.target
                    .checked,
              })
            }
            className="size-4 accent-[var(--color-gold-500)]"
          />
          Transferable
        </label>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm">
          <input
            type="checkbox"
            checked={
              values.expiringSoonOnly
            }
            disabled={disabled}
            onChange={(event) =>
              onChange({
                ...values,
                expiringSoonOnly:
                  event.target
                    .checked,
              })
            }
            className="size-4 accent-[var(--color-gold-500)]"
          />
          Expiring within 30 days
        </label>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm">
          <input
            type="checkbox"
            checked={
              values.claimsAvailableOnly
            }
            disabled={disabled}
            onChange={(event) =>
              onChange({
                ...values,
                claimsAvailableOnly:
                  event.target
                    .checked,
              })
            }
            className="size-4 accent-[var(--color-gold-500)]"
          />
          Claims available
        </label>
      </div>
    </section>
  );
}
