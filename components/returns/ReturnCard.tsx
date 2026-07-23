"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  CalendarClock,
  IndianRupee,
  MoreVertical,
  PackageCheck,
  ReceiptText,
  Store,
  Truck,
} from "lucide-react";

import {
  ReturnReasonBadge,
} from "@/components/returns/ReturnReasonBadge";
import {
  ReturnStatusBadge,
} from "@/components/returns/ReturnStatusBadge";
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
  ReturnRequest,
} from "@/types/return";

interface ReturnCardProps {
  readonly returnRequest: ReturnRequest;
  readonly loading?: boolean;
  readonly className?: string;
  readonly onOpen: (
    returnRequest: ReturnRequest
  ) => void;
  readonly onReview?: (
    returnRequest: ReturnRequest
  ) => void;
  readonly onSchedulePickup?: (
    returnRequest: ReturnRequest
  ) => void;
  readonly onInspect?: (
    returnRequest: ReturnRequest
  ) => void;
  readonly onCancel?: (
    returnRequest: ReturnRequest
  ) => void;
}

export function ReturnCard({
  className,
  loading = false,
  onCancel,
  onInspect,
  onOpen,
  onReview,
  onSchedulePickup,
  returnRequest,
}: ReturnCardProps): React.JSX.Element {
  const urgent =
    returnRequest.priority ===
    "urgent";

  const reviewable =
    returnRequest.status ===
      "requested" ||
    returnRequest.status ===
      "underReview";

  const pickupEligible =
    returnRequest.status ===
      "approved" &&
    returnRequest.pickup
      .required;

  const inspectionEligible =
    returnRequest.status ===
      "received" ||
    returnRequest.status ===
      "inspectionInProgress";

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
            <ReturnStatusBadge
              status={
                returnRequest.status
              }
            />

            <ReturnReasonBadge
              reason={
                returnRequest.reason
              }
            />

            <Badge
              variant={
                urgent
                  ? "error"
                  : returnRequest.priority ===
                      "high"
                    ? "warning"
                    : "neutral"
              }
            >
              {
                returnRequest.priority
              }
            </Badge>
          </div>

          <h2 className="mt-4 font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
            Return #
            {
              returnRequest.returnNumber
            }
          </h2>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
          >
            <IconButton
              label="Return actions"
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
                onOpen(
                  returnRequest
                )
              }
            >
              Open return
            </DropdownMenuItem>

            {reviewable &&
            onReview ? (
              <DropdownMenuItem
                onSelect={() =>
                  onReview(
                    returnRequest
                  )
                }
              >
                Review request
              </DropdownMenuItem>
            ) : null}

            {pickupEligible &&
            onSchedulePickup ? (
              <DropdownMenuItem
                onSelect={() =>
                  onSchedulePickup(
                    returnRequest
                  )
                }
              >
                Schedule pickup
              </DropdownMenuItem>
            ) : null}

            {inspectionEligible &&
            onInspect ? (
              <DropdownMenuItem
                onSelect={() =>
                  onInspect(
                    returnRequest
                  )
                }
              >
                Complete inspection
              </DropdownMenuItem>
            ) : null}

            {onCancel &&
            ![
              "completed",
              "cancelled",
              "rejected",
            ].includes(
              returnRequest.status
            ) ? (
              <DropdownMenuItem
                destructive
                onSelect={() =>
                  onCancel(
                    returnRequest
                  )
                }
              >
                Cancel return
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="grid gap-5 p-5">
        <div className="grid gap-4 sm:grid-cols-[104px_minmax(0,1fr)]">
          <div className="relative aspect-square overflow-hidden rounded-[var(--radius-md)] border border-border bg-background">
            {returnRequest.item
              .productImageURL ? (
              <Image
                src={
                  returnRequest.item
                    .productImageURL
                }
                alt={
                  returnRequest.item
                    .productTitle
                }
                fill
                sizes="104px"
                className="object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center">
                <PackageCheck
                  aria-hidden={true}
                  className="size-8 text-[var(--color-gold-600)]"
                />
              </div>
            )}
          </div>

          <div>
            <h3 className="font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
              {
                returnRequest.item
                  .productTitle
              }
            </h3>

            {returnRequest.item
              .variantTitle ? (
              <p className="mt-1 text-xs text-muted">
                {
                  returnRequest.item
                    .variantTitle
                }
              </p>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
              <span>
                Return quantity:{" "}
                <strong className="font-medium text-foreground">
                  {
                    returnRequest.item
                      .returnQuantity
                  }
                </strong>
              </span>

              <span>
                Ordered:{" "}
                {
                  returnRequest.item
                    .orderedQuantity
                }
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Customer Description
          </p>

          <p className="mt-2 line-clamp-3 text-sm leading-7 text-foreground">
            {
              returnRequest.description
            }
          </p>
        </div>

        <dl className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[var(--radius-md)] border border-border bg-card p-4">
            <dt className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.13em] text-muted">
              <IndianRupee
                aria-hidden={true}
                className="size-3.5"
              />
              Return Value
            </dt>

            <dd className="mt-2">
              <Price
                amount={
                  returnRequest
                    .financialSummary
                    .itemValuePaise /
                  100
                }
                size="lg"
              />
            </dd>
          </div>

          <div className="rounded-[var(--radius-md)] border border-border bg-card p-4">
            <dt className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.13em] text-muted">
              <CalendarClock
                aria-hidden={true}
                className="size-3.5"
              />
              Response Due
            </dt>

            <dd className="mt-2 text-sm font-medium text-foreground">
              {formatDateTime(
                returnRequest.responseDueAt
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
            Order #
            {
              returnRequest.orderNumber
            }
          </span>

          <span className="inline-flex items-center gap-2">
            <Store
              aria-hidden={true}
              className="size-3.5 text-[var(--color-gold-600)]"
            />
            {
              returnRequest.studioName
            }
          </span>

          {returnRequest.pickup
            .trackingNumber ? (
            <span className="inline-flex items-center gap-2">
              <Truck
                aria-hidden={true}
                className="size-3.5 text-[var(--color-gold-600)]"
              />
              {
                returnRequest.pickup
                  .trackingNumber
              }
            </span>
          ) : null}
        </div>

        <div className="flex justify-end border-t border-border pt-5">
          <Button
            variant="outline"
            onClick={() =>
              onOpen(
                returnRequest
              )
            }
          >
            View Return
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
