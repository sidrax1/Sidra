import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { COLLECTIONS } from "@/constants/collections";
import { callableFunction } from "@/firebase/functions";
import { getFirebaseFirestore } from "@/firebase/firestore";
import type {
  Payout,
  PayoutStatus,
} from "@/types/payout";

interface ApprovePayoutRequest {
  readonly payoutId: string;
}

interface ApprovePayoutResponse {
  readonly payout: Payout;
}

interface ProcessPayoutRequest {
  readonly payoutId: string;

    readonly idempotencyKey: string;
}

interface ProcessPayoutResponse {
  readonly payout: Payout;
}

const approvePayoutCallable =
 callableFunction<
  ApprovePayoutRequest,
  ApprovePayoutResponse
 >("approvePayout");

const processPayoutCallable =
 callableFunction<
  ProcessPayoutRequest,
  ProcessPayoutResponse
 >("processPayout");

export async function approvePayout(
  payoutId: string
): Promise<Payout> {
  const result =
   await approvePayoutCallable({
     payoutId,
   });

    return result.data.payout;
}

export async function processPayout(
  input: ProcessPayoutRequest
): Promise<Payout> {
  const result =
    await processPayoutCallable(
      input
    );

    return result.data.payout;
}

export async function getStudioPayouts(
 studioId: string,
 status?: PayoutStatus,

  maximumResults = 50
): Promise<Payout[]> {
  const collectionReference =
   collection(
     getFirebaseFirestore(),
     COLLECTIONS.PAYOUTS
   );

 const payoutQuery = status
  ? query(
      collectionReference,
      where(
        "studioId",
        "==",
        studioId
      ),
      where(
        "status",
        "==",
        status
      ),
      orderBy("createdAt", "desc"),
      limit(maximumResults)
    )
  : query(
      collectionReference,
      where(
        "studioId",
        "==",
        studioId
      ),
      orderBy("createdAt", "desc"),
      limit(maximumResults)
    );

 const snapshot =
  await getDocs(payoutQuery);

 return snapshot.docs.map(
  (payoutDocument) =>
    ({
      id: payoutDocument.id,
      ...payoutDocument.data(),
    }) as Payout

 );
}
