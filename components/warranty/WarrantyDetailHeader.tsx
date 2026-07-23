import Image from "next/image";
import {
  CalendarDays,
  ReceiptText,
  ShieldCheck,
  Store,
  UserRound,
} from "lucide-react";

import {
  WarrantyStatusBadge,
} from "@/components/warranty/WarrantyStatusBadge";
import {
  Badge,
} from "@/components/ui/Badge";
import {
  Price,
} from "@/components/ui/Price";
import {
  formatDate,
} from "@/lib/date";
import {
  cn,
} from "@/lib/utils";
import type {
  ProductWarranty,
} from "@/types/warranty";

interface WarrantyDetailHeaderProps {
  readonly warranty: ProductWarranty;
  readonly className?: string;
}

export function WarrantyDetailHeader({
  className,
  warranty,
}: WarrantyDetailHeaderProps): React.JSX.Element {
  const expiryTimestamp =
    new Date(
      warranty.expiresAt
    ).getTime();

  const daysRemaining =
    Math.max(
      Math.ceil(
        (expiryTimestamp -
          Date.now()) /
          86_400_000
      ),
      0
    );

  const expiringSoon =
    daysRemaining > 0 &&
    daysRemaining <= 30;

  return (
    <header
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border bg-card shadow-[var(--shadow-hover)]",
        warranty.status === "void"
          ? "border-[color:rgb(145_59_59_/_0.42)]"
          : "border-[color:rgb(200_169_106_/_0.32)]",
        className
      )}
    >
      <div className="relative overflow-hidden bg-[var(--color-black-900)] px-6 py-10 text-white md:px-10">
        <div
          aria-hidden={true}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(200,169,106,0.36),transparent_44%)]"
        />

        <div className="relative z-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_350px]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <WarrantyStatusBadge
                status={
                  warranty.status
                }
              />

              <Badge variant="neutral">
                {
                  warranty.durationMonths
                }{" "}
                months
              </Badge>

              {warranty.transferable ? (
                <Badge variant="gold">
                  Transferable
                </Badge>
              ) : null}

              {warranty.registrationRequired ? (
                <Badge
                  variant={
                    warranty.registeredAt
                      ? "success"
                      : "warning"
                  }
                >
                  {warranty.registeredAt
                    ? "Registered"
                    : "Registration Required"}
                </Badge>
              ) : null}
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-500)]">
              Sidra Product Protection
            </p>

            <h1 className="mt-3 font-heading text-[clamp(2.8rem,6vw,5.6rem)] font-medium leading-[0.92] tracking-[-0.055em]">
              #
              {
                warranty.warrantyNumber
              }
            </h1>

            <h2 className="mt-6 max-w-3xl font-heading text-3xl font-medium tracking-[-0.035em]">
              {
                warranty.product
                  .productTitle
              }
            </h2>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/60">
              <span className="inline-flex items-center gap-2">
                <ReceiptText
                  aria-hidden={true}
                  className="size-4"
                />
                Order #
                {
                  warranty.product
                    .orderNumber
                }
              </span>

              <span className="inline-flex items-center gap-2">
                <Store
                  aria-hidden={true}
                  className="size-4"
                />
                {
                  warranty.product
                    .studioName
                }
              </span>

              <span className="inline-flex items-center gap-2">
                <UserRound
                  aria-hidden={true}
                  className="size-4"
                />
                {
                  warranty.owner
                    .customerEmail
                }
              </span>

              <span className="inline-flex items-center gap-2">
                <CalendarDays
                  aria-hidden={true}
                  className="size-4"
                />
                Expires{" "}
                {formatDate(
                  warranty.expiresAt
                )}
              </span>
            </div>
          </div>

          <section className="rounded-[var(--radius-xl)] border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-md)] border border-white/15 bg-white/10">
              {warranty.product
                .productImageURL ? (
                <Image
                  src={
                    warranty.product
                      .productImageURL
                  }
                  alt={
                    warranty.product
                      .productTitle
                  }
                  fill
                  sizes="350px"
                  className="object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center">
                  <ShieldCheck
                    aria-hidden={true}
                    className="size-12 text-[var(--color-gold-500)]"
                  />
                </div>
              )}
            </div>

            <div className="mt-5">
              <p className="text-xs uppercase tracking-[0.14em] text-white/50">
                Protected Value
              </p>

              <Price
                amount={
                  warranty.product
                    .purchaseValuePaise /
                  100
                }
                size="xl"
                className="mt-2 text-white"
              />
            </div>

            <div className="mt-5 border-t border-white/10 pt-5">
              <p className="text-xs uppercase tracking-[0.14em] text-white/50">
                Remaining Coverage
              </p>

              <p
                className={cn(
                  "mt-2 font-heading text-3xl font-medium",
                  expiringSoon
                    ? "text-[var(--color-warning)]"
                    : daysRemaining ===
                        0
                      ? "text-[var(--color-error)]"
                      : "text-white"
                )}
              >
                {daysRemaining > 0
                  ? `${daysRemaining.toLocaleString(
                      "en-IN"
                    )} days`
                  : "Expired"}
              </p>
            </div>
          </section>
        </div>
      </div>

      <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
          <p className="text-xs uppercase tracking-[0.13em] text-muted">
            Coverage Items
          </p>

          <p className="mt-3 font-heading text-3xl font-medium text-foreground">
            {
              warranty.coverage.filter(
                (coverage) =>
                  coverage.active
              ).length
            }
          </p>
        </article>

        <article className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
          <p className="text-xs uppercase tracking-[0.13em] text-muted">
            Claims Used
          </p>

          <p className="mt-3 font-heading text-3xl font-medium text-foreground">
            {warranty.claimCount}
            {typeof warranty.maximumClaimCount ===
            "number"
              ? ` / ${warranty.maximumClaimCount}`
              : ""}
          </p>
        </article>

        <article className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
          <p className="text-xs uppercase tracking-[0.13em] text-muted">
            Coverage Starts
          </p>

          <p className="mt-3 text-sm font-medium text-foreground">
            {formatDate(
              warranty.startsAt
            )}
          </p>
        </article>

        <article className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
          <p className="text-xs uppercase tracking-[0.13em] text-muted">
            Terms Version
          </p>

          <p className="mt-3 font-mono text-sm font-medium text-foreground">
            {
              warranty.termsVersion
            }
          </p>
        </article>
      </div>
    </header>
  );
}
