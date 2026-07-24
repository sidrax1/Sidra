import type { BaseEntity } from "@/types/common";

export interface Cart extends BaseEntity {
 readonly userId: string;
 readonly items: readonly CartItem[];
 readonly totalItems: number;
 readonly subtotal: number;
}

export interface CartItem extends BaseEntity {
 readonly userId: string;

 readonly productId: string;
 readonly studioId: string;

 readonly quantity: number;

 readonly unitPrice: number;
 readonly totalPrice: number;

 readonly variantId?: string;

 readonly addedAt: string;
}
