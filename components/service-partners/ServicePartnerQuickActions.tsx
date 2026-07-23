"use client";

import {
  CalendarClock,
  Edit3,
  FileCheck2,
  PauseCircle,
  ShieldAlert,
  UserRoundCog,
  Wrench,
} from "lucide-react";

import {
  Button,
} from "@/components/ui/Button";
import {
  cn,
} from "@/lib/utils";
import type {
  ServicePartner,
} from "@/types/service-partner";

interface ServicePartnerQuickActionsProps {
  readonly partner: ServicePartner;
  readonly loading?: boolean;
  readonly className?: string;
  readonly onAssign?: (
    partner: ServicePartner
  ) => void;
  readonly onEdit?: (
    partner: ServicePartner
  ) => void;
  readonly onAvailability?: (
    partner: ServicePartner
  ) => void;
  readonly onStatus?: (
    partner: ServicePartner
  ) => void;
  readonly onDocuments?: (
    partner: ServicePartner
  ) => void;
  readonly onScheduleInspection?: (
    partner: ServicePartner
  ) => void;
}

export function ServicePartnerQuickActions({
  className,
  loading = false,
  onAssign,
  onAvailability,
  onDocuments,
  onEdit,
  onScheduleInspection,
  onStatus,
  partner,
}: ServicePartnerQuickActionsProps): React.JSX.Element {
  const canAssign =
    partner.status === "active" &&
    partner.acceptingAssignments &&
    partner.currentAssignmentCount <
      partner.maximumConcurrentAssignments;

  return (
    <section
      className={cn(
        "rounded-[var(--radius-xl)] border border-border bg-card p-5 shadow-[var(--shadow-card)]",
        className
      )}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.17em] text-[var(--color-gold-600)]">
          Operations
        </p>

        <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
          Quick Actions
        </h2>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {onAssign ? (
          <Button
            disabled={
              loading ||
              !canAssign
            }
            onClick={() =>
              onAssign(partner)
            }
          >
            <Wrench
              aria-hidden="true"
              className="size-4"
            />
            Create Assignment
          </Button>
        ) : null}

        {onAvailability ? (
          <Button
            variant="outline"
            disabled={loading}
            onClick={() =>
              onAvailability(
                partner
              )
            }
          >
            <PauseCircle
              aria-hidden="true"
              className="size-4"
            />
            Availability
          </Button>
        ) : null}

        {onEdit ? (
          <Button
            variant="outline"
            disabled={loading}
            onClick={() =>
              onEdit(partner)
            }
          >
            <Edit3
              aria-hidden="true"
              className="size-4"
            />
            Edit Profile
          </Button>
        ) : null}

        {onStatus ? (
          <Button
            variant="outline"
            disabled={loading}
            onClick={() =>
              onStatus(partner)
            }
          >
            <UserRoundCog
              aria-hidden="true"
              className="size-4"
            />
            Change Status
          </Button>
        ) : null}

        {onDocuments ? (
          <Button
            variant="ghost"
            disabled={loading}
            onClick={() =>
              onDocuments(partner)
            }
          >
            <FileCheck2
              aria-hidden="true"
              className="size-4"
            />
            Documents
          </Button>
        ) : null}

        {onScheduleInspection ? (
          <Button
            variant="ghost"
            disabled={loading}
            onClick={() =>
              onScheduleInspection(
                partner
              )
            }
          >
            <CalendarClock
              aria-hidden="true"
              className="size-4"
            />
            Site Inspection
          </Button>
        ) : null}
      </div>

      {!canAssign ? (
        <div className="mt-5 flex items-start gap-3 rounded-[var(--radius-md)] border border-[color:rgb(173_118_38_/_0.3)] bg-[color:rgb(173_118_38_/_0.06)] p-4">
          <ShieldAlert
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-[var(--color-warning)]"
          />

          <p className="text-sm leading-6 text-muted">
            New assignments are
            unavailable because the
            partner is inactive, paused
            or currently at full
            capacity.
          </p>
        </div>
      ) : null}
    </section>
  );
}
