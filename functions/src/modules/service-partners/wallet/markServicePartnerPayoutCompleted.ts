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
  assertNonNegativeWalletBalances,
  nextWalletEntryNumber,
  serializeServicePartnerWallet,
  serializeServicePartnerWalletEntry,
  servicePartnerWalletCollections,
  servicePartnerWalletEntryReference,
  servicePartnerWalletReference,
} from "./servicePartnerWalletRepository";
import type {
  ServicePartnerWalletDocument,
  ServicePartnerWalletEntryDocument,
} from "./servicePartnerWalletTypes";

interface MarkServicePartnerPayoutCompletedInput {
  readonly payoutId: string;
  readonly paymentReference: string;
  readonly paymentProvider?: string;
  readonly completedAt?: string;
  readonly completionNote: string;
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
    readonly createdAt: Timestamp;
    readonly updatedAt: Timestamp;
}

const payoutCollection =
 "servicePartnerPayoutRequests";

const payoutEventCollection =
 "servicePartnerPayoutEvents";

export const markServicePartnerPayoutCompleted =
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
  "servicePartners.completePayouts"
);

const input =
 request.data as Partial<MarkServicePartnerPayoutCompletedInput>;

const payoutId =
 typeof input.payoutId === "string"
   ? input.payoutId.trim()
   : "";

const paymentReference =
 typeof input.paymentReference === "string"
   ? input.paymentReference.trim()
   : "";

const completionNote =
 typeof input.completionNote === "string"
   ? input.completionNote.trim()
   : "";

const paymentProvider =
 typeof input.paymentProvider === "string"
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
  paymentReference.length < 3 ||
  paymentReference.length > 200
){
  throw new HttpsError(

      "invalid-argument",
      "Payment reference must contain between 3 and 200 characters."
    );
}

if (
  completionNote.length < 10 ||
  completionNote.length > 2000
){
  throw new HttpsError(
     "invalid-argument",
     "Completion note must contain between 10 and 2000 characters."
  );
}

let completedAt =
  Timestamp.now();

if (input.completedAt) {
  const parsedDate =
    new Date(
      input.completedAt
    );

    if (
      Number.isNaN(
         parsedDate.getTime()
      )
    ){
      throw new HttpsError(
         "invalid-argument",
         "Completed date is invalid."
      );
    }

    completedAt =
     Timestamp.fromDate(
       parsedDate
     );
}

const payoutRef =
 firestore
   .collection(

   payoutCollection
  )
  .doc(payoutId);

const entryRef =
 servicePartnerWalletEntryReference(
   firestore
     .collection(
       servicePartnerWalletCollections.entries
     )
     .doc().id
 );

const eventRef =
 firestore
   .collection(
     payoutEventCollection
   )
   .doc();

const result =
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
     "processing"
   ){
     throw new HttpsError(
        "failed-precondition",

      "Only processing payout requests can be marked as completed."
    );
}

const duplicatePaymentSnapshot =
 await transaction.get(
   firestore
     .collection(
       payoutCollection
     )
     .where(
       "paymentReference",
       "==",
       paymentReference
     )
     .limit(1)
 );

if (
  !duplicatePaymentSnapshot.empty
){
  const duplicate =
     duplicatePaymentSnapshot.docs[0]!;

    if (
      duplicate.id !==
      payoutRef.id
    ){
      throw new HttpsError(
         "already-exists",
         "Payment reference has already been used for another payout."
      );
    }
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
    "The wallet associated with this payout request no longer exists."
  );
}

const wallet =
 walletSnapshot.data() as ServicePartnerWalletDocument;

if (
  wallet.balances.heldPaise <
  current.amountPaise
){
  throw new HttpsError(
     "failed-precondition",
     "Reserved wallet balance is lower than the completed payout amount."
  );
}

const balances = {
  ...wallet.balances,
  heldPaise:
    wallet.balances.heldPaise -
    current.amountPaise,
  lifetimeDebitsPaise:
    wallet.balances.lifetimeDebitsPaise +
    current.amountPaise,
  lifetimePaidPaise:
    wallet.balances.lifetimePaidPaise +
    current.amountPaise,
};

assertNonNegativeWalletBalances(
  balances
);

const now =
 Timestamp.now();

const entryNumber =
 await nextWalletEntryNumber(
  transaction

 );

