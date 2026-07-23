import {
  CalendarDays,
  Gem,
  Package,
  Store,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Surface } from "@/components/ui/Surface";
import { formatCurrency } from "@/lib/currency";
import { formatDate } from "@/lib/date";
import type { CustomOrder } from "@/types/custom-order";

interface CustomOrderSummaryAsideProps {
  readonly customOrder: CustomOrder;
  readonly studioName?: string;
}

function budgetLabel(
  customOrder: CustomOrder
): string {
  const minimum =
    customOrder.budgetMinimumPaise;

  const maximum =
    customOrder.budgetMaximumPaise;

  if (
    typeof minimum === "number" &&
    typeof maximum === "number"
  ) {
    return `${formatCurrency(
      minimum / 100
    )} – ${formatCurrency(
      maximum / 100
    )}`;
  }

  if (typeof maximum === "number") {
    return `Up to ${formatCurrency(
      maximum / 100
    )}`;
  }

  if (typeof minimum === "number") {
    return `From ${formatCurrency(
      minimum / 100
    )}`;
  }

  return "Open consultation";
}

export function CustomOrderSummaryAside({
  customOrder,
  studioName,
}: CustomOrderSummaryAsideProps): React.JSX.Element {
  return (
    <Surface className="grid gap-5">
      <header className="flex items-start gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.08)] text-[var(--color-gold-600)]">
          <Gem
            aria-hidden={true}
            className="size-5"
          />
        </span>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-gold-600)]">
            Commission Summary
          </p>

          <h2 className="mt-2 font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
            {customOrder.title}
          </h2>
        </div>
      </header>

      <dl className="grid gap-4 border-t border-border pt-5 text-sm">
        <div className="flex items-start justify-between gap-5">
          <dt className="inline-flex items-center gap-2 text-muted">
            <Package
              aria-hidden={true}
              className="size-4"
            />
            Quantity
          </dt>

          <dd className="font-medium text-foreground">
            {customOrder.quantity.toLocaleString(
              "en-IN"
            )}
          </dd>
        </div>

        <div className="flex items-start justify-between gap-5">
          <dt className="inline-flex items-center gap-2 text-muted">
            <CalendarDays
              aria-hidden={true}
              className="size-4"
            />
            Required by
          </dt>

          <dd className="text-right font-medium text-foreground">
            {customOrder.requiredBy
              ? formatDate(
                  customOrder.requiredBy
                )
              : "Flexible"}
          </dd>
        </div>

        <div className="flex items-start justify-between gap-5">
          <dt className="inline-flex items-center gap-2 text-muted">
            <Store
              aria-hidden={true}
              className="size-4"
            />
            Studio
          </dt>

          <dd className="text-right font-medium text-foreground">
            {studioName ??
              "Assignment pending"}
          </dd>
        </div>

        <div className="flex items-start justify-between gap-5">
          <dt className="text-muted">
            Preferred budget
          </dt>

          <dd className="text-right font-medium text-foreground">
            {budgetLabel(customOrder)}
          </dd>
        </div>
      </dl>

      <div className="flex flex-wrap gap-2 border-t border-border pt-5">
        <Badge variant="neutral">
          {customOrder.categoryId}
        </Badge>

        <Badge variant="gold">
          {customOrder.status}
        </Badge>
      </div>
    </Surface>
  );
}
