import { Badge } from "@/components/ui/Badge";

interface InventoryStatusBadgeProps {
  readonly availableQuantity: number;
  readonly lowStockThreshold: number;
  readonly allowBackorder: boolean;

}

export function InventoryStatusBadge({
  allowBackorder,
  availableQuantity,
  lowStockThreshold,
}: InventoryStatusBadgeProps): React.JSX.Element {
  if (availableQuantity <= 0) {
    return (
      <Badge variant={allowBackorder ? "warning" : "error"}>
       {allowBackorder ? "Backorder" : "Out of Stock"}
      </Badge>
    );
  }

    if (availableQuantity <= lowStockThreshold) {
      return (
        <Badge variant="warning">
         Low Stock
        </Badge>
      );
    }

    return (
      <Badge variant="success">
       In Stock
      </Badge>
    );
}
