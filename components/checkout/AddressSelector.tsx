import type {
  ReactNode,
} from "react";

import {
  AddressCard,
} from "@/components/checkout/AddressCard";

import {
  EmptyState,
} from "@/components/ui/EmptyState";

import type {
  Address,
} from "@/types/address";

interface AddressSelectorProps {
  readonly addresses: readonly Address[];
  readonly selectedAddressId?: string | null;
  readonly loadingAddressIds?: ReadonlySet<string>;
  readonly emptyAction?: ReactNode;
  readonly onSelect: (
    address: Address
  ) => void;
  readonly onEdit?: (
    address: Address
  ) => void;
  readonly onDelete?: (
    address: Address
  ) => void;
}

export function AddressSelector({
 addresses,
 emptyAction,
 loadingAddressIds,
 onDelete,
 onEdit,

  onSelect,
  selectedAddressId,
}: AddressSelectorProps): React.JSX.Element {
  if (addresses.length === 0) {
    return (
      <EmptyState
       title="Add a delivery address"
       description="Your address is securely used to calculate availability, shipping and delivery
estimates."
       action={emptyAction}
      />
    );
  }

 return (
   <div className="grid gap-4 md:grid-cols-2">
    {addresses.map(
      (address) => (
        <AddressCard
         key={address.id}
         address={address}
         selected={
           address.id ===
           selectedAddressId
         }
         disabled={
           loadingAddressIds?.has(
             address.id
           ) ?? false
         }
         onSelect={onSelect}
         onEdit={onEdit}
         onDelete={onDelete}
        />
      )
    )}
   </div>
 );
}
