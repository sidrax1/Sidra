"use client";

import {
 BadgeIndianRupee,
 Percent,

} from "lucide-react";

import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Surface } from "@/components/ui/Surface";
import { formatCurrency } from "@/lib/currency";

interface ProductPricingValues {
  readonly pricePaise: number;
  readonly compareAtPricePaise?: number;
  readonly costPerItemPaise?: number;
}

interface ProductPricingEditorProps {
  readonly values: ProductPricingValues;
  readonly disabled?: boolean;
  readonly onChange: (values: ProductPricingValues) => void;
}

function paiseToRupees(value?: number): string {
  return value === undefined
   ? ""
   : String(value / 100);
}

function rupeesToPaise(value: string): number | undefined {
 const parsed = Number(value);

    if (!Number.isFinite(parsed) || parsed < 0) {
      return undefined;
    }

    return Math.round(parsed * 100);
}

export function ProductPricingEditor({
  disabled = false,
  onChange,
  values,
}: ProductPricingEditorProps): React.JSX.Element {
  const discountPercentage =
   values.compareAtPricePaise &&
   values.compareAtPricePaise > values.pricePaise
     ? Math.round(

      ((values.compareAtPricePaise - values.pricePaise) /
        values.compareAtPricePaise) *
        100
     )
   : 0;

 const margin =
  values.costPerItemPaise !== undefined
   ? values.pricePaise - values.costPerItemPaise
   : undefined;

 return (
   <Surface className="grid gap-6">
    <header>
      <div className="flex items-center gap-3">
       <span className="flex size-11 items-center justify-center rounded-full border
border-[color:rgb(200_169_106_/_0.28)] bg-[color:rgb(200_169_106_/_0.08)]
text-[var(--color-gold-600)]">
        <BadgeIndianRupee
          aria-hidden="true"
          className="size-5"
        />
       </span>

      <div>
       <h2 className="font-heading text-3xl font-medium tracking-[-0.03em]">
        Pricing
       </h2>

      <p className="mt-1 text-sm text-muted">
        Set a clear premium price and optional comparison value.
      </p>
     </div>
    </div>
   </header>

   <div className="grid gap-5 md:grid-cols-3">
    <FormField
     label="Selling Price"
     labelFor="product-selling-price"
     required
    >
     <Input
       id="product-selling-price"

  type="number"
  min={0}
  step="0.01"
  disabled={disabled}
  value={paiseToRupees(values.pricePaise)}
  onChange={(event) => {
    onChange({
      ...values,
      pricePaise:
        rupeesToPaise(event.target.value) ?? 0,
    });
  }}
 />
</FormField>

<FormField
 label="Compare-at Price"
 labelFor="product-compare-price"
 optional
>
 <Input
   id="product-compare-price"
   type="number"
   min={0}
   step="0.01"
   disabled={disabled}
   value={paiseToRupees(values.compareAtPricePaise)}
   onChange={(event) => {
     onChange({
       ...values,
       compareAtPricePaise:
         rupeesToPaise(event.target.value),
     });
   }}
 />
</FormField>

<FormField
 label="Cost per Item"
 labelFor="product-cost-price"
 optional
>
 <Input
   id="product-cost-price"

       type="number"
       min={0}
       step="0.01"
       disabled={disabled}
       value={paiseToRupees(values.costPerItemPaise)}
       onChange={(event) => {
         onChange({
           ...values,
           costPerItemPaise:
             rupeesToPaise(event.target.value),
         });
       }}
     />
    </FormField>
   </div>

   <div className="grid gap-4 rounded-[var(--radius-md)] border border-border
bg-background p-5 sm:grid-cols-3">
    <div>
     <p className="text-xs uppercase tracking-[0.15em] text-muted">
       Sale Price
     </p>
     <p className="mt-2 font-medium text-foreground">
       {formatCurrency(values.pricePaise / 100)}
     </p>
    </div>

    <div>
     <p className="text-xs uppercase tracking-[0.15em] text-muted">
      Discount
     </p>
     <p className="mt-2 inline-flex items-center gap-2 font-medium text-foreground">
      <Percent
        aria-hidden="true"
        className="size-4 text-[var(--color-gold-600)]"
      />
      {discountPercentage}%
     </p>
    </div>

    <div>
     <p className="text-xs uppercase tracking-[0.15em] text-muted">
      Estimated Margin
     </p>

      <p className="mt-2 font-medium text-foreground">
        {margin === undefined
         ? "Not calculated"
         : formatCurrency(margin / 100)}
      </p>
     </div>
    </div>
   </Surface>
 );
}
