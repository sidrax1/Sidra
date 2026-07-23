"use client";

import {
  Boxes,
  TriangleAlert,
} from "lucide-react";

import { Checkbox } from "@/components/ui/Checkbox";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Surface } from "@/components/ui/Surface";

export interface InventoryEditorValues {
  readonly trackInventory: boolean;
  readonly availableQuantity: number;
  readonly lowStockThreshold: number;
  readonly allowBackorder: boolean;
}

interface InventoryEditorProps {
  readonly values: InventoryEditorValues;
  readonly disabled?: boolean;
  readonly onChange: (values: InventoryEditorValues) => void;
}

export function InventoryEditor({

  disabled = false,
  onChange,
  values,
}: InventoryEditorProps): React.JSX.Element {
  const lowStock =
    values.trackInventory &&
    values.availableQuantity <= values.lowStockThreshold;

 return (
   <Surface className="grid gap-6">
    <header className="flex items-start gap-4">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full border
border-[color:rgb(200_169_106_/_0.28)] bg-[color:rgb(200_169_106_/_0.08)]
text-[var(--color-gold-600)]">
       <Boxes
        aria-hidden="true"
        className="size-5"
       />
      </span>

     <div>
      <h2 className="font-heading text-3xl font-medium tracking-[-0.03em]">
       Inventory
      </h2>

     <p className="mt-2 text-sm leading-6 text-muted">
      Control stock availability and low-stock protection.
     </p>
    </div>
   </header>

   <Checkbox
    checked={values.trackInventory}
    disabled={disabled}
    label="Track inventory for this product"
    description="Sidra will prevent overselling based on available stock."
    onChange={(event) => {
      onChange({
        ...values,
        trackInventory: event.target.checked,
      });
    }}
   />

{values.trackInventory ? (
 <>
  <div className="grid gap-5 md:grid-cols-2">
    <FormField
     label="Available Quantity"
     labelFor="available-quantity"
     required
    >
     <Input
       id="available-quantity"
       type="number"
       min={0}
       step={1}
       disabled={disabled}
       value={values.availableQuantity}
       onChange={(event) => {
         onChange({
           ...values,
           availableQuantity: Math.max(
             0,
             Number.parseInt(event.target.value, 10) || 0
           ),
         });
       }}
     />
    </FormField>

    <FormField
     label="Low Stock Threshold"
     labelFor="low-stock-threshold"
     required
    >
     <Input
       id="low-stock-threshold"
       type="number"
       min={0}
       step={1}
       disabled={disabled}
       value={values.lowStockThreshold}
       onChange={(event) => {
         onChange({
          ...values,
          lowStockThreshold: Math.max(
            0,

                Number.parseInt(event.target.value, 10) || 0
              ),
            });
          }}
        />
       </FormField>
      </div>

      <Checkbox
       checked={values.allowBackorder}
       disabled={disabled}
       label="Allow backorders"
       description="Customers may order even after available inventory reaches zero."
       onChange={(event) => {
         onChange({
           ...values,
           allowBackorder: event.target.checked,
         });
       }}
      />

        {lowStock ? (
          <Alert
            variant="warning"
            title="Low stock"
            description="Available inventory is at or below the configured warning threshold."
            icon={
              <TriangleAlert
                aria-hidden="true"
                className="size-5"
              />
            }
          />
        ) : null}
      </>
    ) : null}
   </Surface>
 );
}
