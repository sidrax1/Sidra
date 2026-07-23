"use client";

import {
  CheckCircle2,
  Edit3,
  MapPin,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { Address } from "@/types/address";

interface AddressCardProps {
  readonly address: Address;
  readonly loading?: boolean;
  readonly className?: string;
  readonly onEdit?: (
    address: Address
  ) => void;
  readonly onDelete?: (
    address: Address
  ) => void;
  readonly onSetDefault?: (
    address: Address
  ) => void;
}

export function AddressCard({
  address,
  className,
  loading = false,
  onDelete,
  onEdit,
  onSetDefault,
}: AddressCardProps): React.JSX.Element {
  return (
    <Card
     className={cn(
       "p-6",
       className
     )}
    >
     <div className="flex items-start justify-between gap-5">
       <div className="flex items-start gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full border
border-[color:rgb(200_169_106_/_0.28)] bg-[color:rgb(200_169_106_/_0.08)]
text-[var(--color-gold-600)]">
          <MapPin
           aria-hidden="true"
           className="size-5"
          />
        </span>

      <div>
       <div className="flex flex-wrap items-center gap-2">

 <h3 className="font-heading text-2xl font-medium text-foreground">
  {address.fullName}
 </h3>

 {address.defaultShipping ? (
   <Badge variant="success">
     Default Shipping
   </Badge>
 ) : null}

 {address.defaultBilling ? (
   <Badge variant="gold">
     Default Billing
   </Badge>
 ) : null}
</div>

<address className="mt-3 not-italic text-sm leading-7 text-muted">
 <p>{address.line1}</p>

 {address.line2 ? (
   <p>{address.line2}</p>
 ) : null}

 {address.landmark ? (
   <p>
     Near {address.landmark}
   </p>
 ) : null}

 <p>
  {address.city}
  {address.district
    ? `, ${address.district}`
    : ""}
  , {address.state}{" "}
  {address.postalCode}
 </p>

 <p>{address.country}</p>

 <p className="mt-2 text-foreground">
  {address.phone}
 </p>

    </address>
  </div>
 </div>
</div>

<div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-5">
 {onEdit ? (
   <Button
     variant="outline"
     size="sm"
     disabled={loading}
     onClick={() =>
       onEdit(address)
     }
   >
     <Edit3
       aria-hidden="true"
       className="size-4"
     />
     Edit
   </Button>
 ) : null}

 {!address.defaultShipping &&
 onSetDefault ? (
   <Button
     variant="ghost"
     size="sm"
     disabled={loading}
     onClick={() =>
       onSetDefault(address)
     }
   >
     <CheckCircle2
       aria-hidden="true"
       className="size-4"
     />
     Set Default
   </Button>
 ) : null}

 {onDelete ? (
  <Button
   variant="ghost"

         size="sm"
         disabled={loading}
         onClick={() =>
           onDelete(address)
         }
         className="text-[var(--color-error)]"
       >
         <Trash2
           aria-hidden="true"
           className="size-4"
         />
         Delete
       </Button>
     ) : null}
    </div>
   </Card>
 );
}
