import { callableFunction } from "@/firebase/functions";
import type { CustomOrder } from "@/types/custom-order";

interface SubmitCustomOrderRequest {
  readonly categoryId: string;
  readonly title: string;
  readonly description: string;
  readonly quantity: number;
  readonly budgetMinimumPaise?: number;
  readonly budgetMaximumPaise?: number;
  readonly requiredBy?: string;
  readonly attachmentPaths: readonly string[];
}

interface SubmitCustomOrderResponse {
  readonly customOrder: CustomOrder;
}

const submitCustomOrderCallable = callableFunction<
 SubmitCustomOrderRequest,
 SubmitCustomOrderResponse
>("submitCustomOrder");

export async function submitCustomOrder(
  input: SubmitCustomOrderRequest
): Promise<CustomOrder> {
  const result = await submitCustomOrderCallable(input);

 return result.data.customOrder;
}
