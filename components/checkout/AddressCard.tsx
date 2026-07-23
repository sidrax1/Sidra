"use client";

import {
  CheckCircle2,
  MapPin,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  IconButton,
} from "@/components/ui/IconButton";

import {
  cn,
} from "@/lib/utils";

import type {
  Address,
} from "@/types/address";

interface AddressCardProps {
  readonly address: Address;
  readonly selected?: boolean;
  readonly disabled?: boolean;

    readonly className?: string;
    readonly onSelect?: (
      address: Address
    ) => void;
    readonly onEdit?: (
      address: Address
    ) => void;
    readonly onDelete?: (
      address: Address
    ) => void;
}

export function AddressCard({
  address,
  className,
  disabled = false,
  onDelete,
  onEdit,
  onSelect,
  selected = false,
}: AddressCardProps): React.JSX.Element {
  return (
   <article
     className={cn(
       "relative rounded-[var(--radius-lg)] border p-5",
       "transition-[border-color,box-shadow,background-color]",
       "duration-[var(--duration-base)]",
       selected
         ? "border-[var(--color-gold-500)] bg-[color:rgb(200_169_106_/_0.07)]shadow-[var(--shadow-gold-glow)]"
         : "border-border bg-card shadow-[var(--shadow-card)]",
       disabled &&
         "pointer-events-none opacity-45",
       className
     )}
   >
     <button
       type="button"
       disabled={
         disabled ||
         !onSelect
       }
       onClick={() =>
         onSelect?.(address)

     }
     aria-pressed={selected}
     className="absolute inset-0 rounded-[inherit] outline-none focus-visible:ring-2
focus-visible:ring-primary focus-visible:ring-offset-2"
    >
     <span className="sr-only">
       Select address for{" "}
       {address.fullName}
     </span>
    </button>

    <div className="relative pointer-events-none">
      <div className="flex items-start justify-between gap-5">
       <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full border",
            selected
              ? "border-[var(--color-gold-500)] bg-[var(--color-gold-100)]text-[var(--color-gold-600)]"
              : "border-border bg-background text-muted"
          )}
        >
          {selected ? (
            <CheckCircle2
              aria-hidden={true}
              className="size-5"
            />
          ):(
            <MapPin
              aria-hidden={true}
              className="size-5"
            />
          )}
        </span>

        <div>
         <h3 className="font-medium text-foreground">
          {address.fullName}
         </h3>

         <p className="mt-1 text-sm text-muted">
          {address.phone}
         </p>

  </div>
 </div>

 <div className="pointer-events-auto relative z-10 flex gap-1">
  {onEdit ? (
    <IconButton
      label={`Edit address for ${address.fullName}`}
      icon={
        <Pencil aria-hidden={true} />
      }
      appearance="ghost"
      size="sm"
      disabled={disabled}
      onClick={() =>
        onEdit(address)
      }
    />
  ) : null}

  {onDelete ? (
    <IconButton
      label={`Delete address for ${address.fullName}`}
      icon={
        <Trash2 aria-hidden={true} />
      }
      appearance="ghost"
      size="sm"
      disabled={disabled}
      className="text-[var(--color-error)]"
      onClick={() =>
        onDelete(address)
      }
    />
  ) : null}
 </div>
</div>

<address className="mt-5 not-italic text-sm leading-7 text-muted">
 <span className="block">
  {address.line1}
 </span>

 {address.line2 ? (
  <span className="block">

          {address.line2}
        </span>
      ) : null}

      {address.landmark ? (
        <span className="block">
          Near {address.landmark}
        </span>
      ) : null}

      <span className="block">
       {address.city}
       {address.district
         ? `, ${address.district}`
         : ""}
       , {address.state}{" "}
       {address.postalCode}
      </span>

     <span className="block">
      {address.country}
     </span>
    </address>

     <div className="mt-4 flex flex-wrap gap-2">
      {address.defaultShipping ? (
        <span className="rounded-full border border-border bg-background px-3 py-1 text-xs
text-muted">
          Default Shipping
        </span>
      ) : null}

        {address.defaultBilling ? (
          <span className="rounded-full border border-border bg-background px-3 py-1 text-xs
text-muted">
            Default Billing
          </span>
        ) : null}
      </div>
     </div>
    </article>
  );
}
