import {

  HttpsError,
  onCall,
} from "firebase-functions/v2/https";

import {
  requireAuthenticatedActor,
} from "../servicePartnerRepository";
import {
  hasPermission,
} from "../servicePartnerAuthorization";
import {
  firestore,
} from "../servicePartnerRepository";
import {
  serializeServicePartnerWallet,
  servicePartnerWalletReference,
} from "./servicePartnerWalletRepository";
import type {
  ServicePartnerWalletDocument,
} from "./servicePartnerWalletTypes";

interface GetServicePartnerPayoutRequestInput {
  readonly payoutId: string;
}

interface ServicePartnerPayoutRequestDocument {
  readonly payoutNumber: string;
  readonly walletId: string;
  readonly partnerId: string;
  readonly partnerNumber: string;
  readonly partnerName: string;
  readonly applicantUserId: string;
  readonly status:
   | "requested"
   | "approved"
   | "rejected"
   | "processing"
   | "completed"
   | "failed"
   | "cancelled";
  readonly currency: "INR";
  readonly amountPaise: number;
  readonly payoutMethod:
   | "bankTransfer"

     | "upi"
     | "manualBankTransfer";
    readonly accountReference: string;
    readonly requestNote?: string;
    readonly idempotencyKey: string;
    readonly walletEntryId: string;
    readonly requestedBy: string;
    readonly requestedAt: FirebaseFirestore.Timestamp;
    readonly approvedBy?: string;
    readonly approvedAt?: FirebaseFirestore.Timestamp;
    readonly approvalNote?: string;
    readonly rejectedBy?: string;
    readonly rejectedAt?: FirebaseFirestore.Timestamp;
    readonly rejectionReason?: string;
    readonly processingStartedBy?: string;
    readonly processingStartedAt?: FirebaseFirestore.Timestamp;
    readonly processingNote?: string;
    readonly paymentProvider?: string;
    readonly providerRequestId?: string;
    readonly paymentReference?: string;
    readonly completedBy?: string;
    readonly completedAt?: FirebaseFirestore.Timestamp;
    readonly completionNote?: string;
    readonly failedBy?: string;
    readonly failedAt?: FirebaseFirestore.Timestamp;
    readonly failureReason?: string;
    readonly cancelledBy?: string;
    readonly cancelledAt?: FirebaseFirestore.Timestamp;
    readonly cancellationReason?: string;
    readonly retryCount?: number;
    readonly lastRetryBy?: string;
    readonly lastRetryAt?: FirebaseFirestore.Timestamp;
    readonly reservedFundsReleased?: boolean;
    readonly createdAt: FirebaseFirestore.Timestamp;
    readonly updatedAt: FirebaseFirestore.Timestamp;
}

function serializeOptionalTimestamp(
  value?: FirebaseFirestore.Timestamp
): string | undefined {
  return value
   ? value
       .toDate()
       .toISOString()

    : undefined;
}

export const getServicePartnerPayoutRequest =
 onCall(
  {
    region: "asia-south1",
    enforceAppCheck: true,
    cors: true,
    timeoutSeconds: 60,
    memory: "512MiB",
  },
  async (request) => {
    const actor =
      requireAuthenticatedActor(
        request
      );

     const input =
      request.data as Partial<GetServicePartnerPayoutRequestInput>;

     const payoutId =
      typeof input.payoutId ===
      "string"
        ? input.payoutId.trim()
        : "";

     if (!payoutId) {
       throw new HttpsError(
         "invalid-argument",
         "Payout request ID is required."
       );
     }

     const payoutSnapshot =
      await firestore
       .collection(
         "servicePartnerPayoutRequests"
       )
       .doc(payoutId)
       .get();

     if (!payoutSnapshot.exists) {
       throw new HttpsError(

      "not-found",
      "Service-partner payout request was not found."
    );
}

const payout =
 payoutSnapshot.data() as ServicePartnerPayoutRequestDocument;

const privileged =
 hasPermission(
   actor,
   "servicePartners.readPayouts"
 ) ||
 hasPermission(
   actor,
   "servicePartners.manageWallets"
 ) ||
 hasPermission(
   actor,
   "servicePartners.processPayouts"
 );

if (
  !privileged &&
  payout.applicantUserId !==
     actor.uid
){
  throw new HttpsError(
     "permission-denied",
     "You are not authorised to view this payout request."
  );
}

const [
  walletSnapshot,
  eventSnapshot,
] = await Promise.all([
  servicePartnerWalletReference(
    payout.partnerId
  ).get(),
  firestore
    .collection(
      "servicePartnerPayoutEvents"
    )

      .where(
        "payoutId",
        "==",
        payoutId
      )
      .orderBy(
        "processedAt",
        "desc"
      )
      .limit(100)
      .get(),
]);

const wallet =
 walletSnapshot.exists
  ? (walletSnapshot.data() as ServicePartnerWalletDocument)
  : null;

return {
 payout: {
   id:
     payoutSnapshot.id,
   ...payout,
   requestedAt:
     payout.requestedAt
       .toDate()
       .toISOString(),
   approvedAt:
     serializeOptionalTimestamp(
       payout.approvedAt
     ),
   rejectedAt:
     serializeOptionalTimestamp(
       payout.rejectedAt
     ),
   processingStartedAt:
     serializeOptionalTimestamp(
       payout.processingStartedAt
     ),
   completedAt:
     serializeOptionalTimestamp(
       payout.completedAt
     ),
   failedAt:

    serializeOptionalTimestamp(
      payout.failedAt
    ),
  cancelledAt:
    serializeOptionalTimestamp(
      payout.cancelledAt
    ),
  lastRetryAt:
    serializeOptionalTimestamp(
      payout.lastRetryAt
    ),
  createdAt:
    payout.createdAt
      .toDate()
      .toISOString(),
  updatedAt:
    payout.updatedAt
      .toDate()
      .toISOString(),
},
wallet: wallet
  ? serializeServicePartnerWallet(
      walletSnapshot.id,
      wallet
    )
  : null,
events:
  eventSnapshot.docs.map(
    (document) => {
      const event =
        document.data();

   return {
    id: document.id,
    ...event,
    processedAt:
      event.processedAt
       ?.toDate()
       ?.toISOString?.() ??
      null,
    createdAt:
      event.createdAt
       ?.toDate()
       ?.toISOString?.() ??

                        null,
                   };
               }
             ),
        };
    }
  );
