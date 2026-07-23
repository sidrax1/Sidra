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
  ServicePartnerStatus,
  ServicePartnerType,
} from "@/types/service-partner";

export type ServicePartnerSortOption =
  | "highestQuality"
  | "highestRating"
  | "fastestCompletion"
  | "mostAssignments"
  | "newest"
  | "oldest"
  | "availableCapacity";

export interface ServicePartnerFilterValues {
  readonly query: string;
  readonly status:
    | ServicePartnerStatus
    | "all";
  readonly partnerType:
    | ServicePartnerType
    | "all";
  readonly state: string;
  readonly city: string;
  readonly sort: ServicePartnerSortOption;
  readonly acceptingAssignmentsOnly: boolean;
  readonly verifiedOnly: boolean;
  readonly highQualityOnly: boolean;
}

interface ServicePartnerFiltersProps {
  readonly values: ServicePartnerFilterValues;
  readonly stateOptions?: readonly {
    readonly value: string;
    readonly label: string;
  }[];
  readonly disabled?: boolean;
  readonly onChange: (
    values: ServicePartnerFilterValues
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
    value: "pendingVerification",
    label: "Pending Verification",
  },
  {
    value: "temporarilyUnavailable",
    label: "Temporarily Unavailable",
  },
  {
    value: "suspended",
    label: "Suspended",
  },
  {
    value: "rejected",
    label: "Rejected",
  },
  {
    value: "archived",
    label: "Archived",
  },
] as const;

const partnerTypeOptions = [
  {
    value: "all",
    label: "All Partner Types",
  },
  {
    value: "repairStudio",
    label: "Repair Studio",
  },
  {
    value: "inspectionCentre",
    label: "Inspection Centre",
  },
  {
    value: "logisticsPartner",
    label: "Logistics Partner",
  },
  {
    value: "installationPartner",
    label: "Installation Partner",
  },
  {
    value: "restorationSpecialist",
    label: "Restoration Specialist",
  },
  {
    value: "qualityAssuranceCentre",
    label: "Quality Assurance Centre",
  },
  {
    value: "multiServicePartner",
    label: "Multi-service Partner",
  },
] as const;

const sortOptions = [
  {
    value: "highestQuality",
    label: "Highest Quality",
  },
  {
    value: "highestRating",
    label: "Highest Rating",
  },
  {
    value: "fastestCompletion",
    label: "Fastest Completion",
  },
  {
    value: "mostAssignments",
    label: "Most Assignments",
  },
  {
    value: "availableCapacity",
    label: "Available Capacity",
  },
  {
    value: "newest",
    label: "Newest First",
  },
  {
    value: "oldest",
    label: "Oldest First",
  },
] as const;

const defaultValues: ServicePartnerFilterValues =
  {
    query: "",
    status: "all",
    partnerType: "all",
    state: "",
    city: "",
    sort: "highestQuality",
    acceptingAssignmentsOnly:
      false,
    verifiedOnly: false,
    highQualityOnly: false,
  };

export function ServicePartnerFilters({
  disabled = false,
  onChange,
  stateOptions = [],
  values,
}: ServicePartnerFiltersProps): React.JSX.Element {
  const active =
    values.query.trim().length >
      0 ||
    values.status !== "all" ||
    values.partnerType !==
      "all" ||
    values.state.length > 0 ||
    values.city.trim().length >
      0 ||
    values.sort !==
      "highestQuality" ||
    values.acceptingAssignmentsOnly ||
    values.verifiedOnly ||
    values.highQualityOnly;

  return (
    <section className="grid gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_210px_220px_190px_210px_auto] xl:items-center">
        <SearchInput
          value={values.query}
          disabled={disabled}
          placeholder="Search partner, city, capability or number"
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
          aria-label="Service partner status"
          onChange={(event) =>
            onChange({
              ...values,
              status:
                event.target
                  .value as ServicePartnerFilterValues["status"],
            })
          }
        />

        <Select
          value={
            values.partnerType
          }
          options={
            partnerTypeOptions
          }
          disabled={disabled}
          aria-label="Service partner type"
          onChange={(event) =>
            onChange({
              ...values,
              partnerType:
                event.target
                  .value as ServicePartnerFilterValues["partnerType"],
            })
          }
        />

        {stateOptions.length >
        0 ? (
          <Select
            value={values.state}
            options={[
              {
                value: "",
                label: "All States",
              },
              ...stateOptions,
            ]}
            disabled={disabled}
            aria-label="Service state"
            onChange={(event) =>
              onChange({
                ...values,
                state:
                  event.target
                    .value,
              })
            }
          />
        ) : (
          <input
            type="text"
            value={values.state}
            disabled={disabled}
            aria-label="Service state"
            placeholder="State"
            className="h-11 rounded-[var(--radius-md)] border border-border bg-background px-4 text-sm text-foreground outline-none transition-[border-color,box-shadow] focus:border-[var(--color-gold-500)] focus:ring-2 focus:ring-[color:rgb(200_169_106_/_0.15)]"
            onChange={(event) =>
              onChange({
                ...values,
                state:
                  event.target
                    .value,
              })
            }
          />
        )}

        <Select
          value={values.sort}
          options={sortOptions}
          disabled={disabled}
          aria-label="Sort service partners"
          onChange={(event) =>
            onChange({
              ...values,
              sort:
                event.target
                  .value as ServicePartnerSortOption,
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

      <div className="grid gap-4 border-t border-border pt-4 md:grid-cols-[minmax(0,240px)_minmax(0,1fr)] md:items-center">
        <input
          type="text"
          value={values.city}
          disabled={disabled}
          aria-label="Service city"
          placeholder="Filter by city"
          className="h-11 rounded-[var(--radius-md)] border border-border bg-background px-4 text-sm text-foreground outline-none transition-[border-color,box-shadow] focus:border-[var(--color-gold-500)] focus:ring-2 focus:ring-[color:rgb(200_169_106_/_0.15)]"
          onChange={(event) =>
            onChange({
              ...values,
              city:
                event.target.value,
            })
          }
        />

        <div className="flex flex-wrap gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm">
            <input
              type="checkbox"
              checked={
                values.acceptingAssignmentsOnly
              }
              disabled={disabled}
              onChange={(event) =>
                onChange({
                  ...values,
                  acceptingAssignmentsOnly:
                    event.target
                      .checked,
                })
              }
              className="size-4 accent-[var(--color-gold-500)]"
            />
            Accepting assignments
          </label>

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm">
            <input
              type="checkbox"
              checked={
                values.verifiedOnly
              }
              disabled={disabled}
              onChange={(event) =>
                onChange({
                  ...values,
                  verifiedOnly:
                    event.target
                      .checked,
                })
              }
              className="size-4 accent-[var(--color-gold-500)]"
            />
            Verified only
          </label>

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm">
            <input
              type="checkbox"
              checked={
                values.highQualityOnly
              }
              disabled={disabled}
              onChange={(event) =>
                onChange({
                  ...values,
                  highQualityOnly:
                    event.target
                      .checked,
                })
              }
              className="size-4 accent-[var(--color-gold-500)]"
            />
            Quality score 80+
          </label>
        </div>
      </div>
    </section>
  );
}
