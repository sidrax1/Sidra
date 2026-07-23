import type { BaseEntity } from "@/types/common";

export type GiftCardStatus =
  | "pending"
  | "active"
  | "partiallyUsed"
  | "redeemed"
  | "expired"
  | "cancelled"
  | "disabled";

export type GiftCardDeliveryStatus =
  | "scheduled"
  | "sent"
  | "delivered"
  | "failed";

export interface GiftCardDesign {
  readonly id: string;
  readonly name: string;
  readonly imageURL: string;
  readonly thumbnailURL?: string;
  readonly active: boolean;
}

export interface GiftCard extends BaseEntity {
  readonly codeMasked: string;
  readonly codeHash: string;
  readonly purchaserId: string;
  readonly purchaserEmail: string;
  readonly recipientName: string;
  readonly recipientEmail: string;
  readonly message?: string;
  readonly designId: string;
  readonly originalValuePaise: number;
  readonly remainingValuePaise: number;
  readonly currency: "INR";
  readonly status: GiftCardStatus;
  readonly deliveryStatus: GiftCardDeliveryStatus;
  readonly scheduledDeliveryAt?: string;
  readonly sentAt?: string;
  readonly activatedAt?: string;
  readonly expiresAt: string;
}

export interface GiftCardTransaction extends BaseEntity {
  readonly giftCardId: string;
  readonly orderId?: string;
  readonly customerId: string;
  readonly type:
    | "purchase"
    | "activation"
    | "redemption"
    | "refund"
    | "manualAdjustment"
    | "expiration";
  readonly amountPaise: number;
  readonly balanceBeforePaise: number;
  readonly balanceAfterPaise: number;
  readonly description: string;
}
