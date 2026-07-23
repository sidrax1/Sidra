import {

  Timestamp,
} from "firebase-admin/firestore";
import {
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";

import {
  createAuditLog,
  createNotification,
  firestore,
  requireAuthenticatedActor,
  requirePermission,
} from "../servicePartnerRepository";
import {
  enforceServicePartnerRateLimit,
} from "../servicePartnerRateLimit";
import {
  servicePartnerWalletReference,
} from "./servicePartnerWalletRepository";
import type {
  ServicePartnerWalletDocument,
} from "./servicePartnerWalletTypes";

interface RetryServicePartnerPayoutInput {
  readonly payoutId: string;
  readonly payoutMethod?:
   | "bankTransfer"
   | "upi"
   | "manualBankTransfer";
  readonly accountReference?: string;
  readonly paymentProvider?: string;
  readonly retryNote: string;
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
    readonly requestedAt: Timestamp;
    readonly approvedAt?: Timestamp;
    readonly processingStartedAt?: Timestamp;
    readonly failedAt?: Timestamp;
    readonly reservedFundsReleased?: boolean;
    readonly retryCount?: number;
    readonly paymentProvider?: string;
    readonly providerRequestId?: string;
    readonly createdAt: Timestamp;
    readonly updatedAt: Timestamp;
}

const payoutCollection =
 "servicePartnerPayoutRequests";

const payoutEventCollection =
 "servicePartnerPayoutEvents";

const paymentMethods = new Set([
  "bankTransfer",
  "upi",
  "manualBankTransfer",
]);

export const retryServicePartnerPayout =
 onCall(
  {
    region: "asia-south1",
    enforceAppCheck: true,
    cors: true,
    timeoutSeconds: 120,

  memory: "512MiB",
},
async (request) => {
  const actor =
   requireAuthenticatedActor(
     request
   );

 requirePermission(
   actor,
   "servicePartners.retryPayouts"
 );

 await enforceServicePartnerRateLimit(
   {
     actorId: actor.uid,
     action:
      "retry-service-partner-payout",
     maximumAttempts: 30,
     windowSeconds: 3600,
   }
 );

 const input =
  request.data as Partial<RetryServicePartnerPayoutInput>;

 const payoutId =
  typeof input.payoutId ===
  "string"
    ? input.payoutId.trim()
    : "";

 const retryNote =
  typeof input.retryNote ===
  "string"
    ? input.retryNote.trim()
    : "";

 const accountReference =
  typeof input.accountReference ===
  "string"
    ? input.accountReference
       .trim()
       .slice(0, 200)

  : undefined;

const paymentProvider =
 typeof input.paymentProvider ===
 "string"
   ? input.paymentProvider
      .trim()
      .slice(0, 120)
   : undefined;

if (!payoutId) {
  throw new HttpsError(
    "invalid-argument",
    "Payout request ID is required."
  );
}

if (
  retryNote.length < 10 ||
  retryNote.length > 2000
){
  throw new HttpsError(
     "invalid-argument",
     "Retry note must contain between 10 and 2000 characters."
  );
}

if (
  input.payoutMethod &&
  !paymentMethods.has(
     input.payoutMethod
  )
){
  throw new HttpsError(
     "invalid-argument",
     "Payout method is invalid."
  );
}

const payoutRef =
 firestore
   .collection(
     payoutCollection
   )

  .doc(payoutId);

const eventRef =
 firestore
   .collection(
     payoutEventCollection
   )
   .doc();

const payout =
 await firestore.runTransaction(
  async (transaction) => {
   const payoutSnapshot =
    await transaction.get(
      payoutRef
    );

   if (!payoutSnapshot.exists) {
     throw new HttpsError(
       "not-found",
       "Service-partner payout request was not found."
     );
   }

   const current =
    payoutSnapshot.data() as ServicePartnerPayoutRequestDocument;

   if (
     current.status !==
     "failed"
   ){
     throw new HttpsError(
        "failed-precondition",
        "Only failed payout requests can be retried."
     );
   }

   if (!current.approvedAt) {
     throw new HttpsError(
       "failed-precondition",
       "Payout approval is required before retrying payment."
     );
   }

const walletRef =
 servicePartnerWalletReference(
   current.partnerId
 );

const walletSnapshot =
 await transaction.get(
   walletRef
 );

if (!walletSnapshot.exists) {
  throw new HttpsError(
    "failed-precondition",
    "The wallet associated with this payout no longer exists."
  );
}

const wallet =
 walletSnapshot.data() as ServicePartnerWalletDocument;

if (
  wallet.status !==
  "active"
){
  throw new HttpsError(
     "failed-precondition",
     `Wallet with status ${wallet.status} cannot retry payouts.`
  );
}

const reservedFundsReleased =
 current.reservedFundsReleased ===
 true;

let balances =
  wallet.balances;

if (reservedFundsReleased) {
  if (
    wallet.balances
       .availablePaise <
    current.amountPaise
  ){
    throw new HttpsError(

       "failed-precondition",
       "Wallet does not have enough available balance to reserve this payout again."
     );
 }

  balances = {
    ...wallet.balances,
    availablePaise:
      wallet.balances
       .availablePaise -
      current.amountPaise,
    heldPaise:
      wallet.balances
       .heldPaise +
      current.amountPaise,
  };
} else if (
  wallet.balances.heldPaise <
  current.amountPaise
){
  throw new HttpsError(
    "failed-precondition",
    "Reserved payout balance is no longer available."
  );
}

const payoutMethod =
 input.payoutMethod ??
 current.payoutMethod;

const nextAccountReference =
 accountReference ??
 current.accountReference;

const now =
 Timestamp.now();

const updated: ServicePartnerPayoutRequestDocument =
 {
   ...current,
   status: "processing",
   payoutMethod,
   accountReference:
     nextAccountReference,

   paymentProvider:
    paymentProvider ??
    current.paymentProvider,
   reservedFundsReleased:
    false,
   processingStartedAt:
    now,
   failedAt: undefined,
   retryCount:
    (current.retryCount ??
      0) + 1,
   updatedAt: now,
 };

transaction.update(
  payoutRef,
  {
    status: "processing",
    payoutMethod,
    accountReference:
      nextAccountReference,
    paymentProvider:
      paymentProvider ??
      current.paymentProvider ??
      null,
    providerRequestId:
      null,
    failureReason: null,
    reservedFundsReleased:
      false,
    processingStartedBy:
      actor.uid,
    processingStartedAt:
      now,
    retryCount:
      (current.retryCount ??
       0) + 1,
    lastRetryBy:
      actor.uid,
    lastRetryAt: now,
    retryNote,
    failedAt: null,
    updatedAt: now,
  }

);

if (reservedFundsReleased) {
  transaction.update(
    walletRef,
    {
      balances,
      lastEntryAt: now,
      updatedAt: now,
    }
  );
}

transaction.create(
  eventRef,
  {
    payoutId:
     payoutRef.id,
    payoutNumber:
     current.payoutNumber,
    partnerId:
     current.partnerId,
    applicantUserId:
     current.applicantUserId,
    eventType:
     "paymentRetryStarted",
    status:
     "processing",
    amountPaise:
     current.amountPaise,
    currency:
     current.currency,
    payoutMethod,
    accountReference:
     nextAccountReference,
    paymentProvider:
     paymentProvider ??
     current.paymentProvider ??
     null,
    retryCount:
     updated.retryCount,
    retryNote,
    processedBy:
     actor.uid,

      processedAt: now,
      createdAt: now,
  }
);

await createAuditLog(
  {
    actor,
    action:
      "servicePartnerPayout.retried",
    entityType:
      "partner",
    entityId:
      current.partnerId,
    metadata: {
      payoutId:
       payoutRef.id,
      payoutNumber:
       current.payoutNumber,
      amountPaise:
       current.amountPaise,
      payoutMethod,
      paymentProvider,
      retryCount:
       updated.retryCount,
      retryNote,
    },
  },
  transaction
);

await createNotification(
 {
   userId:
     current.applicantUserId,
   title:
     "Payout Retried",
   body: `Payment processing has restarted for payout ${current.payoutNumber}.`,
   type:
     "servicePartnerPayoutRetried",
   actionURL:
     `/partner/wallet/payouts/${payoutRef.id}`,
   metadata: {
     payoutId:

              payoutRef.id,
             payoutNumber:
              current.payoutNumber,
             retryCount:
              updated.retryCount,
           },
         },
         transaction
       );

       return updated;
   }
 );

return {
 payout: {
   id: payoutRef.id,
   ...payout,
   retryNote,
   requestedAt:
     payout.requestedAt
      .toDate()
      .toISOString(),
   approvedAt:
     payout.approvedAt
      ?.toDate()
      .toISOString(),
   processingStartedAt:
     payout.processingStartedAt
      ?.toDate()
      .toISOString(),
   failedAt:
     payout.failedAt
      ?.toDate()
      .toISOString(),
   createdAt:
     payout.createdAt
      .toDate()
      .toISOString(),
   updatedAt:
     payout.updatedAt
      .toDate()
      .toISOString(),
 },

        };
    }
  );
