import {
  EmptyState,
} from "@/components/ui/EmptyState";
import type {
  WarrantyClaim,
} from "@/types/warranty";
import {
  WarrantyClaimCard,
} from "./WarrantyClaimCard";

interface WarrantyClaimListProps {
  readonly claims: readonly WarrantyClaim[];
  readonly onOpen: (
    claim: WarrantyClaim
  ) => void;
}

export function WarrantyClaimList({
  claims,
  onOpen,
}: WarrantyClaimListProps): React.JSX.Element {
  if (claims.length === 0) {
    return (
      <EmptyState
        title="No warranty claims"
        description="Warranty requests will appear here."
      />
    );
  }

  return (
    <div className="grid gap-5">
      {claims.map((claim) => (
        <WarrantyClaimCard
          key={claim.id}
          claim={claim}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}
