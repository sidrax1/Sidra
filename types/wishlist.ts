import type { BaseEntity } from "@/types/common";

export interface Wishlist extends BaseEntity {
 readonly userId: string;
 readonly items: readonly Pick<WishlistItem, "productId" | "addedAt">[];
 readonly totalItems: number;
}

export interface WishlistItem extends BaseEntity {
 readonly userId: string;

 readonly productId: string;

  readonly createdAt: string;
}
