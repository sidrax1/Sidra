"use client";

import {
  ArrowUpRight,
  BadgeIndianRupee,
  CalendarClock,
  Clock3,
  MoreVertical,
  ShieldAlert,
  Store,
  UserRound,
  Wrench,
} from "lucide-react";

import {
  ServicePartnerAssignmentStatusBadge,
} from "@/components/service-partners/ServicePartnerAssignmentStatusBadge";
import {
  ServicePartnerCapabilityBadge,
} from "@/components/service-partners/ServicePartnerCapabilityBadge";
import {
  Badge,
} from "@/components/ui/Badge";
import {
  Button,
} from "@/components/ui/Button";
import {
  Card,
} from "@/components/ui/Card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import {
  IconButton,
} from "@/components/ui/IconButton";
import {
  Price,
} from "@/components/ui/Price";
import {
  formatDateTime,
} from "@/lib/date";
import {
  cn,
} from "@/lib/utils";
import type {
  ServicePartnerAssignment,
} from "@/types/service-partner";

interface ServicePartnerAssignmentCardProps {
  readonly assignment: ServicePartnerAssignment;
  readonly loading?: boolean;
  readonly className?: string;
  readonly onOpen: (
    assignment: ServicePartnerAssignment
  ) => void;
  readonly onAccept?: (
    assignment: ServicePartnerAssignment
  ) => void | Promise<void>;
  readonly onDecline?: (
    assignment: ServicePartnerAssignment
  ) => void;
  readonly onSchedule?: (
    assignment: ServicePartnerAssignment
  ) => void;
  readonly onStart?: (
    assignment: ServicePartnerAssignment
  ) => void | Promise<void>;
  readonly onComplete?: (
    assignment: ServicePartnerAssignment
  ) => void;
  readonly onCancel?: (
    assignment: ServicePartnerAssignment
  ) => void;
}

const priorityLabels: Record<
  ServicePartnerAssignment["priority"],
  string
> = {
  low: "Low Priority",
  normal: "Normal Priority",
  high: "High Priority",
  urgent: "Urgent Priority",
};

const sourceTypeLabels: Record<
  ServicePartnerAssignment["sourceType"],
  string
> = {
  warrantyClaim:
    "Warranty Claim",
  returnInspection:
    "Return Inspection",
  disputeInspection:
    "Dispute Inspection",
  repairRequest:
    "Repair Request",
  qualityAudit:
    "Quality Audit",
};

