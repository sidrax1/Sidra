import Image from "next/image";
import {
  CalendarClock,
  ReceiptText,
  ShieldCheck,
  Store,
  UserRound,
  Wrench,
} from "lucide-react";

import {
  WarrantyClaimPriorityBadge,
} from "@/components/warranty/WarrantyClaimPriorityBadge";
import {
  WarrantyClaimStatusBadge,
} from "@/components/warranty/WarrantyClaimStatusBadge";
import {
  Badge,
} from "@/components/ui/Badge";
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
  WarrantyClaim,
} from "@/types/warranty";

interface WarrantyClaimDetailHeaderProps {
  readonly claim: WarrantyClaim;
  readonly className?: string;
}

export function WarrantyClaimDetailHeader({
  claim,
  className,
}: WarrantyClaimDetailHeaderProps): React.JSX.Element {
  const urgent =
    claim.priority === "urgent";

  const approvedCoveragePaise =
    claim.assessment
      ?.approvedCoveragePaise ??
    0;

  return (
    <header
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border bg-card shadow-[var(--shadow-hover)]",
        urgent
          ? "border-[color:rgb(145_59_59_/_0.44)]"
          : "border-[color:rgb(200_169_106_/_0.32)]",
        className
      )}
    >
      <div className="relative overflow-hidden bg-[var(--color-black-900)] px-6 py-10 text-white md:px-10">
        <div
          aria-hidden={true}
          className="pointer-events-none absolute inset-0"
          style={{
            background: urgent
              ? "radial-gradient(circle at 86% 8%, rgba(145,59,59,0.38), transparent 44%)"
              : "radial-gradient(circle at 86% 8%, rgba(200,169,106,0.35), transparent 44%)",
          }}
        />

        <div className="relative z-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <WarrantyClaimStatusBadge
                status={claim.status}
              />

              <WarrantyClaimPriorityBadge
                priority={
                  claim.priority
                }
              />

              {claim.assessment ? (
                <Badge
                  variant={
                    claim.assessment
                      .covered
                      ? "success"
                      : "error"
                  }
                >
                  <ShieldCheck
                    aria-hidden={true}
                    className="mr-1 size-3.5"
                  />
                  {claim.assessment
                    .covered
                    ? "Covered"
                    : "Not Covered"}
                </Badge>
              ) : null}
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-500)]">
              Warranty Claim
            </p>

            <h1 className="mt-3 font-heading text-[clamp(2.8rem,6vw,5.5rem)] font-medium leading-[0.92] tracking-[-0.055em]">
              #{claim.claimNumber}
            </h1>

            <h2 className="mt-6 max-w-3xl font-heading text-3xl font-medium tracking-[-0.035em] text-white">
              {claim.issueTitle}
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/65">
              {claim.issueDescription}
            </p>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/60">
              <span className="inline-flex items-center gap-2">
                <ReceiptText
                  aria-hidden={true}
                  className="size-4"
                />
                Warranty #
                {claim.warrantyNumber}
              </span>

              <span className="inline-flex items-center gap-2">
                <Store
                  aria-hidden={true}
                  className="size-4"
                />
                {
                  claim.product
                    .studioName
                }
              </span>

              <span className="inline-flex items-center gap-2">
                <UserRound
                  aria-hidden={true}
                  className="size-4"
                />
                Customer{" "}
                {claim.customerId}
              </span>

              <span className="inline-flex items-center gap-2">
                <CalendarClock
                  aria-hidden={true}
                  className="size-4"
                />
                Due{" "}
                {formatDateTime(
                  claim.responseDueAt
                )}
              </span>
            </div>
          </div>

          <section className="rounded-[var(--radius-xl)] border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-md)] border border-white/15 bg-white/10">
              {claim.product
                .productImageURL ? (
                <Image
                  src={
                    claim.product
                      .productImageURL
                  }
                  alt={
                    claim.product
                      .productTitle
                  }
                  fill
                  sizes="340px"
                  className="object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center">
                  <Wrench
                    aria-hidden={true}
                    className="size-11 text-[var(--color-gold-500)]"
                  />
                </div>
              )}
            </div>

            <h3 className="mt-5 font-heading text-2xl font-medium tracking-[-0.025em]">
              {
                claim.product
                  .productTitle
              }
            </h3>

            {claim.product
              .variantTitle ? (
              <p className="mt-1 text-xs text-white/55">
                {
                  claim.product
                    .variantTitle
                }
              </p>
            ) : null}

            <dl className="mt-5 grid gap-4 border-t border-white/10 pt-5">
              <div className="flex items-end justify-between gap-4">
                <dt className="text-xs uppercase tracking-[0.14em] text-white/50">
                  Purchase Value
                </dt>

                <dd>
                  <Price
                    amount={
                      claim.product
                        .purchaseValuePaise /
                      100
                    }
                    size="lg"
                    className="text-white"
                  />
                </dd>
              </div>

              <div className="flex items-end justify-between gap-4">
                <dt className="text-xs uppercase tracking-[0.14em] text-white/50">
                  Approved Coverage
                </dt>

                <dd>
                  <Price
                    amount={
                      approvedCoveragePaise /
                      100
                    }
                    size="lg"
                    className="text-white"
                  />
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </header>
  );
}
