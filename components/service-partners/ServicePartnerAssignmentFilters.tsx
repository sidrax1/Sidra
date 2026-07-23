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
  ServicePartnerAssignment,
  ServicePartnerCapability,
} from "@/types/service-partner";

export type ServicePartnerAssignmentSortOption =
  | "responseDue"
  | "completionDue"
  | "highestPriority"
  | "highestValue"
  | "lowestValue"
  | "newest"
  | "oldest";

export interface ServicePartnerAssignmentFilterValues {
  readonly query: string;
  readonly status:
    | ServicePartnerAssignment["status"]
    | "all";
  readonly sourceType:
    | ServicePartnerAssignment["sourceType"]
    | "all";
  readonly capability:
    | ServicePartnerCapability
    | "all";
  readonly priority:
    | ServicePartnerAssignment["priority"]
    | "all";
  readonly sort: ServicePartnerAssignmentSortOption;
  readonly overdueOnly: boolean;
  readonly assignedToMeOnly: boolean;
}

interface ServicePartnerAssignmentFiltersProps {
  readonly values: ServicePartnerAssignmentFilterValues;
  readonly disabled?: boolean;
  readonly onChange: (
    values: ServicePartnerAssignmentFilterValues
  ) => void;
}

const statusOptions = [
  {
    value: "all",
    label: "All Statuses",
  },
  {
    value: "assigned",
    label: "Assigned",
  },
  {
    value: "accepted",
    label: "Accepted",
  },
  {
    value: "scheduled",
    label: "Scheduled",
  },
  {
    value: "inProgress",
    label: "In Progress",
  },
  {
    value: "completed",
    label: "Completed",
  },
  {
    value: "declined",
    label: "Declined",
  },
  {
    value: "cancelled",
    label: "Cancelled",
  },
] as const;

const sourceTypeOptions = [
  {
    value: "all",
    label: "All Sources",
  },
  {
    value: "warrantyClaim",
    label: "Warranty Claim",
  },
  {
    value: "returnInspection",
    label: "Return Inspection",
  },
  {
    value: "disputeInspection",
    label: "Dispute Inspection",
  },
  {
    value: "repairRequest",
    label: "Repair Request",
  },
  {
    value: "qualityAudit",
    label: "Quality Audit",
  },
] as const;

const capabilityOptions = [
  {
    value: "all",
    label: "All Capabilities",
  },
  {
    value: "productInspection",
    label: "Product Inspection",
  },
  {
    value: "resinRepair",
    label: "Resin Repair",
  },
  {
    value: "surfaceRestoration",
    label: "Surface Restoration",
  },
  {
    value: "structuralRepair",
    label: "Structural Repair",
  },
  {
    value: "hardwareReplacement",
    label: "Hardware Replacement",
  },
  {
    value: "electricalRepair",
    label: "Electrical Repair",
  },
  {
    value: "customisationCorrection",
    label: "Customisation Correction",
  },
  {
    value: "pickup",
    label: "Pickup",
  },
  {
    value: "reverseLogistics",
    label: "Reverse Logistics",
  },
  {
    value: "replacementDelivery",
    label: "Replacement Delivery",
  },
  {
    value: "onSiteService",
    label: "On-site Service",
  },
  {
    value: "remoteAssessment",
    label: "Remote Assessment",
  },
  {
    value: "qualityCertification",
    label: "Quality Certification",
  },
  {
    value: "securePackaging",
    label: "Secure Packaging",
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
    value: "responseDue",
    label: "Response Due",
  },
  {
    value: "completionDue",
    label: "Completion Due",
  },
  {
    value: "highestPriority",
    label: "Highest Priority",
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
    value: "newest",
    label: "Newest First",
  },
  {
    value: "oldest",
    label: "Oldest First",
  },
] as const;

const defaultValues: ServicePartnerAssignmentFilterValues =
  {
    query: "",
    status: "all",
    sourceType: "all",
    capability: "all",
    priority: "all",
    sort: "responseDue",
    overdueOnly: false,
    assignedToMeOnly:
      false,
  };

export function ServicePartnerAssignmentFilters({
  disabled = false,
  onChange,
  values,
}: ServicePartnerAssignmentFiltersProps): React.JSX.Element {
  const active =
    values.query.trim().length >
      0 ||
    values.status !== "all" ||
    values.sourceType !== "all" ||
    values.capability !== "all" ||
    values.priority !== "all" ||
    values.sort !== "responseDue" ||
    values.overdueOnly ||
    values.assignedToMeOnly;

  return (
    <section className="grid gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_190px_210px_220px_160px_190px_auto] xl:items-center">
        <SearchInput
          value={values.query}
          disabled={disabled}
          placeholder="Search assignment, partner, source or customer"
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
          aria-label="Assignment status"
          onChange={(event) =>
            onChange({
              ...values,
              status:
                event.target
                  .value as ServicePartnerAssignmentFilterValues["status"],
            })
          }
        />

        <Select
          value={
            values.sourceType
          }
          options={
            sourceTypeOptions
          }
          disabled={disabled}
          aria-label="Assignment source type"
          onChange={(event) =>
            onChange({
              ...values,
              sourceType:
                event.target
                  .value as ServicePartnerAssignmentFilterValues["sourceType"],
            })
          }
        />

        <Select
          value={
            values.capability
          }
          options={
            capabilityOptions
          }
          disabled={disabled}
          aria-label="Required capability"
          onChange={(event) =>
            onChange({
              ...values,
              capability:
                event.target
                  .value as ServicePartnerAssignmentFilterValues["capability"],
            })
          }
        />

        <Select
          value={values.priority}
          options={priorityOptions}
          disabled={disabled}
          aria-label="Assignment priority"
          onChange={(event) =>
            onChange({
              ...values,
              priority:
                event.target
                  .value as ServicePartnerAssignmentFilterValues["priority"],
            })
          }
        />

        <Select
          value={values.sort}
          options={sortOptions}
          disabled={disabled}
          aria-label="Sort assignments"
          onChange={(event) =>
            onChange({
              ...values,
              sort:
                event.target
                  .value as ServicePartnerAssignmentSortOption,
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
              values.overdueOnly
            }
            disabled={disabled}
            onChange={(event) =>
              onChange({
                ...values,
                overdueOnly:
                  event.target
                    .checked,
              })
            }
            className="size-4 accent-[var(--color-gold-500)]"
          />
          Overdue only
        </label>

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
      </div>
    </section>
  );
}
