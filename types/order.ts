import type { BaseEntity } from "@/types/common";

export type OrderStatus =
  | "pending"
  | "paymentPending"
  | "confirmed"
  | "processing"
  | "readyToShip"
  | "shipped"
  | "outForDelivery"
  | "delivered"
  | "cancelled"
  | "returnRequested"
  | "returnApproved"
  | "returned"
  | "refundPending"
  | "refunded"
  | "partiallyRefunded";

export type OrderPaymentStatus =
  | "pending"
  | "authorized"
  | "paid"
  | "failed"
  | "partiallyRefunded"
  | "refunded";

export type OrderFulfilmentStatus =
  | "unfulfilled"
  | "processing"
  | "packed"
  | "shipped"
  | "delivered"
  | "returned";

export type OrderCancellationActor =
  | "customer"
  | "seller"
  | "admin"
  | "system";

export interface OrderMoney {
  readonly currency: "INR";
  readonly amountPaise: number;
}

export interface OrderProductSnapshot {
  readonly productId: string;
  readonly studioId: string;
  readonly title: string;
  readonly slug: string;
  readonly studioName: string;
  readonly imageURL?: string | null;
  readonly sku?: string;
  readonly categoryId: string;
  readonly unitPricePaise: number;
  readonly taxRateBasisPoints: number;
}

export interface OrderItemCustomization {
  readonly label: string;
  readonly value: string;
}

export interface OrderItem extends BaseEntity {
  readonly orderId: string;
  readonly product: OrderProductSnapshot;
  readonly quantity: number;
  readonly unitPricePaise: number;
  readonly subtotalPaise: number;
  readonly discountPaise: number;
  readonly taxPaise: number;
  readonly totalPaise: number;
  readonly customizations: readonly OrderItemCustomization[];
  readonly customerNote?: string;
  readonly returnEligibleUntil?: string;
}

export interface OrderAddressSnapshot {
  readonly fullName: string;
  readonly mobile: string;
  readonly line1: string;
  readonly line2?: string;
  readonly landmark?: string;
  readonly city: string;
  readonly state: string;
  readonly postalCode: string;
  readonly country: "India";
}

export interface OrderPricing {
  readonly itemsSubtotalPaise: number;
  readonly discountPaise: number;
  readonly shippingPaise: number;
  readonly taxPaise: number;
  readonly platformFeePaise: number;
  readonly giftWrapPaise: number;
  readonly totalPaise: number;
  readonly refundedPaise: number;
}

export interface OrderShipment {
  readonly carrier?: string;
  readonly trackingNumber?: string;
  readonly trackingURL?: string;
  readonly packageCount: number;
  readonly dispatchedAt?: string;
  readonly estimatedDeliveryDate?: string;
  readonly deliveredAt?: string;
}

export interface OrderCancellation {
  readonly actor: OrderCancellationActor;
  readonly actorId: string;
  readonly reason: string;
  readonly explanation?: string;
  readonly cancelledAt: string;
}

export interface Order extends BaseEntity {
  readonly orderNumber: string;
  readonly customerId: string;
  readonly customerEmail: string;
  readonly studioId: string;
  readonly studioName: string;
  readonly status: OrderStatus;
  readonly paymentStatus: OrderPaymentStatus;
  readonly fulfilmentStatus: OrderFulfilmentStatus;
  readonly items: readonly OrderItem[];
  readonly itemCount: number;
  readonly pricing: OrderPricing;
  readonly shippingAddress: OrderAddressSnapshot;
  readonly billingAddress: OrderAddressSnapshot;
  readonly shipment?: OrderShipment;
  readonly cancellation?: OrderCancellation;
  readonly couponCode?: string;
  readonly customerNote?: string;
  readonly giftMessage?: string;
  readonly placedAt: string;
  readonly confirmedAt?: string;
  readonly completedAt?: string;
}

export type OrderTimelineEventType =
  | "orderPlaced"
  | "paymentAuthorized"
  | "paymentConfirmed"
  | "orderConfirmed"
  | "productionStarted"
  | "orderPacked"
  | "shipmentCreated"
  | "orderShipped"
  | "outForDelivery"
  | "orderDelivered"
  | "cancellationRequested"
  | "orderCancelled"
  | "returnRequested"
  | "returnApproved"
  | "returnReceived"
  | "refundInitiated"
  | "refundCompleted";

export interface OrderTimelineEvent extends BaseEntity {
  readonly orderId: string;
  readonly type: OrderTimelineEventType;
  readonly title: string;
  readonly description?: string;
  readonly actorId: string;
  readonly actorRole: string;
  readonly customerVisible: boolean;
  readonly metadata?: Readonly<Record<string, unknown>>;
}
