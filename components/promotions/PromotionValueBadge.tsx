import {
  BadgePercent,
  Gift,
  IndianRupee,
  Truck,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/currency";
import type { PromotionValue } from "@/types/promotion";

interface PromotionValueBadgeProps {
  readonly value: PromotionValue;
}

export function PromotionValueBadge({
  value,
}: PromotionValueBadgeProps): React.JSX.Element {
  if (value.type === "percentage") {
    const percentage =
      (value.percentageBasisPoints ?? 0) / 100;

    return (
      <Badge variant="gold">
        <BadgePercent
          aria-hidden="true"
          className="mr-1 size-3.5"
        />
        {percentage.toLocaleString("en-IN", {
          maximumFractionDigits: 2,
        })}
        % Off
      </Badge>
    );
  }

  if (value.type === "fixedAmount") {
    return (
      <Badge variant="gold">
        <IndianRupee
          aria-hidden="true"
          className="mr-1 size-3.5"
        />
        {formatCurrency(
          (value.fixedAmountPaise ?? 0) / 100
        )}{" "}
        Off
      </Badge>
    );
  }

  if (value.type === "freeShipping") {
    return (
      <Badge variant="success">
        <Truck
          aria-hidden="true"
          className="mr-1 size-3.5"
        />
        Free Shipping
      </Badge>
    );
  }

  return (
    <Badge variant="gold">
      <Gift
        aria-hidden="true"
        className="mr-1 size-3.5"
      />
      Buy {value.buyQuantity ?? 0}, Get{" "}
      {value.rewardQuantity ?? 0}
    </Badge>
  );
}
