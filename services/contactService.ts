import { callableFunction } from "@/firebase/functions";

export interface SubmitContactRequest {

    readonly fullName: string;
    readonly email: string;
    readonly phone?: string;
    readonly subject: string;
    readonly message: string;
    readonly consent: true;
}

interface SubmitContactResponse {
  readonly requestId: string;
  readonly referenceNumber: string;
  readonly submitted: boolean;
}

const submitContactCallable = callableFunction<
 SubmitContactRequest,
 SubmitContactResponse
>("submitContactRequest");

export async function submitContactRequest(
  input: SubmitContactRequest
): Promise<SubmitContactResponse> {
  const result =
    await submitContactCallable(input);

    return result.data;
}
