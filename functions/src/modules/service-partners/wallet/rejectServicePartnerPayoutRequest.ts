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

interface RejectServicePartnerPayoutRequestInput {
  readonly payoutId: string;
  readonly rejectionReason: string;
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
    readonly walletEntryId: string;
    readonly requestedAt: Timestamp;
    readonly createdAt: Timestamp;
    readonly updatedAt: Timestamp;
}

const payoutCollection =
 "servicePartnerPayoutRequests";

export const rejectServicePartnerPayoutRequest =
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
        "servicePartners.rejectPayouts"
      );

      const input =
       request.data as Partial<RejectServicePartnerPayoutRequestInput>;

      const payoutId =
       typeof input.payoutId === "string"
         ? input.payoutId.trim()
         : "";

      const rejectionReason =
       typeof input.rejectionReason === "string"
         ? input.rejectionReason.trim()
         : "";

if (!payoutId) {
  throw new HttpsError(
    "invalid-argument",
    "Payout request ID is required."
  );
}

if (
  rejectionReason.length < 10 ||
  rejectionReason.length > 2000
){
  throw new HttpsError(
     "invalid-argument",
     "Rejection reason must contain between 10 and 2000 characters."
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

if (
  ![
     "requested",
     "approved",
  ].includes(
     current.status
  )
){
  throw new HttpsError(
     "failed-precondition",
     `Payout request with status ${current.status} cannot be rejected.`
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
    "Wallet held balance is lower than the payout request amount."
  );
}

const balances = {
  ...wallet.balances,
  availablePaise:
    wallet.balances.availablePaise +
    current.amountPaise,
  heldPaise:
    wallet.balances.heldPaise -
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
     "Rejected Payout Funds Released",
   description:
     rejectionReason,
   idempotencyKey:
     `payout-rejected:${payoutRef.id}`,
   metadata: {
     payoutId:
       payoutRef.id,
     payoutNumber:
       current.payoutNumber,
     rejectionReason,
   },
   availableAt: now,
   createdBy:
     actor.uid,
   createdAt: now,
   updatedAt: now,
 };

transaction.update(

  payoutRef,
  {
    status: "rejected",
    rejectionReason,
    rejectedBy:
     actor.uid,
    rejectedAt: now,
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
    updatedAt: now,
  }
);

await createAuditLog(
 {
   actor,
   action:
    "servicePartnerPayout.rejected",
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
    walletEntryId:
     entryRef.id,
    rejectionReason,

           },
         },
         transaction
       );

       await createNotification(
         {
           userId:
             current.applicantUserId,
           title:
             "Payout Request Rejected",
           body: `Payout request ${current.payoutNumber} was rejected. The reserved amount
has been returned to your available wallet balance.`,
           type:
             "servicePartnerPayoutRejected",
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
         wallet: {
           ...wallet,
           balances,
           lastEntryAt: now,
           updatedAt: now,
         },
         payout: {
           ...current,
           status:
             "rejected" as const,
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
            rejectionReason,
            requestedAt:
              result.payout.requestedAt
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
