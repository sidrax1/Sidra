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
  servicePartnerWalletReference,
} from "./servicePartnerWalletRepository";
import type {
  ServicePartnerWalletDocument,
} from "./servicePartnerWalletTypes";

interface MarkServicePartnerPayoutFailedInput {
  readonly payoutId: string;
  readonly failureReason: string;
  readonly paymentProvider?: string;
  readonly providerRequestId?: string;
  readonly releaseReservedFunds?: boolean;
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
  readonly requestedAt: Timestamp;
  readonly approvedBy?: string;

    readonly approvedAt?: Timestamp;
    readonly processingStartedAt?: Timestamp;
    readonly paymentProvider?: string;
    readonly providerRequestId?: string;
    readonly paymentReference?: string;
    readonly completedAt?: Timestamp;
    readonly failedAt?: Timestamp;
    readonly createdAt: Timestamp;
    readonly updatedAt: Timestamp;
}

const payoutCollection =
 "servicePartnerPayoutRequests";

const payoutEventCollection =
 "servicePartnerPayoutEvents";

export const markServicePartnerPayoutFailed =
 onCall(
  {
    region: "asia-south1",
    enforceAppCheck: true,
    cors: true,
    timeoutSeconds: 90,
    memory: "512MiB",
  },
  async (request) => {
    const actor =
      requireAuthenticatedActor(
        request
      );

      requirePermission(
        actor,
        "servicePartners.failPayouts"
      );

      const input =
       request.data as Partial<MarkServicePartnerPayoutFailedInput>;

      const payoutId =
       typeof input.payoutId ===
       "string"
         ? input.payoutId.trim()

  : "";

const failureReason =
 typeof input.failureReason ===
 "string"
   ? input.failureReason.trim()
   : "";

const paymentProvider =
 typeof input.paymentProvider ===
 "string"
   ? input.paymentProvider
      .trim()
      .slice(0, 120)
   : undefined;

const providerRequestId =
 typeof input.providerRequestId ===
 "string"
   ? input.providerRequestId
      .trim()
      .slice(0, 200)
   : undefined;

const releaseReservedFunds =
 input.releaseReservedFunds ===
 true;

if (!payoutId) {
  throw new HttpsError(
    "invalid-argument",
    "Payout request ID is required."
  );
}

if (
  failureReason.length < 10 ||
  failureReason.length > 2500
){
  throw new HttpsError(
     "invalid-argument",
     "Failure reason must contain between 10 and 2500 characters."
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
     ![
        "approved",
        "processing",
     ].includes(
        current.status
     )
   ){
     throw new HttpsError(
        "failed-precondition",
        `Payout request with status ${current.status} cannot be marked as failed.`

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
     "Wallet held balance is lower than the failed payout amount."
  );
}

const balances =
 releaseReservedFunds
  ?{
     ...wallet.balances,
     availablePaise:
       wallet.balances
        .availablePaise +
       current.amountPaise,
     heldPaise:
       wallet.balances
        .heldPaise -

      current.amountPaise,
    }
  : wallet.balances;

const now =
 Timestamp.now();

const updated: ServicePartnerPayoutRequestDocument =
 {
   ...current,
   status: "failed",
   paymentProvider:
     paymentProvider ??
     current.paymentProvider,
   providerRequestId:
     providerRequestId ??
     current.providerRequestId,
   failedAt: now,
   updatedAt: now,
 };

transaction.update(
  payoutRef,
  {
    status: "failed",
    failureReason,
    paymentProvider:
     paymentProvider ??
     current.paymentProvider ??
     null,
    providerRequestId:
     providerRequestId ??
     current.providerRequestId ??
     null,
    reservedFundsReleased:
     releaseReservedFunds,
    failedBy:
     actor.uid,
    failedAt: now,
    updatedAt: now,
  }
);

if (releaseReservedFunds) {

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
     "paymentFailed",
    status: "failed",
    amountPaise:
     current.amountPaise,
    currency:
     current.currency,
    payoutMethod:
     current.payoutMethod,
    paymentProvider:
     paymentProvider ??
     current.paymentProvider ??
     null,
    providerRequestId:
     providerRequestId ??
     current.providerRequestId ??
     null,
    failureReason,
    reservedFundsReleased:
     releaseReservedFunds,
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
             "servicePartnerPayout.failed",
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
             failureReason,
             releaseReservedFunds,
             paymentProvider,
             providerRequestId,
           },
         },
         transaction
       );

        await createNotification(
         {
           userId:
             current.applicantUserId,
           title:
             "Payout Processing Failed",
           body: releaseReservedFunds
             ? `Payout ${current.payoutNumber} failed. The reserved amount has been returned
to your available wallet balance.`
             : `Payout ${current.payoutNumber} could not be completed and is awaiting review.`,
           type:
             "servicePartnerPayoutFailed",
           actionURL:
             `/partner/wallet/payouts/${payoutRef.id}`,
           metadata: {

             payoutId:
              payoutRef.id,
             payoutNumber:
              current.payoutNumber,
             amountPaise:
              current.amountPaise,
             reservedFundsReleased:
              releaseReservedFunds,
           },
         },
         transaction
       );

       return {
         payout: updated,
         wallet: {
           ...wallet,
           balances,
           updatedAt: now,
         },
       };
   }
 );

return {
 payout: {
   id: payoutRef.id,
   ...result.payout,
   failureReason,
   reservedFundsReleased:
     releaseReservedFunds,
   requestedAt:
     result.payout.requestedAt
       .toDate()
       .toISOString(),
   approvedAt:
     result.payout.approvedAt
       ?.toDate()
       .toISOString(),
   processingStartedAt:
     result.payout.processingStartedAt
       ?.toDate()
       .toISOString(),
   failedAt:

              result.payout.failedAt
                ?.toDate()
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
          wallet: {
            id:
              result.wallet.partnerId,
            ...result.wallet,
            createdAt:
              result.wallet.createdAt
                .toDate()
                .toISOString(),
            updatedAt:
              result.wallet.updatedAt
                .toDate()
                .toISOString(),
            lastEntryAt:
              result.wallet.lastEntryAt
                ?.toDate()
                .toISOString(),
            lastPayoutAt:
              result.wallet.lastPayoutAt
                ?.toDate()
                .toISOString(),
          },
        };
    }
  );
