"use client";

import {
  Plus,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { cn } from "@/lib/utils";

export interface SellerProductVariant {
  readonly id: string;
  readonly title: string;
  readonly sku: string;
  readonly pricePaise: number;
  readonly availableQuantity: number;
  readonly active: boolean;
}

interface VariantEditorProps {
  readonly variants: readonly SellerProductVariant[];
  readonly disabled?: boolean;
  readonly onChange: (variants: readonly SellerProductVariant[]) => void;
}

function updateVariant(
  variants: readonly SellerProductVariant[],
  variantId: string,
  updates: Partial<SellerProductVariant>
): SellerProductVariant[] {
  return variants.map((variant) =>
    variant.id === variantId
     ?{
         ...variant,
         ...updates,
       }
     : variant
  );

}

export function VariantEditor({
  disabled = false,
  onChange,
  variants,
}: VariantEditorProps): React.JSX.Element {
  const addVariant = (): void => {
    onChange([
      ...variants,
      {
        id: crypto.randomUUID(),
        title: "",
        sku: "",
        pricePaise: 0,
        availableQuantity: 0,
        active: true,
      },
    ]);
  };

    return (
     <section className="grid gap-5">
       <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
         <h2 className="font-heading text-3xl font-medium tracking-[-0.03em]">
           Variants
         </h2>

        <p className="mt-2 text-sm text-muted">
         Add sizes, colours or other selectable product options.
        </p>
       </div>

       <Button
        variant="outline"
        disabled={disabled || variants.length >= 100}
        onClick={addVariant}
       >
        <Plus aria-hidden={true} />
        Add Variant
       </Button>
      </header>

   {variants.length === 0 ? (
     <div className="rounded-[var(--radius-lg)] border border-dashed border-border bg-card
px-6 py-12 text-center">
      <p className="font-medium text-foreground">
       This product has no variants
      </p>

     <p className="mt-2 text-sm text-muted">
       Add variants when customers need to select a size, colour or finish.
     </p>
    </div>
   ):(
    <div className="grid gap-4">
     {variants.map((variant, index) => (
       <article
        key={variant.id}
        className={cn(
          "grid gap-5 rounded-[var(--radius-lg)] border border-border bg-card p-5",
          "shadow-[var(--shadow-card)]"
        )}
       >
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
           Variant {index + 1}
          </p>

         <IconButton
          label={`Remove variant ${index + 1}`}
          icon={<Trash2 aria-hidden={true} />}
          appearance="ghost"
          size="sm"
          disabled={disabled}
          className="text-[var(--color-error)]"
          onClick={() => {
            onChange(
              variants.filter(
                (currentVariant) =>
                 currentVariant.id !== variant.id
              )
            );
          }}
         />
        </div>

<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
 <FormField
  label="Variant Name"
  labelFor={`variant-title-${variant.id}`}
  required
 >
  <Input
    id={`variant-title-${variant.id}`}
    value={variant.title}
    disabled={disabled}
    placeholder="Pearl White"
    onChange={(event) => {
      onChange(
        updateVariant(variants, variant.id, {
          title: event.target.value,
        })
      );
    }}
  />
 </FormField>

 <FormField
  label="SKU"
  labelFor={`variant-sku-${variant.id}`}
  required
 >
  <Input
    id={`variant-sku-${variant.id}`}
    value={variant.sku}
    disabled={disabled}
    placeholder="SID-PEARL-01"
    onChange={(event) => {
      onChange(
        updateVariant(variants, variant.id, {
          sku: event.target.value.toUpperCase(),
        })
      );
    }}
  />
 </FormField>

 <FormField
  label="Price"
  labelFor={`variant-price-${variant.id}`}

 required
>
 <Input
  id={`variant-price-${variant.id}`}
  type="number"
  min={0}
  step="0.01"
  value={variant.pricePaise / 100}
  disabled={disabled}
  onChange={(event) => {
    onChange(
      updateVariant(variants, variant.id, {
        pricePaise: Math.max(
          0,
          Math.round(Number(event.target.value) * 100)
        ),
      })
    );
  }}
 />
</FormField>

<FormField
 label="Quantity"
 labelFor={`variant-quantity-${variant.id}`}
 required
>
 <Input
   id={`variant-quantity-${variant.id}`}
   type="number"
   min={0}
   step={1}
   value={variant.availableQuantity}
   disabled={disabled}
   onChange={(event) => {
     onChange(
       updateVariant(variants, variant.id, {
         availableQuantity: Math.max(
           0,
           Number.parseInt(event.target.value, 10) || 0
         ),
       })
     );
   }}

           />
          </FormField>
         </div>

           <Switch
            checked={variant.active}
            disabled={disabled}
            label="Variant available for purchase"
            onCheckedChange={(checked) => {
              onChange(
                updateVariant(variants, variant.id, {
                  active: checked,
                })
              );
            }}
           />
         </article>
       ))}
      </div>
    )}
   </section>
 );
}
