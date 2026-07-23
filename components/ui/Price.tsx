import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/currency";

interface PriceProps {
  readonly amount: number;
  readonly compareAtAmount?: number;
  readonly size?: "sm" | "md" | "lg" | "xl";
  readonly className?: string;
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-2xl",
  xl: "text-4xl",
} as const;

export function Price({
  amount,
  className,
  compareAtAmount,
  size = "md",
}: PriceProps): React.JSX.Element {
  const hasDiscount =
   typeof compareAtAmount === "number" &&
   compareAtAmount > amount;

 return (
  <div
    className={cn(
      "flex flex-wrap items-baseline gap-2",
      className
    )}
  >
    <span
      className={cn(
        "font-semibold tracking-[-0.02em] text-foreground",
        sizeClasses[size]
      )}
    >
      {formatCurrency(amount)}
    </span>

    {hasDiscount ? (
      <span className="text-sm text-muted line-through">
        {formatCurrency(compareAtAmount)}
      </span>
    ) : null}
   </div>
 );
}
