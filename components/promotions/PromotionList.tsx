import type { ReactNode } from "react";

import { PromotionCard } from "@/components/promotions/PromotionCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Promotion } from "@/types/promotion";

interface PromotionListProps {
  readonly promotions: readonly Promotion[];
  readonly emptyAction?: ReactNode;
  readonly disabledPromotionIds?: ReadonlySet<string>;
  readonly onEdit?: (promotion: Promotion) => void;
  readonly onDuplicate?: (promotion: Promotion) => void;
  readonly onPause?: (promotion: Promotion) => void;
  readonly onActivate?: (promotion: Promotion) => void;
  readonly onArchive?: (promotion: Promotion) => void;
}

export function PromotionList({
  disabledPromotionIds,
  emptyAction,
  onActivate,
  onArchive,
  onDuplicate,
  onEdit,
  onPause,
  promotions,
}: PromotionListProps): React.JSX.Element {
  if (promotions.length === 0) {
    return (
      <EmptyState
        title="No promotions found"
        description="Create controlled offers for selected products, Studios or customer groups."
        action={emptyAction}
      />
    );
  }

  return (
    <section
      aria-label="Promotions"
      className="grid gap-5 xl:grid-cols-2"
    >
      {promotions.map((promotion) => (
        <PromotionCard
          key={promotion.id}
          promotion={promotion}
          disabled={
            disabledPromotionIds?.has(promotion.id) ??
            false
          }
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onPause={onPause}
          onActivate={onActivate}
          onArchive={onArchive}
        />
      ))}
    </section>
  );
}
