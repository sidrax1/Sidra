import {
  BadgeCheck,
  CalendarCheck,
  Hash,
  ShieldAlert,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/Badge";
import {
  formatDateTime,
} from "@/lib/date";
import {
  cn,
} from "@/lib/utils";
import type {
  ProductWarranty,
} from "@/types/warranty";

interface WarrantyRegistrationStatusCardProps {
  readonly warranty: ProductWarranty;
  readonly className?: string;
}

export function WarrantyRegistrationStatusCard({
  className,
  warranty,
}: WarrantyRegistrationStatusCardProps): React.JSX.Element {
  const registered =
    Boolean(
      warranty.registeredAt
    );

  const registrationNeeded =
    warranty.registrationRequired &&
    !registered;

  return (
    <section
      className={cn(
        "rounded-[var(--radius-xl)] border bg-card p-6 shadow-[var(--shadow-card)]",
        registrationNeeded
          ? "border-[color:rgb(173_118_38_/_0.36)]"
          : "border-border",
        className
      )}
    >
      <div className="flex items-start justify-between gap-5">
        <span
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-full border",
            registered
              ? "border-[color:rgb(62_107_82_/_0.3)] bg-[color:rgb(62_107_82_/_0.07)] text-[var(--color-success)]"
              : "border-[color:rgb(173_118_38_/_0.3)] bg-[color:rgb(173_118_38_/_0.07)] text-[var(--color-warning)]"
          )}
        >
          {registered ? (
            <BadgeCheck
              aria-hidden={true}
              className="size-5"
            />
          ) : (
            <ShieldAlert
              aria-hidden={true}
              className="size-5"
            />
          )}
        </span>

        <Badge
          variant={
            registered
              ? "success"
              : registrationNeeded
                ? "warning"
                : "neutral"
          }
        >
          {registered
            ? "Registered"
            : registrationNeeded
              ? "Action Required"
              : "Not Required"}
        </Badge>
      </div>

      <h2 className="mt-5 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
        Warranty Registration
      </h2>

      <p className="mt-3 text-sm leading-7 text-muted">
        {registered
          ? "Product ownership and registration details have been verified."
          : registrationNeeded
            ? "Register this product before submitting warranty claims."
            : "This warranty does not require a separate registration step."}
      </p>

      <dl className="mt-6 grid gap-4 border-t border-border pt-5">
        {warranty.product
          .serialNumber ? (
          <div className="flex items-start justify-between gap-5">
            <dt className="inline-flex items-center gap-2 text-sm text-muted">
              <Hash
                aria-hidden={true}
                className="size-4 text-[var(--color-gold-600)]"
              />
              Serial Number
            </dt>

            <dd className="break-all text-right font-mono text-xs font-medium text-foreground">
              {
                warranty.product
                  .serialNumber
              }
            </dd>
          </div>
        ) : null}

        {warranty.registrationReference ? (
          <div className="flex items-start justify-between gap-5">
            <dt className="text-sm text-muted">
              Registration Reference
            </dt>

            <dd className="break-all text-right font-mono text-xs font-medium text-foreground">
              {
                warranty.registrationReference
              }
            </dd>
          </div>
        ) : null}

        {warranty.registeredAt ? (
          <div className="flex items-start justify-between gap-5">
            <dt className="inline-flex items-center gap-2 text-sm text-muted">
              <CalendarCheck
                aria-hidden={true}
                className="size-4 text-[var(--color-success)]"
              />
              Registered At
            </dt>

            <dd className="text-right text-sm font-medium text-foreground">
              {formatDateTime(
                warranty.registeredAt
              )}
            </dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}
