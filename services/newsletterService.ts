import { callableFunction } from "@/firebase/functions";

interface SubscribeNewsletterRequest {
  readonly email: string;
  readonly source: string;
  readonly consent: true;
}

interface SubscribeNewsletterResponse {
  readonly subscribed: boolean;
  readonly subscriberId: string;
}

interface UnsubscribeNewsletterRequest {
  readonly email: string;

    readonly token: string;
}

interface UnsubscribeNewsletterResponse {
  readonly unsubscribed: boolean;
}

const subscribeCallable = callableFunction<
 SubscribeNewsletterRequest,
 SubscribeNewsletterResponse
>("subscribeNewsletter");

const unsubscribeCallable = callableFunction<
 UnsubscribeNewsletterRequest,
 UnsubscribeNewsletterResponse
>("unsubscribeNewsletter");

export async function subscribeNewsletter(
  input: SubscribeNewsletterRequest
): Promise<SubscribeNewsletterResponse> {
  const result =
    await subscribeCallable(input);

    return result.data;
}

export async function unsubscribeNewsletter(
  input: UnsubscribeNewsletterRequest
): Promise<boolean> {
  const result =
    await unsubscribeCallable(input);

    return result.data.unsubscribed;
}
