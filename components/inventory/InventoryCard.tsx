import {
  Boxes,
  PackageCheck,
  ShieldAlert,
} from "lucide-react";

import { InventoryStatusBadge } from "@/components/inventory/InventoryStatusBadge";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { InventoryRecord } from "@/types/inventory";

interface InventoryCardProps {
  readonly inventory: InventoryRecord;
  readonly productTitle: string;
}

export function InventoryCard({
  inventory,
  productTitle,
}: InventoryCardProps): React.JSX.Element {
  const totalQuantity =
    inventory.availableQuantity +
    inventory.reservedQuantity;

  return (
    <Card className="p-5 transition-[transform,border-color,box-shadow] hover:-translate-y-0.5 hover:border-[color:rgb(200_169_106_/_0.4)] hover:shadow-[var(--shadow-hover)]">
      <div className="flex items-start justify-between gap-5">
        <span className="flex size-11 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.08)] text-[var(--color-gold-600)]">
          <Boxes className="size-5" />
        </span>

        <InventoryStatusBadge status={inventory.status} />
      </div>

      <h2 className="mt-5 font-heading text-2xl font-medium tracking-[-0.025em]">
        {productTitle}
      </h2>

      <p className="mt-2 font-mono text-xs text-muted">
        SKU {inventory.sku}
      </p>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-[var(--radius-md)] border border-border bg-background p-3 text-center">
          <p className="text-2xl font-medium">
            {inventory.availableQuantity}
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-muted">
            Available
          </p>
        </div>

        <div className="rounded-[var(--radius-md)] border border-border bg-background p-3 text-center">
          <p className="text-2xl font-medium">
            {inventory.reservedQuantity}
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-muted">
            Reserved
          </p>
        </div>

        <div className="rounded-[var(--radius-md)] border border-border bg-background p-3 text-center">
          <p className="text-2xl font-medium">
            {inventory.incomingQuantity}
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-muted">
            Incoming
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
        <Badge variant="neutral">
          <PackageCheck className="mr-1 size-3.5" />
          Total {totalQuantity}
        </Badge>

        {inventory.availableQuantity <=
        inventory.reorderThreshold ? (
          <Badge variant="warning">
            <ShieldAlert className="mr-1 size-3.5" />
            Reorder Required
          </Badge>
        ) : null}
      </div>
    </Card>
  );
}
