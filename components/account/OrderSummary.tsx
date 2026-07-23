import { Separator } from "@/components/ui/Separator";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";
import type { Order } from "@/types/order";

interface OrderSummaryProps {
  readonly order: Order;
  readonly className?: string;
}

interface SummaryRowProps {
  readonly label: string;
  readonly value: number;
  readonly emphasized?: boolean;
}

function SummaryRow({
 emphasized = false,
 label,

  value,
}: SummaryRowProps): React.JSX.Element {
  return (
    <div
     className={cn(
       "flex items-center justify-between gap-6",
       emphasized
         ? "font-semibold text-foreground"
         : "text-sm text-muted"
     )}
    >
     <span>{label}</span>
     <span>{formatCurrency(value)}</span>
    </div>
  );
}

export function OrderSummary({
  className,
  order,
}: OrderSummaryProps): React.JSX.Element {
  return (
   <section
     className={cn(
       "rounded-[var(--radius-lg)] border border-border bg-card p-6 shadow-[var(--shadow-card)]",
       className
     )}
   >
     <h2 className="font-heading text-3xl font-medium tracking-[-0.03em]">
       Payment Summary
     </h2>

    <div className="mt-6 grid gap-4">
     <SummaryRow
      label="Subtotal"
      value={order.subtotal}
     />

     <SummaryRow
      label="Discount"
      value={-order.discount}
     />

     <SummaryRow

       label="Shipping"
       value={order.shippingFee}
      />

      <SummaryRow
       label="Tax"
       value={order.tax}
      />

      <Separator />

     <SummaryRow
       label="Total"
       value={order.grandTotal}
       emphasized
     />
    </div>
   </section>
 );
}
