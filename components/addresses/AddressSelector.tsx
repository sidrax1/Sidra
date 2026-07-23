"use client";

import {
  CheckCircle2,
} from "lucide-react";

import {
  AddressCard,
  type CustomerAddress,
} from "@/components/addresses/AddressCard";
import { cn } from "@/lib/utils";

interface AddressSelectorProps {
  readonly addresses: readonly CustomerAddress[];
  readonly selectedAddressId?: string | null;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly onChange: (
    address: CustomerAddress
  ) => void;
}

export function AddressSelector({
  addresses,
  className,
  disabled = false,
  onChange,
  selectedAddressId,
}: AddressSelectorProps): React.JSX.Element {
  return (
    <fieldset
      disabled={disabled}
      className={cn(
        "grid gap-4",
        className
      )}
    >
      <legend className="mb-4 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
        Delivery Address
      </legend>

      {addresses.map((address) => {
        const selected =
          address.id ===
          selectedAddressId;

        return (
          <div
            key={address.id}
            className="relative"
          >
            {selected ? (
              <span className="absolute right-4 top-4 z-10 flex size-7 items-center justify-center rounded-full bg-[var(--color-gold-500)] text-[var(--color-black-900)]">
                <CheckCircle2
                  aria-hidden={true}
                  className="size-4"
                />
              </span>
            ) : null}

            <AddressCard
              address={address}
              selected={selected}
              disabled={disabled}
              onSelect={onChange}
            />
          </div>
        );
      })}
    </fieldset>
  );
}
