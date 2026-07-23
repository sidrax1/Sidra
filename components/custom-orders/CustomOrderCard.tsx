"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Gem,
  ImageIcon,
  Package,
} from "lucide-react";

import { CustomOrderStatusBadge } from "@/components/custom-orders/CustomOrderStatusBadge";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ACCOUNT_ROUTES } from "@/constants/routes";
import { formatCurrency } from "@/lib/currency";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { CustomOrder } from "@/types/custom-order";

interface CustomOrderCardProps {
  readonly customOrder: CustomOrder;
  readonly className?: string;
  readonly onView?: (customOrder: CustomOrder) => void;
}

function formatBudget(
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

  return "Budget open for consultation";
}

export function CustomOrderCard({
  className,
  customOrder,
  onView,
}: CustomOrderCardProps): React.JSX.Element {
  const attachmentCount =
    customOrder.attachmentPaths?.length ?? 0;

  const detailsHref =
    ACCOUNT_ROUTES.CUSTOM_ORDER_DETAILS(customOrder.id);

  return (
    <Card
      className={cn(
        "group overflow-hidden border-[color:rgb(200_169_106_/_0.22)]",
        "transition-[transform,border-color,box-shadow] duration-[var(--duration-slow)]",
        "hover:-translate-y-1 hover:border-[color:rgb(200_169_106_/_0.5)]",
        "hover:shadow-[var(--shadow-hover)]",
        className
      )}
    >
      <div className="grid gap-6 p-6 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-start">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.32)] bg-[color:rgb(200_169_106_/_0.08)] text-[var(--color-gold-600)] shadow-[var(--shadow-card)]">
          <Gem aria-hidden={true} className="size-6" />
        </span>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <CustomOrderStatusBadge status={customOrder.status} />

            <Badge variant="neutral">
              <Package aria-hidden={true} className="mr-1 size-3.5" />
              {customOrder.quantity.toLocaleString("en-IN")}{" "}
              {customOrder.quantity === 1 ? "piece" : "pieces"}
            </Badge>
          </div>

          <h2 className="mt-4 font-heading text-3xl font-medium leading-tight tracking-[-0.035em] text-foreground">
            {customOrder.title}
          </h2>

          <p className="mt-3 line-clamp-3 max-w-3xl text-sm leading-7 text-muted">
            {customOrder.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-xs text-muted">
            <span className="inline-flex items-center gap-2">
              <CalendarDays
                aria-hidden={true}
                className="size-3.5 text-[var(--color-gold-600)]"
              />
              Submitted {formatDate(customOrder.createdAt)}
            </span>

            {customOrder.requiredBy ? (
              <span className="inline-flex items-center gap-2">
                <CalendarDays
                  aria-hidden={true}
                  className="size-3.5 text-[var(--color-gold-600)]"
                />
                Required by {formatDate(customOrder.requiredBy)}
              </span>
            ) : null}

            {attachmentCount > 0 ? (
              <span className="inline-flex items-center gap-2">
                <ImageIcon
                  aria-hidden={true}
                  className="size-3.5 text-[var(--color-gold-600)]"
                />
                {attachmentCount.toLocaleString("en-IN")} reference{" "}
                {attachmentCount === 1 ? "file" : "files"}
              </span>
            ) : null}

            <span className="font-medium text-foreground">
              {formatBudget(
                customOrder.budgetMinimumPaise,
                customOrder.budgetMaximumPaise
              )}
            </span>
          </div>
        </div>

        {onView ? (
          <Button
            variant="outline"
            className="shrink-0"
            onClick={() => onView(customOrder)}
          >
            View Request
            <ArrowUpRight aria-hidden={true} className="size-4" />
          </Button>
        ) : (
          <Button asChild variant="outline" className="shrink-0">
            <Link href={detailsHref}>
              View Request
              <ArrowUpRight aria-hidden={true} className="size-4" />
            </Link>
          </Button>
        )}
      </div>
    </Card>
  );
}
