import { callableFunction } from "@/firebase/functions";
import type { Payment } from "@/types/payment";

interface VerifyPaymentRequest {
  readonly orderId: string;
  readonly providerOrderId: string;
  readonly providerPaymentId: string;
  readonly providerSignature: string;
}

interface VerifyPaymentResponse {
  readonly payment: Payment;
  readonly orderStatus: string;
}

interface RequestRefundRequest {
  readonly paymentId: string;
  readonly amountPaise?: number;
  readonly reason: string;
}

interface RequestRefundResponse {
  readonly payment: Payment;
}

const verifyPaymentCallable = callableFunction<
 VerifyPaymentRequest,
 VerifyPaymentResponse
>("verifyPayment");

const requestRefundCallable = callableFunction<
 RequestRefundRequest,
 RequestRefundResponse
>("requestRefund");

export async function verifyPayment(

  input: VerifyPaymentRequest
): Promise<VerifyPaymentResponse> {
  const result = await verifyPaymentCallable(input);

    return result.data;
}

export async function requestRefund(
  input: RequestRefundRequest
): Promise<Payment> {
  const result = await requestRefundCallable(input);

  return result.data.payment;
}
