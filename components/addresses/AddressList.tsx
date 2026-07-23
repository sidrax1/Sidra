import type {
  ReactNode,
} from "react";

import {
  AddressCard,
  type CustomerAddress,
} from "@/components/addresses/AddressCard";
import { EmptyState } from "@/components/ui/EmptyState";

interface AddressListProps {
  readonly addresses: readonly CustomerAddress[];
  readonly selectedAddressId?: string | null;
  readonly disabled?: boolean;
  readonly emptyAction?: ReactNode;
  readonly onSelect?: (
    address: CustomerAddress
  ) => void;
  readonly onEdit?: (
    address: CustomerAddress
  ) => void;
  readonly onDelete?: (
    address: CustomerAddress
  ) => void;
  readonly onSetDefault?: (
    address: CustomerAddress
  ) => void | Promise<void>;
}

export function AddressList({
  addresses,
  disabled = false,
  emptyAction,
  onDelete,
  onEdit,
  onSelect,
  onSetDefault,
  selectedAddressId,
}: AddressListProps): React.JSX.Element {
  if (addresses.length === 0) {
    return (
      <EmptyState
        title="No saved addresses"
        description="Add a delivery address to make future checkout experiences faster."
        action={emptyAction}
      />
    );
  }

  return (
    <section
      aria-label="Saved addresses"
      className="grid gap-4 md:grid-cols-2"
    >
      {addresses.map((address) => (
        <AddressCard
          key={address.id}
          address={address}
          selected={
            selectedAddressId ===
            address.id
          }
          disabled={disabled}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
          onSetDefault={
            onSetDefault
          }
        />
      ))}
    </section>
  );
}
