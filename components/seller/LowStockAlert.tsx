import {
  Boxes,
  TriangleAlert,
} from "lucide-react";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";

interface LowStockAlertProps {
  readonly productCount: number;
  readonly onReviewInventory: () => void;
}

export function LowStockAlert({
  onReviewInventory,
  productCount,
}: LowStockAlertProps): React.JSX.Element | null {
  if (productCount <= 0) {
    return null;
  }

 return (
   <Alert
    variant="warning"
    title={`${productCount.toLocaleString("en-IN")} ${
      productCount === 1 ? "product needs" : "products need"
    } attention`}
    description="Available inventory has reached the configured low-stock threshold."
    icon={
      <TriangleAlert
        aria-hidden="true"
        className="size-5"
      />
    }
    action={
      <Button
        variant="outline"
        size="sm"
        onClick={onReviewInventory}
      >
        <Boxes aria-hidden="true" />
        Review Inventory
      </Button>
    }
   />
 );
}
