import {
  AlertTriangle,
  Boxes,
  PackageCheck,
  PackageX,
} from "lucide-react";

import { Surface } from "@/components/ui/Surface";
import type { InventorySummary } from "@/types/inventory";

interface InventoryAnalyticsSummaryProps {
  readonly summary: InventorySummary;
}

export function InventoryAnalyticsSummary({
  summary,
}: InventoryAnalyticsSummaryProps): React.JSX.Element {
  const metrics = [
    {
      label: "Tracked Products",
      value: summary.totalProducts,
      icon: Boxes,
    },
    {
      label: "In Stock",
      value: summary.inStockProducts,
      icon: PackageCheck,
    },
    {
      label: "Low Stock",
      value: summary.lowStockProducts,
      icon: AlertTriangle,
    },
    {
      label: "Out of Stock",
      value: summary.outOfStockProducts,
      icon: PackageX,
    },
  ] as const;

  return (
    <Surface padding="none" className="overflow-hidden">
      <header className="border-b border-border bg-[color:rgb(200_169_106_/_0.05)] px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
          Stock Intelligence
        </p>

        <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em]">
          Inventory Overview
        </h2>
      </header>

      <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.label}
              className="rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-[var(--shadow-card)]"
            >
              <Icon className="size-5 text-[var(--color-gold-600)]" />

              <p className="mt-5 font-heading text-4xl font-medium tracking-[-0.04em]">
                {metric.value.toLocaleString("en-IN")}
              </p>

              <p className="mt-2 text-sm text-muted">
                {metric.label}
              </p>
            </article>
          );
        })}
      </div>
    </Surface>
  );
}
