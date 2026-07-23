import { Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { clamp } from "@/lib/number";

interface RatingProps {
  readonly value: number;
  readonly count?: number;
  readonly showValue?: boolean;
  readonly size?: "sm" | "md";
  readonly className?: string;
}

export function Rating({
  className,
  count,
  showValue = true,
  size = "sm",
  value,
}: RatingProps): React.JSX.Element {
  const safeValue = clamp(value, 0, 5);

 return (
  <div
    className={cn(
      "inline-flex items-center gap-2 text-muted",
      size === "sm" ? "text-xs" : "text-sm",
      className
    )}
    aria-label={`${safeValue.toFixed(1)} out of 5 stars`}
  >
    <span className="inline-flex items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => {
        const filled = index + 1 <= Math.round(safeValue);

      return (
        <Star
         key={index}
         className={cn(
           size === "sm" ? "size-3.5" : "size-4",
           filled
             ? "fill-[var(--color-gold-500)] text-[var(--color-gold-500)]"
             : "fill-transparent text-[var(--color-gray-300)]"
         )}
        />
      );

       })}
      </span>

      {showValue ? (
        <span className="font-medium text-foreground">
          {safeValue.toFixed(1)}
        </span>
      ) : null}

    {typeof count === "number" ? (
      <span>({count.toLocaleString("en-IN")})</span>
    ) : null}
   </div>
 );
}
