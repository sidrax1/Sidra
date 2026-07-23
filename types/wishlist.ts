import type { BaseEntity } from "@/types/common";

export interface WishlistItem extends BaseEntity {
 readonly userId: string;

 readonly productId: string;

  readonly createdAt: string;
}
