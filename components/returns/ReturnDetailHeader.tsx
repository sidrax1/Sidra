import Image from "next/image";
import {
  CalendarClock,
  PackageCheck,
  ReceiptText,
  ShieldCheck,
  Store,
  UserRound,
} from "lucide-react";

import { ReturnInspectionStatusBadge } from "@/components/returns/ReturnInspectionStatusBadge";
import { ReturnPickupStatusBadge } from "@/components/returns/ReturnPickupStatusBadge";
import { ReturnReasonBadge } from "@/components/returns/ReturnReasonBadge";
import { ReturnStatusBadge } from "@/components/returns/ReturnStatusBadge";
import { Badge } from "@/components/ui/Badge";
import { Price } from "@/components/ui/Price";
import { formatDateTime } from "@/lib/date";
import { cn } from "@/lib/utils";
import type {
  ReturnRequest,
} from "@/types/return";

interface ReturnDetailHeaderProps {
  readonly returnRequest: ReturnRequest;
  readonly className?: string;
}

export function ReturnDetailHeader({
  className,
  returnRequest,
}: ReturnDetailHeaderProps): React.JSX.Element {
  const urgent =
    returnRequest.priority ===
    "urgent";

  return (
    <header
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border bg-card shadow-[var(--shadow-hover)]",
        urgent
          ? "border-[color:rgb(145_59_59_/_0.42)]"
          : "border-[color:rgb(200_169_106_/_0.3)]",
        className
      )}
    >
      <div className="relative overflow-hidden bg-[var(--color-black-900)] px-6 py-10 text-white md:px-10">
        <div
          aria-hidden={true}
          className="pointer-events-none absolute inset-0"
          style={{
            background: urgent
              ? "radial-gradient(circle at 84% 10%, rgba(145,59,59,0.35), transparent 44%)"
              : "radial-gradient(circle at 84% 10%, rgba(200,169,106,0.34), transparent 44%)",
          }}
        />

        <div className="relative z-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_330px]">
          <div>
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
                }{" "}
                priority
              </Badge>
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-500)]">
              Protected Product Return
            </p>

            <h1 className="mt-3 font-heading text-[clamp(3rem,7vw,6rem)] font-medium leading-[0.9] tracking-[-0.055em]">
              #
              {
                returnRequest.returnNumber
              }
            </h1>

            <p className="mt-6 max-w-3xl text-sm leading-7 text-white/65">
              {
                returnRequest.description
              }
            </p>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/60">
              <span className="inline-flex items-center gap-2">
                <ReceiptText
                  aria-hidden={true}
                  className="size-4"
                />
                Order #
                {
                  returnRequest.orderNumber
                }
              </span>

              <span className="inline-flex items-center gap-2">
                <Store
                  aria-hidden={true}
                  className="size-4"
                />
                {
                  returnRequest.studioName
                }
              </span>

              <span className="inline-flex items-center gap-2">
                <UserRound
                  aria-hidden={true}
                  className="size-4"
                />
                {
                  returnRequest.customerEmail
                }
              </span>

              <span className="inline-flex items-center gap-2">
                <CalendarClock
                  aria-hidden={true}
                  className="size-4"
                />
                Due{" "}
                {formatDateTime(
                  returnRequest.responseDueAt
                )}
              </span>
            </div>
          </div>

          <div className="rounded-[var(--radius-xl)] border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
            <div className="grid gap-4 sm:grid-cols-[88px_minmax(0,1fr)] xl:grid-cols-1">
              <div className="relative aspect-square overflow-hidden rounded-[var(--radius-md)] border border-white/15 bg-white/10 xl:aspect-[16/10]">
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
                    sizes="330px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center">
                    <PackageCheck
                      aria-hidden={true}
                      className="size-10 text-[var(--color-gold-500)]"
                    />
                  </div>
                )}
              </div>

              <div>
                <h2 className="font-heading text-2xl font-medium tracking-[-0.025em]">
                  {
                    returnRequest.item
                      .productTitle
                  }
                </h2>

                {returnRequest.item
                  .variantTitle ? (
                  <p className="mt-1 text-xs text-white/55">
                    {
                      returnRequest.item
                        .variantTitle
                    }
                  </p>
                ) : null}

                <div className="mt-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-white/50">
                    Return Value
                  </p>

                  <Price
                    amount={
                      returnRequest
                        .financialSummary
                        .itemValuePaise /
                      100
                    }
                    size="xl"
                    className="mt-1 text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-6 md:grid-cols-3">
        <section className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-muted">
            Pickup
          </p>

          <div className="mt-3">
            <ReturnPickupStatusBadge
              status={
                returnRequest.pickup
                  .status
              }
            />
          </div>

          {returnRequest.pickup
            .trackingNumber ? (
            <p className="mt-3 font-mono text-xs text-muted">
              {
                returnRequest.pickup
                  .trackingNumber
              }
            </p>
          ) : null}
        </section>

        <section className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-muted">
            Inspection
          </p>

          <div className="mt-3">
            <ReturnInspectionStatusBadge
              status={
                returnRequest.inspection
                  .status
              }
            />
          </div>

          <p className="mt-3 text-xs text-muted">
            Accepted{" "}
            {
              returnRequest.inspection
                .acceptedQuantity
            }
            , rejected{" "}
            {
              returnRequest.inspection
                .rejectedQuantity
            }
          </p>
        </section>

        <section className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted">
            <ShieldCheck
              aria-hidden={true}
              className="size-3.5"
            />
            Final Refund
          </p>

          <Price
            amount={
              returnRequest
                .financialSummary
                .finalRefundPaise /
              100
            }
            size="xl"
            className="mt-3"
          />
        </section>
      </div>
    </header>
  );
}