const entry: ServicePartnerWalletEntryDocument =
 {
   walletId:
     walletRef.id,
   partnerId:
     current.partnerId,
   partnerNumber:
     current.partnerNumber,
   applicantUserId:
     current.applicantUserId,
   entryNumber,
   entryType:
     "payoutDebit",
   direction:
     "debit",
   status:
     "settled",
   currency: "INR",
   amountPaise:
     current.amountPaise,
   balanceImpactPaise:
     -current.amountPaise,
   availableBalanceBeforePaise:
     wallet.balances.availablePaise,
   availableBalanceAfterPaise:
     balances.availablePaise,
   pendingBalanceBeforePaise:
     wallet.balances.pendingPaise,
   pendingBalanceAfterPaise:
     balances.pendingPaise,
   heldBalanceBeforePaise:
     wallet.balances.heldPaise,
   heldBalanceAfterPaise:
     balances.heldPaise,
   referenceType:
     "payout",
   referenceId:
     payoutRef.id,
   title:
     "Wallet Payout Completed",
   description:
     completionNote,

   idempotencyKey:
     `payout-completed:${payoutRef.id}`,
   metadata: {
     payoutId:
      payoutRef.id,
     payoutNumber:
      current.payoutNumber,
     paymentReference,
     paymentProvider,
     payoutMethod:
      current.payoutMethod,
   },
   settledAt:
     completedAt,
   createdBy:
     actor.uid,
   createdAt: now,
   updatedAt: now,
 };

transaction.update(
  payoutRef,
  {
    status:
     "completed",
    paymentReference,
    paymentProvider:
     paymentProvider ??
     null,
    completionNote,
    completedBy:
     actor.uid,
    completedAt,
    updatedAt: now,
  }
);

transaction.create(
  entryRef,
  entry
);

transaction.update(
  walletRef,

 {
      balances,
      lastEntryAt: now,
      lastPayoutAt:
        completedAt,
      updatedAt: now,
  }
);

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
     "paymentCompleted",
    status:
     "completed",
    amountPaise:
     current.amountPaise,
    currency:
     current.currency,
    payoutMethod:
     current.payoutMethod,
    paymentReference,
    paymentProvider:
     paymentProvider ??
     null,
    note:
     completionNote,
    processedBy:
     actor.uid,
    processedAt:
     completedAt,
    createdAt: now,
  }
);

await createAuditLog(
  {
    actor,
    action:
      "servicePartnerPayout.completed",
    entityType:
      "partner",
    entityId:
      current.partnerId,
    metadata: {
      payoutId:
       payoutRef.id,
      payoutNumber:
       current.payoutNumber,
      walletEntryId:
       entryRef.id,
      amountPaise:
       current.amountPaise,
      paymentReference,
      paymentProvider,
    },
  },
  transaction
);

await createNotification(
 {
   userId:
     current.applicantUserId,
   title:
     "Payout Completed",
   body: `Payout ${current.payoutNumber} has been transferred successfully.`,
   type:
     "servicePartnerPayoutCompleted",
   actionURL:
     `/partner/wallet/payouts/${payoutRef.id}`,
   metadata: {
     payoutId:
       payoutRef.id,
     payoutNumber:
       current.payoutNumber,
     amountPaise:
       current.amountPaise,
     paymentReference,

           },
         },
         transaction
       );

       return {
         wallet: {
           ...wallet,
           balances,
           lastEntryAt: now,
           lastPayoutAt:
             completedAt,
           updatedAt: now,
         },
         payout: {
           ...current,
           status:
             "completed" as const,
           updatedAt: now,
         },
         entry,
       };
   }
 );

return {
 payout: {
   id: payoutRef.id,
   ...result.payout,
   paymentReference,
   paymentProvider,
   completionNote,
   requestedAt:
     result.payout.requestedAt
       .toDate()
       .toISOString(),
   approvedAt:
     result.payout.approvedAt
       ?.toDate()
       .toISOString(),
   completedAt:
     completedAt
       .toDate()
       .toISOString(),

       createdAt:
         result.payout.createdAt
          .toDate()
          .toISOString(),
       updatedAt:
         result.payout.updatedAt
          .toDate()
          .toISOString(),
     },
     wallet:
       serializeServicePartnerWallet(
         result.wallet.partnerId,
         result.wallet
       ),
     entry:
       serializeServicePartnerWalletEntry(
         entryRef.id,
         result.entry
       ),
   };
    }
  );
