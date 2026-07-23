import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  PackageX,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import type { InventoryStatus } from "@/types/inventory";

interface InventoryStatusBadgeProps {
  readonly status: InventoryStatus;
}

const labels: Record<InventoryStatus, string> = {
  inStock: "In Stock",
  lowStock: "Low Stock",
  outOfStock: "Out of Stock",
  preorder: "Preorder",
  discontinued: "Discontinued",
};

export function InventoryStatusBadge({
  status,
}: InventoryStatusBadgeProps): React.JSX.Element {
  const Icon =
    status === "inStock"
      ? CheckCircle2
      : status === "lowStock"
        ? AlertTriangle
        : status === "outOfStock"
          ? PackageX
          : status === "preorder"
            ? Clock3
            : XCircle;

  const variant =
    status === "inStock"
      ? "success"
      : status === "lowStock" || status === "preorder"
        ? "warning"
        : status === "discontinued"
          ? "neutral"
          : "error";

  return (
    <Badge variant={variant}>
      <Icon className="mr-1 size-3.5" />
      {labels[status]}
    </Badge>
  );
}