export function ServicePartnerAssignmentCard({
  assignment,
  className,
  loading = false,
  onAccept,
  onCancel,
  onComplete,
  onDecline,
  onOpen,
  onSchedule,
  onStart,
}: ServicePartnerAssignmentCardProps): React.JSX.Element {
  const urgent =
    assignment.priority ===
    "urgent";

  const responseOverdue =
    ![
      "declined",
      "completed",
      "cancelled",
    ].includes(
      assignment.status
    ) &&
    new Date(
      assignment.responseDueAt
    ).getTime() < Date.now();

  const completionOverdue =
    Boolean(
      assignment.completionDueAt
    ) &&
    ![
      "completed",
      "cancelled",
    ].includes(
      assignment.status
    ) &&
    new Date(
      assignment.completionDueAt ??
        ""
    ).getTime() < Date.now();

  const canRespond =
    assignment.status ===
    "assigned";

  const canSchedule =
    assignment.status ===
      "accepted" ||
    assignment.status ===
      "scheduled";

  const canStart =
    assignment.status ===
      "accepted" ||
    assignment.status ===
      "scheduled";

  const canComplete =
    assignment.status ===
    "inProgress";

  const canCancel =
    ![
      "completed",
      "cancelled",
      "declined",
    ].includes(
      assignment.status
    );

  return (
    <Card
      className={cn(
        "overflow-hidden transition-[transform,border-color,box-shadow]",
        "hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]",
        urgent ||
          responseOverdue ||
          completionOverdue
          ? "border-[color:rgb(145_59_59_/_0.42)]"
          : "hover:border-[color:rgb(200_169_106_/_0.42)]",
        className
      )}
    >
      <header className="flex items-start justify-between gap-5 border-b border-border bg-[color:rgb(200_169_106_/_0.05)] p-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <ServicePartnerAssignmentStatusBadge
              status={
                assignment.status
              }
            />

            <ServicePartnerCapabilityBadge
              capability={
                assignment.capability
              }
            />

            <Badge
              variant={
                urgent
                  ? "error"
                  : assignment.priority ===
                      "high"
                    ? "warning"
                    : assignment.priority ===
                        "normal"
                      ? "gold"
                      : "neutral"
              }
            >
              {
                priorityLabels[
                  assignment
                    .priority
                ]
              }
            </Badge>
          </div>

          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.17em] text-[var(--color-gold-600)]">
            {
              sourceTypeLabels[
                assignment
                  .sourceType
              ]
            }
          </p>

          <h2 className="mt-2 font-heading text-3xl font-medium leading-tight tracking-[-0.035em] text-foreground">
            {assignment.title}
          </h2>

          <p className="mt-2 font-mono text-xs text-muted">
            Assignment #
            {
              assignment.assignmentNumber
            }
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
          >
            <IconButton
              label="Assignment actions"
              icon={
                <MoreVertical
                  aria-hidden="true"
                />
              }
              appearance="ghost"
              disabled={loading}
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={() =>
                onOpen(assignment)
              }
            >
              Open assignment
            </DropdownMenuItem>

            {canRespond &&
            onAccept ? (
              <DropdownMenuItem
                onSelect={() => {
                  void onAccept(
                    assignment
                  );
                }}
              >
                Accept assignment
              </DropdownMenuItem>
            ) : null}

            {canRespond &&
            onDecline ? (
              <DropdownMenuItem
                destructive
                onSelect={() =>
                  onDecline(
                    assignment
                  )
                }
              >
                Decline assignment
              </DropdownMenuItem>
            ) : null}

            {canSchedule &&
            onSchedule ? (
              <DropdownMenuItem
                onSelect={() =>
                  onSchedule(
                    assignment
                  )
                }
              >
                Schedule service
              </DropdownMenuItem>
            ) : null}

            {canStart &&
            onStart ? (
              <DropdownMenuItem
                onSelect={() => {
                  void onStart(
                    assignment
                  );
                }}
              >
                Start service
              </DropdownMenuItem>
            ) : null}

            {canComplete &&
            onComplete ? (
              <DropdownMenuItem
                onSelect={() =>
                  onComplete(
                    assignment
                  )
                }
              >
                Complete service
              </DropdownMenuItem>
            ) : null}

            {canCancel &&
            onCancel ? (
              <DropdownMenuItem
                destructive
                onSelect={() =>
                  onCancel(
                    assignment
                  )
                }
              >
                Cancel assignment
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="grid gap-6 p-5">
        {(responseOverdue ||
          completionOverdue) ? (
          <section className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[color:rgb(145_59_59_/_0.32)] bg-[color:rgb(145_59_59_/_0.06)] p-4">
            <ShieldAlert
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-[var(--color-error)]"
            />

            <div>
              <p className="text-sm font-medium text-[var(--color-error)]">
                Service deadline
                requires attention
              </p>

              <p className="mt-1 text-xs leading-5 text-muted">
                {completionOverdue
                  ? "The assignment completion deadline has passed."
                  : "The initial assignment response deadline has passed."}
              </p>
            </div>
          </section>
        ) : null}

        <p className="line-clamp-4 whitespace-pre-wrap text-sm leading-7 text-muted">
          {assignment.description}
        </p>

        <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
            <dt className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.13em] text-muted">
              <CalendarClock
                aria-hidden="true"
                className="size-3.5 text-[var(--color-gold-600)]"
              />
              Response Due
            </dt>

            <dd
              className={cn(
                "mt-2 text-sm font-medium",
                responseOverdue
                  ? "text-[var(--color-error)]"
                  : "text-foreground"
              )}
            >
              {formatDateTime(
                assignment.responseDueAt
              )}
            </dd>
          </div>

          <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
            <dt className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.13em] text-muted">
              <Clock3
                aria-hidden="true"
                className="size-3.5 text-[var(--color-gold-600)]"
              />
              Completion Due
            </dt>

            <dd
              className={cn(
                "mt-2 text-sm font-medium",
                completionOverdue
                  ? "text-[var(--color-error)]"
                  : "text-foreground"
              )}
            >
              {assignment.completionDueAt
                ? formatDateTime(
                    assignment.completionDueAt
                  )
                : "Not scheduled"}
            </dd>
          </div>

          <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
            <dt className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.13em] text-muted">
              <BadgeIndianRupee
                aria-hidden="true"
                className="size-3.5 text-[var(--color-gold-600)]"
              />
              Approved Cost
            </dt>

            <dd className="mt-2">
              <Price
                amount={
                  assignment.approvedCostPaise /
                  100
                }
                size="sm"
              />
            </dd>
          </div>

          <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
            <dt className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.13em] text-muted">
              <Wrench
                aria-hidden="true"
                className="size-3.5 text-[var(--color-gold-600)]"
              />
              Partner Payable
            </dt>

            <dd className="mt-2">
              <Price
                amount={
                  assignment.platformPayablePaise /
                  100
                }
                size="sm"
              />
            </dd>
          </div>
        </dl>

        <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs text-muted">
          <span className="inline-flex items-center gap-2">
            <Store
              aria-hidden="true"
              className="size-3.5 text-[var(--color-gold-600)]"
            />
            Studio{" "}
            {assignment.studioId}
          </span>

          <span className="inline-flex items-center gap-2">
            <UserRound
              aria-hidden="true"
              className="size-3.5 text-[var(--color-gold-600)]"
            />
            Customer{" "}
            {assignment.customerId}
          </span>

          {assignment.scheduledAt ? (
            <span className="inline-flex items-center gap-2">
              <CalendarClock
                aria-hidden="true"
                className="size-3.5 text-[var(--color-success)]"
              />
              Scheduled{" "}
              {formatDateTime(
                assignment.scheduledAt
              )}
            </span>
          ) : null}
        </div>

        <div className="flex justify-end border-t border-border pt-5">
          <Button
            variant="outline"
            disabled={loading}
            onClick={() =>
              onOpen(assignment)
            }
          >
            View Assignment
            <ArrowUpRight
              aria-hidden="true"
              className="size-4"
            />
          </Button>
        </div>
      </div>
    </Card>
  );
}
