import {
  CalendarDays,
  Gem,
  ImageIcon,
  Package,
} from "lucide-react";

import { CustomOrderStatusBadge } from "@/components/custom-orders/CustomOrderStatusBadge";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/currency";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { CustomOrder } from "@/types/custom-order";

interface CustomOrderDetailsHeaderProps {
  readonly customOrder: CustomOrder;
  readonly referenceNumber?: string;
  readonly className?: string;
}

function resolveBudget(
  minimumPaise?: number,
  maximumPaise?: number
): string {
  if (
    typeof minimumPaise === "number" &&
    typeof maximumPaise === "number"
  ) {
    return `${formatCurrency(minimumPaise / 100)} – ${formatCurrency(
      maximumPaise / 100
    )}`;
  }

  if (typeof maximumPaise === "number") {
    return `Up to ${formatCurrency(maximumPaise / 100)}`;
  }

  if (typeof minimumPaise === "number") {
    return `From ${formatCurrency(minimumPaise / 100)}`;
  }

  return "Open consultation";
}

export function CustomOrderDetailsHeader({
  className,
  customOrder,
  referenceNumber,
}: CustomOrderDetailsHeaderProps): React.JSX.Element {
  const attachmentCount =
    customOrder.attachmentPaths?.length ?? 0;

  return (
    <header
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border",
        "border-[color:rgb(200_169_106_/_0.3)] bg-card",
        "shadow-[var(--shadow-hover)]",
        className
      )}
    >
      <div className="relative overflow-hidden bg-[var(--color-black-900)] px-6 py-9 text-white md:px-10 md:py-12">
        <div
          aria-hidden={true}
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 85% 10%, rgba(200,169,106,0.28), transparent 40%)",
          }}
        />

        <div className="relative z-10 flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-5">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.42)] bg-[color:rgb(200_169_106_/_0.12)] text-[var(--color-gold-500)] shadow-[var(--shadow-gold-glow)]">
              <Gem aria-hidden={true} className="size-6" />
            </span>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-500)]">
                  Private Commission
                </p>

                <CustomOrderStatusBadge
                  status={customOrder.status}
                />
              </div>

              <h1 className="mt-5 max-w-4xl font-heading text-[clamp(2.8rem,6vw,5.7rem)] font-medium leading-[0.92] tracking-[-0.055em]">
                {customOrder.title}
              </h1>

              {referenceNumber ? (
                <p className="mt-4 text-sm text-white/55">
                  Reference {referenceNumber}
                </p>
              ) : null}
            </div>
          </div>

          <div className="shrink-0 rounded-[var(--radius-lg)] border border-white/15 bg-white/10 px-6 py-5 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.16em] text-white/55">
              Preferred Budget
            </p>

            <p className="mt-2 font-heading text-2xl font-medium">
              {resolveBudget(
                customOrder.budgetMinimumPaise,
                customOrder.budgetMaximumPaise
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-7 p-6 md:p-10">
        <p className="max-w-4xl whitespace-pre-wrap text-base leading-8 text-muted">
          {customOrder.description}
        </p>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted">
              <Package
                aria-hidden={true}
                className="size-3.5 text-[var(--color-gold-600)]"
              />
              Quantity
            </p>

            <p className="mt-2 font-medium text-foreground">
              {customOrder.quantity.toLocaleString("en-IN")}{" "}
              {customOrder.quantity === 1 ? "piece" : "pieces"}
            </p>
          </div>

          <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted">
              <CalendarDays
                aria-hidden={true}
                className="size-3.5 text-[var(--color-gold-600)]"
              />
              Submitted
            </p>

            <p className="mt-2 font-medium text-foreground">
              {formatDate(customOrder.createdAt)}
            </p>
          </div>

          <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted">
              <CalendarDays
                aria-hidden={true}
                className="size-3.5 text-[var(--color-gold-600)]"
              />
              Required By
            </p>

            <p className="mt-2 font-medium text-foreground">
              {customOrder.requiredBy
                ? formatDate(customOrder.requiredBy)
                : "Flexible timeline"}
            </p>
          </div>

          <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted">
              <ImageIcon
                aria-hidden={true}
                className="size-3.5 text-[var(--color-gold-600)]"
              />
              References
            </p>

            <p className="mt-2 font-medium text-foreground">
              {attachmentCount.toLocaleString("en-IN")}{" "}
              {attachmentCount === 1 ? "file" : "files"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-border pt-5">
          <Badge variant="neutral">
            Category: {customOrder.categoryId}
          </Badge>

          {customOrder.studioId ? (
            <Badge variant="gold">
              Studio assigned
            </Badge>
          ) : (
            <Badge variant="warning">
              Assignment pending
            </Badge>
          )}
        </div>
      </div>
    </header>
  );
}
