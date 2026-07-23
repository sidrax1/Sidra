import type { BaseEntity } from "@/types/common";

export type PaymentProvider = "razorpay";

export type PaymentStatus =
 | "created"
 | "authorized"
 | "captured"
 | "failed"
 | "refunded"
 | "partiallyRefunded";

export interface Payment extends BaseEntity {
 readonly orderId: string;
 readonly customerId: string;
 readonly studioId: string;
 readonly provider: PaymentProvider;
 readonly providerOrderId: string;
 readonly providerPaymentId?: string;
 readonly providerSignature?: string;
 readonly currency: "INR";
 readonly amountPaise: number;

 readonly refundedAmountPaise: number;
 readonly status: PaymentStatus;
 readonly failureCode?: string;
 readonly failureMessage?: string;
 readonly capturedAt?: string;
 readonly failedAt?: string;
 readonly refundedAt?: string;
}
