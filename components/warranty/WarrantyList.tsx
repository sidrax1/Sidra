import type {
  ReactNode,
} from "react";

import { WarrantyCard } from "@/components/warranty/WarrantyCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type {
  ProductWarranty,
} from "@/types/warranty";

interface WarrantyListProps {
  readonly warranties: readonly ProductWarranty[];
  readonly emptyAction?: ReactNode;
  readonly loadingWarrantyIds?: ReadonlySet<string>;
  readonly onOpen: (
    warranty: ProductWarranty
  ) => void;
  readonly onRegister?: (
    warranty: ProductWarranty
  ) => void;
  readonly onCreateClaim?: (
    warranty: ProductWarranty
  ) => void;
  readonly onTransfer?: (
    warranty: ProductWarranty
  ) => void;
  readonly onVoid?: (
    warranty: ProductWarranty
  ) => void;
}

export function WarrantyList({
  emptyAction,
  loadingWarrantyIds,
  onCreateClaim,
  onOpen,
  onRegister,
  onTransfer,
  onVoid,
  warranties,
}: WarrantyListProps): React.JSX.Element {
  if (warranties.length === 0) {
    return (
      <EmptyState
        title="No warranties found"
        description="Product protection plans and registered warranties will appear here."
        action={emptyAction}
      />
    );
  }

  const statusWeight: Record<
    ProductWarranty["status"],
    number
  > = {
    claimInProgress: 6,
    active: 5,
    transferred: 4,
    fulfilled: 3,
    expired: 2,
    void: 1,
  };

  const orderedWarranties = [
    ...warranties,
  ].sort((first, second) => {
    const statusDifference =
      statusWeight[second.status] -
      statusWeight[first.status];

    if (statusDifference !== 0) {
      return statusDifference;
    }

    return first.expiresAt.localeCompare(
      second.expiresAt
    );
  });

  return (
    <section
      aria-label="Product warranties"
      className="grid gap-5 xl:grid-cols-2"
    >
      {orderedWarranties.map(
        (warranty) => (
          <WarrantyCard
            key={warranty.id}
            warranty={warranty}
            loading={
              loadingWarrantyIds?.has(
                warranty.id
              ) ?? false
            }
            onOpen={onOpen}
            onRegister={onRegister}
            onCreateClaim={
              onCreateClaim
            }
            onTransfer={
              onTransfer
            }
            onVoid={onVoid}
          />
        )
      )}
    </section>
  );
}
