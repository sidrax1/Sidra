"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  CalendarDays,
  MoreVertical,
  ReceiptText,
  ShieldCheck,
  Store,
} from "lucide-react";

import { WarrantyStatusBadge } from "@/components/warranty/WarrantyStatusBadge";
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
import {
  formatDate,
  formatDateTime,
} from "@/lib/date";
import { cn } from "@/lib/utils";
import type {
  ProductWarranty,
} from "@/types/warranty";

interface WarrantyCardProps {
  readonly warranty: ProductWarranty;
  readonly loading?: boolean;
  readonly className?: string;
  readonly onOpen: (
    warranty: ProductWarranty
  ) => void;
  readonly onRegister?: (
    warranty: ProductWarranty
  ) => void;
  readonly onCreateClaim?: (
    warranty: ProductWarranty
  ) => void;
  readonly onTransfer?: (
    warranty: ProductWarranty
  ) => void;
  readonly onVoid?: (
    warranty: ProductWarranty
  ) => void;
}

export function WarrantyCard({
  className,
  loading = false,
  onCreateClaim,
  onOpen,
  onRegister,
  onTransfer,
  onVoid,
  warranty,
}: WarrantyCardProps): React.JSX.Element {
  const expired =
    new Date(
      warranty.expiresAt
    ).getTime() <= Date.now();

  const claimEligible =
    warranty.status === "active" &&
    !expired &&
    (!warranty.registrationRequired ||
      Boolean(
        warranty.registeredAt
      ));

  const daysRemaining =
    Math.max(
      Math.ceil(
        (new Date(
          warranty.expiresAt
        ).getTime() -
          Date.now()) /
          (24 * 60 * 60 * 1000)
      ),
      0
    );

  return (
    <Card
      className={cn(
        "overflow-hidden transition-[transform,border-color,box-shadow]",
        "hover:-translate-y-0.5 hover:border-[color:rgb(200_169_106_/_0.4)]",
        "hover:shadow-[var(--shadow-hover)]",
        expired &&
          "border-[color:rgb(145_59_59_/_0.28)]",
        className
      )}
    >
      <header className="flex items-start justify-between gap-5 border-b border-border bg-[color:rgb(200_169_106_/_0.05)] p-5">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <WarrantyStatusBadge
              status={warranty.status}
            />

            <Badge variant="neutral">
              #{warranty.warrantyNumber}
            </Badge>

            {warranty.registrationRequired &&
            !warranty.registeredAt ? (
              <Badge variant="warning">
                Registration Required
              </Badge>
            ) : null}
          </div>

          <p className="mt-4 text-xs uppercase tracking-[0.15em] text-muted">
            Product Protection
          </p>

          <h2 className="mt-2 font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
            {warranty.product.productTitle}
          </h2>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton
              label="Warranty actions"
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
                onOpen(warranty)
              }
            >
              Open warranty
            </DropdownMenuItem>

            {warranty.registrationRequired &&
            !warranty.registeredAt &&
            onRegister ? (
              <DropdownMenuItem
                onSelect={() =>
                  onRegister(
                    warranty
                  )
                }
              >
                Register warranty
              </DropdownMenuItem>
            ) : null}

            {claimEligible &&
            onCreateClaim ? (
              <DropdownMenuItem
                onSelect={() =>
                  onCreateClaim(
                    warranty
                  )
                }
              >
                Create claim
              </DropdownMenuItem>
            ) : null}

            {warranty.transferable &&
            warranty.status === "active" &&
            onTransfer ? (
              <DropdownMenuItem
                onSelect={() =>
                  onTransfer(
                    warranty
                  )
                }
              >
                Transfer warranty
              </DropdownMenuItem>
            ) : null}

            {warranty.status !== "void" &&
            onVoid ? (
              <DropdownMenuItem
                destructive
                onSelect={() =>
                  onVoid(warranty)
                }
              >
                Void warranty
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="grid gap-5 p-5">
        <div className="grid gap-4 sm:grid-cols-[112px_minmax(0,1fr)]">
          <div className="relative aspect-square overflow-hidden rounded-[var(--radius-md)] border border-border bg-background">
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
                sizes="112px"
                className="object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center">
                <ShieldCheck
                  aria-hidden={true}
                  className="size-9 text-[var(--color-gold-600)]"
                />
              </div>
            )}
          </div>

          <div>
            {warranty.product
              .variantTitle ? (
              <p className="text-xs text-muted">
                {
                  warranty.product
                    .variantTitle
                }
              </p>
            ) : null}

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
              <span className="inline-flex items-center gap-2">
                <ReceiptText
                  aria-hidden={true}
                  className="size-3.5 text-[var(--color-gold-600)]"
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
                  className="size-3.5 text-[var(--color-gold-600)]"
                />
                {
                  warranty.product
                    .studioName
                }
              </span>
            </div>

            <div className="mt-4">
              <Price
                amount={
                  warranty.product
                    .purchaseValuePaise /
                  100
                }
                size="lg"
              />
            </div>
          </div>
        </div>

        <dl className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
            <dt className="text-xs uppercase tracking-[0.13em] text-muted">
              Coverage Start
            </dt>

            <dd className="mt-2 text-sm font-medium text-foreground">
              {formatDate(
                warranty.startsAt
              )}
            </dd>
          </div>

          <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
            <dt className="text-xs uppercase tracking-[0.13em] text-muted">
              Coverage End
            </dt>

            <dd className="mt-2 text-sm font-medium text-foreground">
              {formatDate(
                warranty.expiresAt
              )}
            </dd>
          </div>

          <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
            <dt className="text-xs uppercase tracking-[0.13em] text-muted">
              Remaining
            </dt>

            <dd
              className={cn(
                "mt-2 text-sm font-medium",
                daysRemaining > 30
                  ? "text-foreground"
                  : daysRemaining > 0
                    ? "text-[var(--color-warning)]"
                    : "text-[var(--color-error)]"
              )}
            >
              {daysRemaining > 0
                ? `${daysRemaining.toLocaleString(
                    "en-IN"
                  )} days`
                : "Expired"}
            </dd>
          </div>
        </dl>

        <div className="flex flex-wrap gap-x-5 gap-y-3 text-xs text-muted">
          <span className="inline-flex items-center gap-2">
            <ShieldCheck
              aria-hidden={true}
              className="size-3.5 text-[var(--color-success)]"
            />
            {
              warranty.coverage.length
            }{" "}
            coverage items
          </span>

          <span className="inline-flex items-center gap-2">
            <CalendarDays
              aria-hidden={true}
              className="size-3.5 text-[var(--color-gold-600)]"
            />
            Issued{" "}
            {formatDateTime(
              warranty.createdAt
            )}
          </span>

          <span>
            Claims used:{" "}
            {warranty.claimCount}
            {typeof warranty.maximumClaimCount ===
            "number"
              ? ` / ${warranty.maximumClaimCount}`
              : ""}
          </span>
        </div>

        <div className="flex justify-end border-t border-border pt-5">
          <Button
            variant="outline"
            onClick={() =>
              onOpen(warranty)
            }
          >
            View Warranty
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
