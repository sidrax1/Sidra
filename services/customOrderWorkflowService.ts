import { callableFunction } from "@/firebase/functions";
import type {
  CustomOrderDecisionInput,
  CustomOrderDeliveryConfirmationInput,
  CustomOrderDispatchInput,
  CustomOrderProductionUpdateInput,
  CustomOrderQuoteInput,
  CustomOrderQuoteRevisionInput,
} from "@/lib/schemas/custom-order-workflow";
import type { CustomOrder } from "@/types/custom-order";
import type {
  CustomOrderPaymentRecord,
  CustomOrderProductionUpdate,
  CustomOrderQuote,
} from "@/types/custom-order-workflow";

interface CustomOrderResponse {
  readonly customOrder: CustomOrder;
}

interface QuoteResponse {
  readonly quote: CustomOrderQuote;
  readonly customOrder: CustomOrder;
}

interface ProductionUpdateResponse {
  readonly update: CustomOrderProductionUpdate;
  readonly customOrder: CustomOrder;
}

interface AcceptQuoteRequest {
  readonly customOrderId: string;
  readonly quoteId: string;
}

interface AcceptQuoteResponse {
  readonly customOrder: CustomOrder;
  readonly quote: CustomOrderQuote;
  readonly payment: CustomOrderPaymentRecord;
}

interface CancelCustomOrderRequest {
  readonly customOrderId: string;
  readonly reason: string;
  readonly explanation: string;
  readonly notifyCustomer: boolean;
}

const submitDecisionCallable = callableFunction<
  CustomOrderDecisionInput,
  CustomOrderResponse
>("reviewCustomOrderRequest");

const submitQuoteCallable = callableFunction<
  CustomOrderQuoteInput,
  QuoteResponse
>("submitCustomOrderQuote");

const requestQuoteRevisionCallable = callableFunction<
  CustomOrderQuoteRevisionInput,
  QuoteResponse
>("requestCustomOrderQuoteRevision");

const acceptQuoteCallable = callableFunction<
  AcceptQuoteRequest,
  AcceptQuoteResponse
>("acceptCustomOrderQuote");

const publishProductionUpdateCallable = callableFunction<
  CustomOrderProductionUpdateInput,
  ProductionUpdateResponse
>("publishCustomOrderProductionUpdate");

const dispatchCustomOrderCallable = callableFunction<
  CustomOrderDispatchInput,
  CustomOrderResponse
>("dispatchCustomOrder");

const confirmDeliveryCallable = callableFunction<
  CustomOrderDeliveryConfirmationInput,
  CustomOrderResponse
>("confirmCustomOrderDelivery");

const cancelCustomOrderCallable = callableFunction<
  CancelCustomOrderRequest,
  CustomOrderResponse
>("cancelCustomOrder");

export async function reviewCustomOrderRequest(
  input: CustomOrderDecisionInput
): Promise<CustomOrder> {
  const result = await submitDecisionCallable(input);
  return result.data.customOrder;
}

export async function submitCustomOrderQuote(
  input: CustomOrderQuoteInput
): Promise<QuoteResponse> {
  const result = await submitQuoteCallable(input);
  return result.data;
}

export async function requestCustomOrderQuoteRevision(
  input: CustomOrderQuoteRevisionInput
): Promise<QuoteResponse> {
  const result = await requestQuoteRevisionCallable(input);
  return result.data;
}

export async function acceptCustomOrderQuote(
  input: AcceptQuoteRequest
): Promise<AcceptQuoteResponse> {
  const result = await acceptQuoteCallable(input);
  return result.data;
}

export async function publishCustomOrderProductionUpdate(
  input: CustomOrderProductionUpdateInput
): Promise<ProductionUpdateResponse> {
  const result =
    await publishProductionUpdateCallable(input);

  return result.data;
}

export async function dispatchCustomOrder(
  input: CustomOrderDispatchInput
): Promise<CustomOrder> {
  const result = await dispatchCustomOrderCallable(input);
  return result.data.customOrder;
}

export async function confirmCustomOrderDelivery(
  input: CustomOrderDeliveryConfirmationInput
): Promise<CustomOrder> {
  const result = await confirmDeliveryCallable(input);
  return result.data.customOrder;
}

export async function cancelCustomOrder(input: {
  readonly customOrderId: string;
  readonly reason: string;
  readonly explanation: string;
  readonly notifyCustomer: boolean;
}): Promise<CustomOrder> {
  const result = await cancelCustomOrderCallable(input);
  return result.data.customOrder;
}
