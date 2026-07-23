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
} from "../servicePartnerRepository";
import {
  hasPermission,
} from "../servicePartnerAuthorization";
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

interface CancelServicePartnerPayoutRequestInput {
  readonly payoutId: string;
  readonly cancellationReason: string;

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
  readonly failedAt?: Timestamp;
  readonly reservedFundsReleased?: boolean;
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
}

const payoutCollection =
 "servicePartnerPayoutRequests";

export const cancelServicePartnerPayoutRequest =
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

 const input =
  request.data as Partial<CancelServicePartnerPayoutRequestInput>;

 const payoutId =
  typeof input.payoutId ===
  "string"
    ? input.payoutId.trim()
    : "";

 const cancellationReason =
  typeof input.cancellationReason ===
  "string"
    ? input.cancellationReason.trim()
    : "";

 if (!payoutId) {
   throw new HttpsError(
     "invalid-argument",
     "Payout request ID is required."
   );
 }

 if (
   cancellationReason.length <
      10 ||
   cancellationReason.length >
      2000
 ){
   throw new HttpsError(
      "invalid-argument",
      "Cancellation reason must contain between 10 and 2000 characters."
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

   const privileged =
    hasPermission(
      actor,
      "servicePartners.cancelPayouts"
    ) ||
    hasPermission(
      actor,
      "servicePartners.manageWallets"
    );

   if (
     !privileged &&
     current.applicantUserId !==
        actor.uid

){
  throw new HttpsError(
    "permission-denied",
    "You cannot cancel this payout request."
  );
}

if (
  current.status !==
     "requested" &&
  !(
     privileged &&
     [
       "approved",
       "failed",
     ].includes(
       current.status
     )
  )
){
  throw new HttpsError(
     "failed-precondition",
     `Payout request with status ${current.status} cannot be cancelled.`
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

const alreadyReleased =
 current.reservedFundsReleased ===
 true;

if (
  !alreadyReleased &&
  wallet.balances.heldPaise <
     current.amountPaise
){
  throw new HttpsError(
     "failed-precondition",
     "Wallet held balance is lower than the payout amount."
  );
}

const balances =
 alreadyReleased
  ? wallet.balances
  :{
      ...wallet.balances,
      availablePaise:
        wallet.balances
         .availablePaise +
        current.amountPaise,
      heldPaise:
        wallet.balances
         .heldPaise -
        current.amountPaise,
    };

assertNonNegativeWalletBalances(
  balances
);

const now =
 Timestamp.now();

let entry:
  | ServicePartnerWalletEntryDocument
  | undefined;

if (!alreadyReleased) {

const entryNumber =
 await nextWalletEntryNumber(
   transaction
 );

entry = {
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
  "holdReleased",
 direction:
  "neutral",
 status:
  "available",
 currency: "INR",
 amountPaise:
  current.amountPaise,
 balanceImpactPaise:
  0,
 availableBalanceBeforePaise:
  wallet.balances
    .availablePaise,
 availableBalanceAfterPaise:
  balances.availablePaise,
 pendingBalanceBeforePaise:
  wallet.balances
    .pendingPaise,
 pendingBalanceAfterPaise:
  balances.pendingPaise,
 heldBalanceBeforePaise:
  wallet.balances
    .heldPaise,
 heldBalanceAfterPaise:
  balances.heldPaise,
 referenceType:
  "payout",
 referenceId:

        payoutRef.id,
      title:
        "Cancelled Payout Funds Released",
      description:
        cancellationReason,
      idempotencyKey:
        `payout-cancelled:${payoutRef.id}`,
      metadata: {
        payoutId:
          payoutRef.id,
        payoutNumber:
          current.payoutNumber,
        previousStatus:
          current.status,
      },
      availableAt: now,
      createdBy:
        actor.uid,
      createdAt: now,
      updatedAt: now,
    };

    transaction.create(
      entryRef,
      entry
    );

    transaction.update(
      walletRef,
      {
        balances,
        lastEntryAt: now,
        updatedAt: now,
      }
    );
}

transaction.update(
  payoutRef,
  {
    status: "cancelled",
    cancellationReason,
    cancelledBy:
     actor.uid,

             cancelledAt: now,
             reservedFundsReleased:
              true,
             updatedAt: now,
         }
       );

       await createAuditLog(
         {
           actor,
           action:
             "servicePartnerPayout.cancelled",
           entityType:
             "partner",
           entityId:
             current.partnerId,
           metadata: {
             payoutId:
              payoutRef.id,
             payoutNumber:
              current.payoutNumber,
             previousStatus:
              current.status,
             amountPaise:
              current.amountPaise,
             cancellationReason,
             fundsReleased:
              !alreadyReleased,
           },
         },
         transaction
       );

        await createNotification(
         {
           userId:
             current.applicantUserId,
           title:
             "Payout Request Cancelled",
           body: `Payout ${current.payoutNumber} has been cancelled. Reserved funds are
available in your wallet.`,
           type:
             "servicePartnerPayoutCancelled",
           actionURL:

             `/partner/wallet/payouts/${payoutRef.id}`,
           metadata: {
             payoutId:
               payoutRef.id,
             payoutNumber:
               current.payoutNumber,
             amountPaise:
               current.amountPaise,
           },
         },
         transaction
       );

       return {
         payout: {
           ...current,
           status:
             "cancelled" as const,
           reservedFundsReleased:
             true,
           updatedAt: now,
         },
         wallet: {
           ...wallet,
           balances,
           lastEntryAt:
             alreadyReleased
               ? wallet.lastEntryAt
               : now,
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
   cancellationReason,
   cancelledAt:
     result.payout.updatedAt
       .toDate()

                .toISOString(),
            requestedAt:
              result.payout.requestedAt
                .toDate()
                .toISOString(),
            approvedAt:
              result.payout.approvedAt
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
          wallet:
            serializeServicePartnerWallet(
              result.wallet.partnerId,
              result.wallet
            ),
          entry: result.entry
            ? serializeServicePartnerWalletEntry(
                entryRef.id,
                result.entry
              )
            : null,
        };
    }
  );
