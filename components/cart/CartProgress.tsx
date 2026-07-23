import {
  Gift,
  Truck,
} from "lucide-react";

import {
  Progress,
} from "@/components/ui/Progress";

import {
  formatCurrency,
} from "@/lib/currency";

import {
  cn,
} from "@/lib/utils";

interface CartProgressProps {
  readonly subtotal: number;
  readonly targetAmount: number;
  readonly achievedLabel?: string;
  readonly pendingLabel?: string;
  readonly className?: string;
}

export function CartProgress({
  achievedLabel = "Complimentary shipping unlocked",
  className,
  pendingLabel = "Add {amount} more for complimentary shipping",
  subtotal,
  targetAmount,
}: CartProgressProps): React.JSX.Element {
  const remaining =
   Math.max(
     0,

    targetAmount - subtotal
  );

 const achieved =
  remaining <= 0;

 const description = achieved
  ? achievedLabel
  : pendingLabel.replace(
      "{amount}",
      formatCurrency(
        remaining
      )
    );

 return (
  <section
    className={cn(
      "rounded-[var(--radius-lg)] border border-[color:rgb(200_169_106_/_0.24)]",
      "bg-[linear-gradient(135deg,rgba(200,169,106,0.1),rgba(200,169,106,0.03))]",
      "p-5 shadow-[var(--shadow-card)]",
      className
    )}
  >
    <div className="flex items-start gap-4">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full border
border-[color:rgb(200_169_106_/_0.3)] bg-card text-[var(--color-gold-600)]">
        {achieved ? (
          <Gift
           aria-hidden="true"
           className="size-5"
          />
        ):(
          <Truck
           aria-hidden="true"
           className="size-5"
          />
        )}
      </span>

     <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-foreground">
       {description}
      </p>

       <Progress
        value={subtotal}
        max={targetAmount}
        label="Complimentary shipping progress"
        className="mt-4"
       />
     </div>
    </div>
   </section>
 );
}
