import {
  LockKeyhole,
  ShieldCheck,
  Truck,
} from "lucide-react";

import {
  Button,
} from "@/components/ui/Button";

import {
  Separator,
} from "@/components/ui/Separator";

import {
  Surface,
} from "@/components/ui/Surface";

import {
  formatCurrency,
} from "@/lib/currency";

import {
  cn,
} from "@/lib/utils";

interface CartSummaryProps {

    readonly subtotal: number;
    readonly discount: number;
    readonly shippingFee: number;
    readonly tax: number;
    readonly grandTotal: number;
    readonly itemCount: number;
    readonly freeShippingThreshold?: number;
    readonly loading?: boolean;
    readonly disabled?: boolean;
    readonly className?: string;
    readonly onCheckout: () => void;
}

interface SummaryRowProps {
  readonly label: string;
  readonly value: number;
  readonly emphasized?: boolean;
  readonly negative?: boolean;
}

function SummaryRow({
  emphasized = false,
  label,
  negative = false,
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

      <span
       className={cn(
         "text-right tabular-nums",
         negative &&
           "text-[var(--color-success)]"
       )}
      >

        {negative ? "−" : ""}
        {formatCurrency(
          Math.abs(value)
        )}
       </span>
      </div>
    );
}

export function CartSummary({
  className,
  disabled = false,
  discount,
  freeShippingThreshold,
  grandTotal,
  itemCount,
  loading = false,
  onCheckout,
  shippingFee,
  subtotal,
  tax,
}: CartSummaryProps): React.JSX.Element {
  const remainingForFreeShipping =
    freeShippingThreshold === undefined
      ?0
      : Math.max(
          0,
          freeShippingThreshold -
            subtotal
        );

 return (
   <Surface
    className={cn(
      "sticky top-24 overflow-hidden",
      className
    )}
    padding="none"
    radius="lg"
    shadow="hover"
   >
    <div className="border-b border-border px-6 py-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em]
text-[var(--color-gold-600)]">

     Order Summary
    </p>

      <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em]
text-foreground">
       Your Selection
      </h2>

    <p className="mt-2 text-sm text-muted">
     {itemCount.toLocaleString(
       "en-IN"
     )}{" "}
     {itemCount === 1
       ? "piece"
       : "pieces"}{" "}
     in your bag
    </p>
   </div>

   <div className="grid gap-4 px-6 py-6">
    <SummaryRow
     label="Subtotal"
     value={subtotal}
    />

    {discount > 0 ? (
      <SummaryRow
        label="Discount"
        value={discount}
        negative
      />
    ) : null}

    <SummaryRow
     label="Shipping"
     value={shippingFee}
    />

    <SummaryRow
     label="Estimated tax"
     value={tax}
    />

    <Separator />

    <SummaryRow
     label="Total"
     value={grandTotal}
     emphasized
    />

     {freeShippingThreshold !==
       undefined &&
     remainingForFreeShipping > 0 ? (
       <div className="rounded-md border border-[color:rgb(200_169_106_/_0.24)]
bg-[color:rgb(200_169_106_/_0.07)] p-4">
        <div className="flex items-start gap-3">
         <Truck
           aria-hidden={true}
           className="mt-0.5 size-5 shrink-0 text-[var(--color-gold-600)]"
         />

         <p className="text-sm leading-6 text-muted">
          Add{" "}
          <strong className="font-semibold text-foreground">
            {formatCurrency(
              remainingForFreeShipping
            )}
          </strong>{" "}
          more to unlock complimentary
          shipping.
         </p>
        </div>
      </div>
    ) : null}

    <Button
     size="lg"
     fullWidth
     disabled={
       disabled ||
       itemCount === 0
     }
     loading={loading}
     loadingLabel="Preparing Checkout"
     onClick={onCheckout}
    >
     <LockKeyhole

        aria-hidden={true}
       />
       Secure Checkout
      </Button>

      <div className="grid gap-3 border-t border-border pt-5 text-xs leading-5 text-muted">
       <div className="flex items-start gap-3">
        <ShieldCheck
          aria-hidden={true}
          className="mt-0.5 size-4 shrink-0 text-[var(--color-gold-600)]"
        />

        <span>
         Payments are securely verified
         before order confirmation.
        </span>
       </div>

       <div className="flex items-start gap-3">
        <Truck
         aria-hidden={true}
         className="mt-0.5 size-4 shrink-0 text-[var(--color-gold-600)]"
        />

        <span>
         Shipping estimates are confirmed
         at checkout.
        </span>
      </div>
     </div>
    </div>
   </Surface>
 );
}
