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
  ServicePartnerApplication,
  ServicePartnerType,
} from "@/types/service-partner";

export type ServicePartnerApplicationSortOption =
  | "newestSubmission"
  | "oldestSubmission"
  | "newestCreated"
  | "highestDocumentCount"
  | "highestCapabilityCount"
  | "alphabetical";

export interface ServicePartnerApplicationFilterValues {
  readonly query: string;
  readonly status:
    | ServicePartnerApplication["status"]
    | "all";
  readonly partnerType:
    | ServicePartnerType
    | "all";
  readonly sort: ServicePartnerApplicationSortOption;
  readonly assignedToMeOnly: boolean;
  readonly documentsMissingOnly: boolean;
  readonly reviewPendingOnly: boolean;
}

interface ServicePartnerApplicationFiltersProps {
  readonly values: ServicePartnerApplicationFilterValues;
  readonly disabled?: boolean;
  readonly onChange: (
    values: ServicePartnerApplicationFilterValues
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
    value: "submitted",
    label: "Submitted",
  },
  {
    value: "underReview",
    label: "Under Review",
  },
  {
    value:
      "additionalInformationRequired",
    label: "Information Required",
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
    value: "withdrawn",
    label: "Withdrawn",
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
    value:
      "qualityAssuranceCentre",
    label:
      "Quality Assurance Centre",
  },
  {
    value: "multiServicePartner",
    label: "Multi-service Partner",
  },
] as const;

const sortOptions = [
  {
    value: "newestSubmission",
    label: "Newest Submission",
  },
  {
    value: "oldestSubmission",
    label: "Oldest Submission",
  },
  {
    value: "newestCreated",
    label: "Newest Created",
  },
  {
    value: "highestDocumentCount",
    label: "Most Documents",
  },
  {
    value: "highestCapabilityCount",
    label: "Most Capabilities",
  },
  {
    value: "alphabetical",
    label: "Alphabetical",
  },
] as const;

const defaultValues: ServicePartnerApplicationFilterValues =
  {
    query: "",
    status: "all",
    partnerType: "all",
    sort: "newestSubmission",
    assignedToMeOnly:
      false,
    documentsMissingOnly:
      false,
    reviewPendingOnly:
      false,
  };

export function ServicePartnerApplicationFilters({
  disabled = false,
  onChange,
  values,
}: ServicePartnerApplicationFiltersProps): React.JSX.Element {
  const active =
    values.query.trim().length >
      0 ||
    values.status !== "all" ||
    values.partnerType !==
      "all" ||
    values.sort !==
      "newestSubmission" ||
    values.assignedToMeOnly ||
    values.documentsMissingOnly ||
    values.reviewPendingOnly;

  return (
    <section className="grid gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px_230px_220px_auto] xl:items-center">
        <SearchInput
          value={values.query}
          disabled={disabled}
          placeholder="Search business, applicant, city or application number"
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
          aria-label="Application status"
          onChange={(event) =>
            onChange({
              ...values,
              status:
                event.target
                  .value as ServicePartnerApplicationFilterValues["status"],
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
          aria-label="Application partner type"
          onChange={(event) =>
            onChange({
              ...values,
              partnerType:
                event.target
                  .value as ServicePartnerApplicationFilterValues["partnerType"],
            })
          }
        />

        <Select
          value={values.sort}
          options={sortOptions}
          disabled={disabled}
          aria-label="Sort service partner applications"
          onChange={(event) =>
            onChange({
              ...values,
              sort:
                event.target
                  .value as ServicePartnerApplicationSortOption,
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
              values.assignedToMeOnly
            }
            disabled={disabled}
            onChange={(event) =>
              onChange({
                ...values,
                assignedToMeOnly:
                  event.target
                    .checked,
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
              values.documentsMissingOnly
            }
            disabled={disabled}
            onChange={(event) =>
              onChange({
                ...values,
                documentsMissingOnly:
                  event.target
                    .checked,
              })
            }
            className="size-4 accent-[var(--color-gold-500)]"
          />
          Documents missing
        </label>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm">
          <input
            type="checkbox"
            checked={
              values.reviewPendingOnly
            }
            disabled={disabled}
            onChange={(event) =>
              onChange({
                ...values,
                reviewPendingOnly:
                  event.target
                    .checked,
              })
            }
            className="size-4 accent-[var(--color-gold-500)]"
          />
          Review pending
        </label>
      </div>
    </section>
  );
}
