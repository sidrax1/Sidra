import type { ReactNode } from "react";

import { AddressCard } from "@/components/account/AddressCard";
import { ContentGrid } from "@/components/layout/ContentGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Address } from "@/types/address";

interface AddressGridProps {
  readonly addresses: readonly Address[];
  readonly emptyAction?: ReactNode;
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

export function AddressGrid({
  addresses,
  emptyAction,
  onDelete,
  onEdit,
  onSetDefault,
}: AddressGridProps): React.JSX.Element {
  if (addresses.length === 0) {
    return (
      <EmptyState
       title="No saved addresses"
       description="Add a delivery address to make checkout faster and more secure."
       action={emptyAction}
      />
    );
  }

    return (
      <ContentGrid columns={2}>
       {addresses.map((address) => (
         <AddressCard
           key={address.id}
           address={address}
           onEdit={onEdit}
           onDelete={onDelete}
           onSetDefault={
             onSetDefault
           }
         />
       ))}
      </ContentGrid>
    );
}
