"use client";

import {
  CalendarDays,
  PackageCheck,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Surface } from "@/components/ui/Surface";

export interface FulfilmentDetails {
  readonly carrier: string;
  readonly trackingNumber: string;
  readonly trackingURL?: string;
  readonly estimatedDeliveryDate?: string;
}

interface OrderFulfilmentPanelProps {
  readonly values: FulfilmentDetails;
  readonly loading?: boolean;
  readonly disabled?: boolean;
  readonly onChange: (values: FulfilmentDetails) => void;
  readonly onSubmit: () => void | Promise<void>;

}

const carrierOptions = [
  {
    value: "delhivery",
    label: "Delhivery",
  },
  {
    value: "bluedart",
    label: "Blue Dart",
  },
  {
    value: "dtdc",
    label: "DTDC",
  },
  {
    value: "india-post",
    label: "India Post",
  },
  {
    value: "other",
    label: "Other",
  },
] as const;

export function OrderFulfilmentPanel({
  disabled = false,
  loading = false,
  onChange,
  onSubmit,
  values,
}: OrderFulfilmentPanelProps): React.JSX.Element {
  const valid =
    values.carrier.trim().length > 0 &&
    values.trackingNumber.trim().length >= 3;

 return (
   <Surface className="grid gap-6">
    <header className="flex items-start gap-4">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full border
border-[color:rgb(200_169_106_/_0.28)] bg-[color:rgb(200_169_106_/_0.08)]
text-[var(--color-gold-600)]">
       <Truck
        aria-hidden={true}

   className="size-5"
  />
 </span>

 <div>
  <h2 className="font-heading text-3xl font-medium tracking-[-0.03em]">
   Fulfilment
  </h2>

  <p className="mt-2 text-sm leading-6 text-muted">
   Add secure shipment details before marking the order as dispatched.
  </p>
 </div>
</header>

<div className="grid gap-5 md:grid-cols-2">
 <FormField
  label="Delivery Partner"
  labelFor="fulfilment-carrier"
  required
 >
  <Select
    id="fulfilment-carrier"
    value={values.carrier}
    options={carrierOptions}
    placeholder="Select carrier"
    disabled={disabled}
    onChange={(event) => {
      onChange({
        ...values,
        carrier: event.target.value,
      });
    }}
  />
 </FormField>

 <FormField
  label="Tracking Number"
  labelFor="fulfilment-tracking-number"
  required
 >
  <Input
    id="fulfilment-tracking-number"
    value={values.trackingNumber}

       disabled={disabled}
       onChange={(event) => {
         onChange({
           ...values,
           trackingNumber: event.target.value.trimStart(),
         });
       }}
     />
    </FormField>
   </div>

   <FormField
    label="Tracking URL"
    labelFor="fulfilment-tracking-url"
    optional
   >
    <Input
      id="fulfilment-tracking-url"
      type="url"
      value={values.trackingURL ?? ""}
      disabled={disabled}
      onChange={(event) => {
        onChange({
          ...values,
          trackingURL: event.target.value || undefined,
        });
      }}
    />
   </FormField>

    <FormField
     label="Estimated Delivery"
     labelFor="fulfilment-estimated-date"
     optional
    >
     <div className="relative">
       <CalendarDays
        aria-hidden={true}
        className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2
text-muted"
       />

      <Input
       id="fulfilment-estimated-date"

         type="date"
         value={values.estimatedDeliveryDate ?? ""}
         disabled={disabled}
         className="pl-11"
         onChange={(event) => {
           onChange({
             ...values,
             estimatedDeliveryDate:
               event.target.value || undefined,
           });
         }}
        />
       </div>
      </FormField>

    <div className="flex justify-end border-t border-border pt-5">
     <Button
      disabled={disabled || !valid}
      loading={loading}
      loadingLabel="Updating Order"
      onClick={() => {
        void onSubmit();
      }}
     >
      <PackageCheck aria-hidden={true} />
      Mark as Shipped
     </Button>
    </div>
   </Surface>
 );
}
