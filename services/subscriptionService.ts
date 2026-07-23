import { callableFunction } from "@/firebase/functions";

export interface SellerSubscription {
  readonly id: string;
  readonly studioId: string;
  readonly planId: string;
  readonly status:
   | "active"
   | "pastDue"
   | "cancelled"
   | "expired";
  readonly currentPeriodStart: string;
  readonly currentPeriodEnd: string;
  readonly cancelAtPeriodEnd: boolean;
}

interface CreateSubscriptionRequest {
  readonly studioId: string;
  readonly planId: string;
  readonly idempotencyKey: string;
}

interface CreateSubscriptionResponse {
  readonly subscription: SellerSubscription;

    readonly paymentOrderId: string;
}

interface CancelSubscriptionRequest {
  readonly subscriptionId: string;
  readonly cancelAtPeriodEnd: boolean;
  readonly reason?: string;
}

interface CancelSubscriptionResponse {
  readonly subscription: SellerSubscription;
}

const createSubscriptionCallable = callableFunction<
 CreateSubscriptionRequest,
 CreateSubscriptionResponse
>("createSellerSubscription");

const cancelSubscriptionCallable = callableFunction<
 CancelSubscriptionRequest,
 CancelSubscriptionResponse
>("cancelSellerSubscription");

export async function createSellerSubscription(
  input: CreateSubscriptionRequest
): Promise<CreateSubscriptionResponse> {
  const result =
    await createSubscriptionCallable(input);

    return result.data;
}

export async function cancelSellerSubscription(
  input: CancelSubscriptionRequest
): Promise<SellerSubscription> {
  const result =
    await cancelSubscriptionCallable(input);

    return result.data.subscription;
}
