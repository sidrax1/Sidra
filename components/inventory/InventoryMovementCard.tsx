import {
  ArrowDown,
  ArrowUp,
  Boxes,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatDateTime } from "@/lib/date";
import type { InventoryMovement } from "@/types/inventory";

interface InventoryMovementCardProps {
  readonly movement: InventoryMovement;
}

export function InventoryMovementCard({
  movement,
}: InventoryMovementCardProps): React.JSX.Element {
  const positive = movement.quantityChange > 0;

  return (
    <Card className="p-5">
      <div className="flex items-start gap-4">
        <span
          className={[
            "flex size-11 shrink-0 items-center justify-center rounded-full border",
            positive
              ? "border-[color:rgb(62_107_82_/_0.3)] bg-[color:rgb(62_107_82_/_0.08)] text-[var(--color-success)]"
              : "border-[color:rgb(145_59_59_/_0.3)] bg-[color:rgb(145_59_59_/_0.08)] text-[var(--color-error)]",
          ].join(" ")}
        >
          {positive ? (
            <ArrowUp className="size-5" />
          ) : (
            <ArrowDown className="size-5" />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-medium">
              {movement.reason}
            </h3>

            <Badge
              variant={positive ? "success" : "error"}
            >
              {positive ? "+" : ""}
              {movement.quantityChange}
            </Badge>
          </div>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
            <span className="inline-flex items-center gap-2">
              <Boxes className="size-3.5" />
              {movement.quantityBefore} →{" "}
              {movement.quantityAfter}
            </span>

            <time>
              {formatDateTime(movement.createdAt)}
            </time>

            {movement.referenceId ? (
              <span>
                Ref {movement.referenceId}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
}
