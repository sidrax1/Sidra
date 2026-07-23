"use client";

import {
  ArrowUpRight,
  CalendarDays,
  CreditCard,
  MoreVertical,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";

import { RefundStatusBadge } from "@/components/refunds/RefundStatusBadge";
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
  Refund,
} from "@/types/refund";

interface RefundCardProps {
  readonly refund: Refund;
  readonly loading?: boolean;
  readonly className?: string;
  readonly onOpen: (
    refund: Refund
  ) => void;
  readonly onApprove?: (
    refund: Refund
  ) => void;
  readonly onReject?: (
    refund: Refund
  ) => void;
  readonly onProcess?: (
    refund: Refund
  ) => void;
  readonly onCancel?: (
    refund: Refund
  ) => void;
}

export function RefundCard({
  className,
  loading = false,
  onApprove,
  onCancel,
  onOpen,
  onProcess,
  onReject,
  refund,
}: RefundCardProps): React.JSX.Element {
  const actionable =
    refund.status === "pending" ||
    refund.status === "approved" ||
    refund.status === "processing";

  return (
    <Card
      className={cn(
        "overflow-hidden transition-[transform,border-color,box-shadow]",
        "hover:-translate-y-0.5 hover:border-[color:rgb(200_169_106_/_0.4)]",
        "hover:shadow-[var(--shadow-hover)]",
        refund.status === "failed" &&
          "border-[color:rgb(145_59_59_/_0.35)]",
        className
      )}
    >
      <header className="flex items-start justify-between gap-5 border-b border-border bg-[color:rgb(200_169_106_/_0.05)] p-5">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <RefundStatusBadge
              status={refund.status}
            />

            <Badge variant="neutral">
              #{refund.refundNumber}
            </Badge>
          </div>

          <p className="mt-4 text-xs uppercase tracking-[0.15em] text-muted">
            Refund Amount
          </p>

          <Price
            amount={
              refund.amountPaise / 100
            }
            size="xl"
            className="mt-2"
          />
        </div>

        {actionable ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton
                label="Refund actions"
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
                  onOpen(refund)
                }
              >
                Open refund
              </DropdownMenuItem>

              {refund.status === "pending" &&
              onApprove ? (
                <DropdownMenuItem
                  onSelect={() =>
                    onApprove(refund)
                  }
                >
                  Approve refund
                </DropdownMenuItem>
              ) : null}

              {refund.status === "pending" &&
              onReject ? (
                <DropdownMenuItem
                  destructive
                  onSelect={() =>
                    onReject(refund)
                  }
                >
                  Reject refund
                </DropdownMenuItem>
              ) : null}

              {refund.status === "approved" &&
              onProcess ? (
                <DropdownMenuItem
                  onSelect={() =>
                    onProcess(refund)
                  }
                >
                  Begin processing
                </DropdownMenuItem>
              ) : null}

              {onCancel ? (
                <DropdownMenuItem
                  destructive
                  onSelect={() =>
                    onCancel(refund)
                  }
                >
                  Cancel refund
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </header>

      <div className="grid gap-5 p-5">
        <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Refund Reason
          </p>

          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-foreground">
            {refund.reason}
          </p>
        </div>

        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[var(--radius-md)] border border-border bg-card p-4">
            <dt className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.13em] text-muted">
              <ReceiptText
                aria-hidden="true"
                className="size-3.5"
              />
              Order
            </dt>

            <dd className="mt-2 font-mono text-xs text-foreground">
              {refund.orderId}
            </dd>
          </div>

          <div className="rounded-[var(--radius-md)] border border-border bg-card p-4">
            <dt className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.13em] text-muted">
              <CreditCard
                aria-hidden="true"
                className="size-3.5"
              />
              Payment
            </dt>

            <dd className="mt-2 font-mono text-xs text-foreground">
              {refund.paymentId}
            </dd>
          </div>
        </dl>

        <div className="flex flex-wrap gap-x-5 gap-y-3 text-xs text-muted">
          <span className="inline-flex items-center gap-2">
            <CalendarDays
              aria-hidden="true"
              className="size-3.5 text-[var(--color-gold-600)]"
            />
            Created{" "}
            {formatDateTime(
              refund.createdAt
            )}
          </span>

          {refund.processedAt ? (
            <span className="inline-flex items-center gap-2">
              <ShieldCheck
                aria-hidden="true"
                className="size-3.5 text-[var(--color-success)]"
              />
              Processed{" "}
              {formatDateTime(
                refund.processedAt
              )}
            </span>
          ) : null}

          {refund.transactionReference ? (
            <span className="font-mono">
              Ref{" "}
              {refund.transactionReference}
            </span>
          ) : null}
        </div>

        <div className="flex justify-end border-t border-border pt-5">
          <Button
            variant="outline"
            onClick={() =>
              onOpen(refund)
            }
          >
            View Refund
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
