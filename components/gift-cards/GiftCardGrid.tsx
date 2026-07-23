import type { ReactNode } from "react";

import { GiftCardCard } from "@/components/gift-cards/GiftCardCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type {
  GiftCard,
  GiftCardDesign,
} from "@/types/gift-card";

export interface GiftCardGridItem {
  readonly giftCard: GiftCard;
  readonly design?: GiftCardDesign;
}

interface GiftCardGridProps {
  readonly items: readonly GiftCardGridItem[];
  readonly emptyAction?: ReactNode;
}

export function GiftCardGrid({
  emptyAction,
  items,
}: GiftCardGridProps): React.JSX.Element {
  if (items.length === 0) {
    return (
      <EmptyState
        title="No gift cards"
        description="Purchased and received Sydra gift cards will appear here."
        action={emptyAction}
      />
    );
  }

  return (
    <section
      aria-label="Gift cards"
      className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
    >
      {items.map((item) => (
        <GiftCardCard
          key={item.giftCard.id}
          giftCard={item.giftCard}
          design={item.design}
        />
      ))}
    </section>
  );
}
