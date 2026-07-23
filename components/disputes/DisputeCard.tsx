"use client";

import {
  ArrowUpRight,
  CalendarClock,
  MoreVertical,
  ReceiptText,
  ShieldAlert,
  Store,
  UserRound,
} from "lucide-react";

import { DisputePriorityBadge } from "@/components/disputes/DisputePriorityBadge";
import { DisputeReasonBadge } from "@/components/disputes/DisputeReasonBadge";
import { DisputeStatusBadge } from "@/components/disputes/DisputeStatusBadge";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { IconButton } from "@/components/ui/IconButton";
import { Price } from "@/components/ui/Price";
import { formatDateTime } from "@/lib/date";
import { cn } from "@/lib/utils";
import type {
  Dispute,
} from "@/types/dispute";

interface DisputeCardProps {
  readonly dispute: Dispute;
  readonly loading?: boolean;
  readonly className?: string;
  readonly onOpen: (
    dispute: Dispute
  ) => void;
  readonly onAssign?: (
    dispute: Dispute
  ) => void;
  readonly onEscalate?: (
    dispute: Dispute
  ) => void;
  readonly onResolve?: (
    dispute: Dispute
  ) => void;
}

export function DisputeCard({
  className,
  dispute,
  loading = false,
  onAssign,
  onEscalate,
  onOpen,
  onResolve,
}: DisputeCardProps): React.JSX.Element {
  const urgent =
    dispute.priority === "urgent" ||
    dispute.riskScore >= 80;

  return (
    <Card
      className={cn(
        "overflow-hidden transition-[transform,border-color,box-shadow]",
        "hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]",
        urgent
          ? "border-[color:rgb(145_59_59_/_0.42)]"
          : "hover:border-[color:rgb(200_169_106_/_0.4)]",
        className
      )}
    >
      <header className="flex items-start justify-between gap-5 border-b border-border bg-[color:rgb(200_169_106_/_0.05)] p-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <DisputeStatusBadge
              status={dispute.status}
            />

            <DisputePriorityBadge
              priority={dispute.priority}
            />

            <DisputeReasonBadge
              reason={dispute.reason}
            />

            <Badge
              variant={
                dispute.riskScore >= 80
                  ? "error"
                  : dispute.riskScore >= 50
                    ? "warning"
                    : "neutral"
              }
            >
              <ShieldAlert
                aria-hidden={true}
                className="mr-1 size-3.5"
              />
              Risk {dispute.riskScore}
            </Badge>
          </div>

          <h2 className="mt-4 font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
            Dispute #{dispute.disputeNumber}
          </h2>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton
              label="Dispute actions"
              icon={
                <MoreVertical
                  aria-hidden={true}
                />
              }
              appearance="ghost"
              disabled={loading}
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={() =>
                onOpen(dispute)
              }
            >
              Open dispute
            </DropdownMenuItem>

            {onAssign ? (
              <DropdownMenuItem
                onSelect={() =>
                  onAssign(dispute)
                }
              >
                Assign reviewer
              </DropdownMenuItem>
            ) : null}

            {onEscalate &&
            dispute.status !== "escalated" ? (
              <DropdownMenuItem
                onSelect={() =>
                  onEscalate(dispute)
                }
              >
                Escalate dispute
              </DropdownMenuItem>
            ) : null}

            {onResolve &&
            ![
              "resolvedForCustomer",
              "resolvedForStudio",
              "partiallyResolved",
              "closed",
              "withdrawn",
            ].includes(dispute.status) ? (
              <DropdownMenuItem
                onSelect={() =>
                  onResolve(dispute)
                }
              >
                Resolve dispute
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="grid gap-5 p-5">
        <div>
          <h3 className="font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
            {dispute.title}
          </h3>

          <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted">
            {dispute.description}
          </p>
        </div>

        <dl className="grid gap-3 rounded-[var(--radius-md)] border border-border bg-background p-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-[0.14em] text-muted">
              Disputed Amount
            </dt>

            <dd className="mt-2">
              <Price
                amount={
                  dispute.financialImpact
                    .disputedAmountPaise / 100
                }
                size="lg"
              />
            </dd>
          </div>

          <div>
            <dt className="text-xs uppercase tracking-[0.14em] text-muted">
              Response Due
            </dt>

            <dd className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-foreground">
              <CalendarClock
                aria-hidden={true}
                className="size-4 text-[var(--color-gold-600)]"
              />
              {formatDateTime(
                dispute.responseDueAt
              )}
            </dd>
          </div>
        </dl>

        <div className="flex flex-wrap gap-x-5 gap-y-3 text-xs text-muted">
          <span className="inline-flex items-center gap-2">
            <ReceiptText
              aria-hidden={true}
              className="size-3.5 text-[var(--color-gold-600)]"
            />
            Order #{dispute.order.orderNumber}
          </span>

          <span className="inline-flex items-center gap-2">
            <UserRound
              aria-hidden={true}
              className="size-3.5 text-[var(--color-gold-600)]"
            />
            {dispute.order.customerEmail}
          </span>

          <span className="inline-flex items-center gap-2">
            <Store
              aria-hidden={true}
              className="size-3.5 text-[var(--color-gold-600)]"
            />
            {dispute.order.studioName}
          </span>
        </div>

        <div className="flex justify-end border-t border-border pt-5">
          <Button
            variant="outline"
            onClick={() =>
              onOpen(dispute)
            }
          >
            Review Dispute
            <ArrowUpRight
              aria-hidden={true}
              className="size-4"
            />
          </Button>
        </div>
      </div>
    </Card>
  );
}
