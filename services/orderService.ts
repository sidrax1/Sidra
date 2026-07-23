import {
  collection,
  documentId,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  type DocumentData,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { doc } from "firebase/firestore";

import { db } from "@/firebase/client";
import { callableFunction } from "@/firebase/functions";
import type {
  OrderCancellationInput,
  OrderDeliveryConfirmationInput,
  OrderNoteInput,
  OrderShipmentInput,
  OrderStatusUpdateInput,
  ReturnDecisionInput,
  ReturnRequestInput,
} from "@/lib/schemas/order";
import type {
  Order,
  OrderStatus,
  OrderTimelineEvent,
} from "@/types/order";

interface OrderMutationResponse {
  readonly order: Order;
}

interface CreateOrderPaymentRequest {
  readonly orderId: string;
}

interface CreateOrderPaymentResponse {
  readonly orderId: string;
  readonly gatewayOrderId: string;
  readonly amountPaise: number;
  readonly currency: "INR";
  readonly publicKey: string;
}

interface VerifyOrderPaymentRequest {
  readonly orderId: string;
  readonly gatewayOrderId: string;
  readonly gatewayPaymentId: string;
  readonly gatewaySignature: string;
}

interface ReturnRequestResponse {
  readonly returnRequestId: string;
  readonly order: Order;
}

interface OrderPage {
  readonly orders: readonly Order[];
  readonly cursor: QueryDocumentSnapshot<DocumentData> | null;
  readonly hasMore: boolean;
}

export interface OrderListFilters {
  readonly customerId?: string;
  readonly studioId?: string;
  readonly statuses?: readonly OrderStatus[];
  readonly pageSize?: number;
  readonly cursor?: QueryDocumentSnapshot<DocumentData> | null;
}

const createPaymentCallable = callableFunction<
  CreateOrderPaymentRequest,
  CreateOrderPaymentResponse
>("createOrderPayment");

const verifyPaymentCallable = callableFunction<
  VerifyOrderPaymentRequest,
  OrderMutationResponse
>("verifyOrderPayment");

const cancelOrderCallable = callableFunction<
  OrderCancellationInput,
  OrderMutationResponse
>("cancelOrder");

const updateOrderStatusCallable = callableFunction<
  OrderStatusUpdateInput,
  OrderMutationResponse
>("updateOrderStatus");

const createShipmentCallable = callableFunction<
  OrderShipmentInput,
  OrderMutationResponse
>("createOrderShipment");

const confirmDeliveryCallable = callableFunction<
  OrderDeliveryConfirmationInput,
  OrderMutationResponse
>("confirmOrderDelivery");

const createReturnRequestCallable = callableFunction<
  ReturnRequestInput,
  ReturnRequestResponse
>("createReturnRequest");

const decideReturnRequestCallable = callableFunction<
  ReturnDecisionInput,
  ReturnRequestResponse
>("decideReturnRequest");

const addOrderNoteCallable = callableFunction<
  OrderNoteInput,
  { readonly event: OrderTimelineEvent }
>("addOrderNote");

function assertIdentifier(value: string, label: string): void {
  if (!value.trim()) {
    throw new Error(`${label} is required.`);
  }
}

export async function getOrderById(
  orderId: string
): Promise<Order | null> {
  assertIdentifier(orderId, "Order ID");

  const snapshot = await getDoc(doc(db, "orders", orderId));

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Order;
}

export async function getOrderByNumber(
  orderNumber: string
): Promise<Order | null> {
  assertIdentifier(orderNumber, "Order number");

  const snapshot = await getDocs(
    query(
      collection(db, "orders"),
      where("orderNumber", "==", orderNumber.trim()),
      limit(1)
    )
  );

  const orderDocument = snapshot.docs.at(0);

  if (!orderDocument) {
    return null;
  }

  return {
    id: orderDocument.id,
    ...orderDocument.data(),
  } as Order;
}

export async function getOrders(
  filters: OrderListFilters
): Promise<OrderPage> {
  if (!filters.customerId && !filters.studioId) {
    throw new Error(
      "Customer ID or Studio ID is required to query orders."
    );
  }

  const pageSize = Math.min(
    Math.max(filters.pageSize ?? 20, 1),
    50
  );

  const constraints: QueryConstraint[] = [];

  if (filters.customerId) {
    constraints.push(
      where("customerId", "==", filters.customerId)
    );
  }

  if (filters.studioId) {
    constraints.push(where("studioId", "==", filters.studioId));
  }

  if (filters.statuses && filters.statuses.length > 0) {
    constraints.push(
      where(
        "status",
        "in",
        filters.statuses.slice(0, 10)
      )
    );
  }

  constraints.push(orderBy("placedAt", "desc"));

  if (filters.cursor) {
    constraints.push(startAfter(filters.cursor));
  }

  constraints.push(limit(pageSize + 1));

  const snapshot = await getDocs(
    query(collection(db, "orders"), ...constraints)
  );

  const documents = snapshot.docs.slice(0, pageSize);

  return {
    orders: documents.map(
      (orderDocument) =>
        ({
          id: orderDocument.id,
          ...orderDocument.data(),
        }) as Order
    ),
    cursor: documents.at(-1) ?? null,
    hasMore: snapshot.docs.length > pageSize,
  };
}

export async function getOrdersByIds(
  orderIds: readonly string[]
): Promise<readonly Order[]> {
  const uniqueOrderIds = [...new Set(orderIds.filter(Boolean))];

  if (uniqueOrderIds.length === 0) {
    return [];
  }

  const batches: string[][] = [];

  for (let index = 0; index < uniqueOrderIds.length; index += 30) {
    batches.push(uniqueOrderIds.slice(index, index + 30));
  }

  const snapshots = await Promise.all(
    batches.map((batch) =>
      getDocs(
        query(
          collection(db, "orders"),
          where(documentId(), "in", batch)
        )
      )
    )
  );

  return snapshots.flatMap((snapshot) =>
    snapshot.docs.map(
      (orderDocument) =>
        ({
          id: orderDocument.id,
          ...orderDocument.data(),
        }) as Order
    )
  );
}

export async function getOrderTimeline(
  orderId: string
): Promise<readonly OrderTimelineEvent[]> {
  assertIdentifier(orderId, "Order ID");

  const snapshot = await getDocs(
    query(
      collection(db, "orders", orderId, "timeline"),
      orderBy("createdAt", "asc")
    )
  );

  return snapshot.docs.map(
    (timelineDocument) =>
      ({
        id: timelineDocument.id,
        ...timelineDocument.data(),
      }) as OrderTimelineEvent
  );
}

export async function createOrderPayment(
  orderId: string
): Promise<CreateOrderPaymentResponse> {
  const result = await createPaymentCallable({ orderId });
  return result.data;
}

export async function verifyOrderPayment(
  input: VerifyOrderPaymentRequest
): Promise<Order> {
  const result = await verifyPaymentCallable(input);
  return result.data.order;
}

export async function cancelOrder(
  input: OrderCancellationInput
): Promise<Order> {
  const result = await cancelOrderCallable(input);
  return result.data.order;
}

export async function updateOrderStatus(
  input: OrderStatusUpdateInput
): Promise<Order> {
  const result = await updateOrderStatusCallable(input);
  return result.data.order;
}

export async function createOrderShipment(
  input: OrderShipmentInput
): Promise<Order> {
  const result = await createShipmentCallable(input);
  return result.data.order;
}

export async function confirmOrderDelivery(
  input: OrderDeliveryConfirmationInput
): Promise<Order> {
  const result = await confirmDeliveryCallable(input);
  return result.data.order;
}

export async function createReturnRequest(
  input: ReturnRequestInput
): Promise<ReturnRequestResponse> {
  const result = await createReturnRequestCallable(input);
  return result.data;
}

export async function decideReturnRequest(
  input: ReturnDecisionInput
): Promise<ReturnRequestResponse> {
  const result = await decideReturnRequestCallable(input);
  return result.data;
}

export async function addOrderNote(
  input: OrderNoteInput
): Promise<OrderTimelineEvent> {
  const result = await addOrderNoteCallable(input);
  return result.data.event;
}
