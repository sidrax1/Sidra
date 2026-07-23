"use client";

import {
  Search,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import type {
  LoyaltyRewardStatus,
  LoyaltyRewardType,
  LoyaltyTier,
} from "@/types/loyalty";

export interface LoyaltyRewardFilterValues {
  readonly query: string;
  readonly status:
    | LoyaltyRewardStatus
    | "all";
  readonly type:
    | LoyaltyRewardType
    | "all";
  readonly minimumTier:
    | LoyaltyTier
    | "all";
  readonly featuredOnly: boolean;
}

interface LoyaltyRewardFiltersProps {
  readonly values: LoyaltyRewardFilterValues;
  readonly disabled?: boolean;
  readonly onChange: (
    values: LoyaltyRewardFilterValues
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
    label: "All Reward Types",
  },
  {
    value: "fixedDiscount",
    label: "Fixed Discount",
  },
  {
    value: "percentageDiscount",
    label: "Percentage Discount",
  },
  {
    value: "freeShipping",
    label: "Free Shipping",
  },
  {
    value: "giftCard",
    label: "Gift Card",
  },
  {
    value: "exclusiveAccess",
    label: "Exclusive Access",
  },
  {
    value: "complimentaryGift",
    label: "Complimentary Gift",
  },
] as const;

const tierOptions = [
  {
    value: "all",
    label: "All Tiers",
  },
  {
    value: "atelier",
    label: "Atelier",
  },
  {
    value: "signature",
    label: "Signature",
  },
  {
    value: "prestige",
    label: "Prestige",
  },
  {
    value: "maison",
    label: "Maison",
  },
] as const;

const defaultValues: LoyaltyRewardFilterValues =
  {
    query: "",
    status: "all",
    type: "all",
    minimumTier: "all",
    featuredOnly: false,
  };

export function LoyaltyRewardFilters({
  disabled = false,
  onChange,
  values,
}: LoyaltyRewardFiltersProps): React.JSX.Element {
  const active =
    values.query.trim().length >
      0 ||
    values.status !== "all" ||
    values.type !== "all" ||
    values.minimumTier !==
      "all" ||
    values.featuredOnly;

  return (
    <section className="grid gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-4 shadow-[var(--shadow-card)] xl:grid-cols-[minmax(0,1fr)_190px_210px_180px_auto] xl:items-center">
      <SearchInput
        value={values.query}
        disabled={disabled}
        placeholder="Search loyalty rewards"
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
        aria-label="Reward status"
        onChange={(event) =>
          onChange({
            ...values,
            status:
              event.target
                .value as LoyaltyRewardFilterValues["status"],
          })
        }
      />

      <Select
        value={values.type}
        options={typeOptions}
        disabled={disabled}
        aria-label="Reward type"
        onChange={(event) =>
          onChange({
            ...values,
            type:
              event.target
                .value as LoyaltyRewardFilterValues["type"],
          })
        }
      />

      <Select
        value={
          values.minimumTier
        }
        options={tierOptions}
        disabled={disabled}
        aria-label="Minimum loyalty tier"
        onChange={(event) =>
          onChange({
            ...values,
            minimumTier:
              event.target
                .value as LoyaltyRewardFilterValues["minimumTier"],
          })
        }
      />

      <div className="flex flex-wrap gap-2 xl:justify-end">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm">
          <input
            type="checkbox"
            checked={
              values.featuredOnly
            }
            disabled={disabled}
            onChange={(event) =>
              onChange({
                ...values,
                featuredOnly:
                  event.target
                    .checked,
              })
            }
            className="size-4 accent-[var(--color-gold-500)]"
          />
          Featured
        </label>

        {active ? (
          <Button
            variant="ghost"
            size="sm"
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
    </section>
  );
}
