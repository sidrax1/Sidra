"use client";

import {
  CalendarDays,
  Copy,
  Gift,
  MoreVertical,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";

import { LoyaltyRedemptionStatusBadge } from "@/components/loyalty/LoyaltyRedemptionStatusBadge";
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
import { formatDateTime } from "@/lib/date";
import { cn } from "@/lib/utils";
import type {
  LoyaltyRedemption,
} from "@/types/loyalty";

interface LoyaltyRedemptionCardProps {
  readonly redemption: LoyaltyRedemption;
  readonly loading?: boolean;
  readonly className?: string;
  readonly onCancel?: (
    redemption: LoyaltyRedemption
  ) => void;
  readonly onViewOrder?: (
    orderId: string
  ) => void;
}

export function LoyaltyRedemptionCard({
  className,
  loading = false,
  onCancel,
  onViewOrder,
  redemption,
}: LoyaltyRedemptionCardProps): React.JSX.Element {
  const cancellable =
    redemption.status === "pending" ||
    redemption.status === "issued";

  return (
    <Card
      className={cn(
        "overflow-hidden transition-[transform,border-color,box-shadow]",
        "hover:-translate-y-0.5 hover:border-[color:rgb(200_169_106_/_0.4)]",
        "hover:shadow-[var(--shadow-hover)]",
        className
      )}
    >
      <header className="flex items-start justify-between gap-5 border-b border-border bg-[color:rgb(200_169_106_/_0.05)] p-5">
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-card text-[var(--color-gold-600)]">
            <Gift
              aria-hidden="true"
              className="size-5"
            />
          </span>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <LoyaltyRedemptionStatusBadge
                status={redemption.status}
              />

              <Badge variant="neutral">
                #{redemption.redemptionNumber}
              </Badge>
            </div>

            <h2 className="mt-4 font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
              {redemption.rewardName}
            </h2>
          </div>
        </div>

        {(onCancel || onViewOrder) ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton
                label="Redemption actions"
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
              {redemption.appliedOrderId &&
              onViewOrder ? (
                <DropdownMenuItem
                  onSelect={() =>
                    onViewOrder(
                      redemption.appliedOrderId as string
                    )
                  }
                >
                  View applied order
                </DropdownMenuItem>
              ) : null}

              {cancellable && onCancel ? (
                <DropdownMenuItem
                  destructive
                  onSelect={() =>
                    onCancel(redemption)
                  }
                >
                  Cancel redemption
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </header>

      <div className="grid gap-5 p-5">
        <dl className="grid gap-3 rounded-[var(--radius-md)] border border-border bg-background p-4 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted">
              Points spent
            </dt>

            <dd className="font-heading text-2xl font-medium text-foreground">
              {redemption.pointsSpent.toLocaleString(
                "en-IN"
              )}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted">
              Reward type
            </dt>

            <dd className="capitalize text-foreground">
              {redemption.rewardType.replace(
                /([A-Z])/g,
                " $1"
              )}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-4">
            <dt className="inline-flex items-center gap-2 text-muted">
              <CalendarDays
                aria-hidden="true"
                className="size-3.5"
              />
              Expires
            </dt>

            <dd className="text-right font-medium text-foreground">
              {formatDateTime(
                redemption.expiresAt
              )}
            </dd>
          </div>
        </dl>

        {redemption.issuedCode ? (
          <div className="rounded-[var(--radius-md)] border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.06)] p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-muted">
                  Reward Code
                </p>

                <p className="mt-2 font-mono text-lg font-semibold text-foreground">
                  {redemption.issuedCode}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={loading}
                onClick={() => {
                  void navigator.clipboard.writeText(
                    redemption.issuedCode ?? ""
                  );
                }}
              >
                <Copy
                  aria-hidden="true"
                  className="size-4"
                />
                Copy Code
              </Button>
            </div>
          </div>
        ) : null}

        {redemption.appliedOrderId ? (
          <p className="inline-flex items-center gap-2 text-xs text-muted">
            <ReceiptText
              aria-hidden="true"
              className="size-3.5 text-[var(--color-gold-600)]"
            />
            Applied to order {redemption.appliedOrderId}
          </p>
        ) : null}

        <p className="inline-flex items-center gap-2 border-t border-border pt-4 text-xs text-muted">
          <ShieldCheck
            aria-hidden="true"
            className="size-3.5 text-[var(--color-success)]"
          />
          Issued rewards are protected by server-side redemption
          controls.
        </p>
      </div>
    </Card>
  );
}
