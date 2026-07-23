import {
  BadgeIndianRupee,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Price } from "@/components/ui/Price";
import { cn } from "@/lib/utils";
import type {
  WarrantyCoverageItem,
} from "@/types/warranty";

interface WarrantyCoverageCardProps {
  readonly coverage: WarrantyCoverageItem;
  readonly claimCount?: number;
  readonly className?: string;
}

export function WarrantyCoverageCard({
  claimCount = 0,
  className,
  coverage,
}: WarrantyCoverageCardProps): React.JSX.Element {
  const remainingClaims =
    typeof coverage.maximumClaims ===
    "number"
      ? Math.max(
          coverage.maximumClaims -
            claimCount,
          0
        )
      : null;

  return (
    <article
      className={cn(
        "rounded-[var(--radius-lg)] border border-border bg-card p-5",
        "shadow-[var(--shadow-card)] transition-[transform,border-color,box-shadow]",
        "hover:-translate-y-0.5 hover:border-[color:rgb(200_169_106_/_0.38)]",
        "hover:shadow-[var(--shadow-hover)]",
        !coverage.active &&
          "opacity-65",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.07)] text-[var(--color-gold-600)]">
          <ShieldCheck
            aria-hidden="true"
            className="size-5"
          />
        </span>

        <Badge
          variant={
            coverage.active
              ? "success"
              : "neutral"
          }
        >
          {coverage.active
            ? "Covered"
            : "Inactive"}
        </Badge>
      </div>

      <h3 className="mt-5 font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
        {coverage.title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-muted">
        {coverage.description}
      </p>

      <dl className="mt-5 grid gap-3 border-t border-border pt-5 text-sm">
        {typeof coverage.maximumCoveragePaise ===
        "number" ? (
          <div className="flex items-center justify-between gap-4">
            <dt className="inline-flex items-center gap-2 text-muted">
              <BadgeIndianRupee
                aria-hidden="true"
                className="size-4"
              />
              Maximum Coverage
            </dt>

            <dd>
              <Price
                amount={
                  coverage.maximumCoveragePaise /
                  100
                }
                size="sm"
              />
            </dd>
          </div>
        ) : null}

        {typeof coverage.deductiblePaise ===
        "number" ? (
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted">
              Deductible
            </dt>

            <dd>
              <Price
                amount={
                  coverage.deductiblePaise /
                  100
                }
                size="sm"
              />
            </dd>
          </div>
        ) : null}

        {remainingClaims !== null ? (
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted">
              Claims Remaining
            </dt>

            <dd className="inline-flex items-center gap-2 font-medium text-foreground">
              <CheckCircle2
                aria-hidden="true"
                className="size-4 text-[var(--color-success)]"
              />
              {remainingClaims}
            </dd>
          </div>
        ) : null}
      </dl>
    </article>
  );
}
