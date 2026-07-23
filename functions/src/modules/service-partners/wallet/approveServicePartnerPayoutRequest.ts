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

interface ApproveServicePartnerPayoutRequestInput {
  readonly payoutId: string;
  readonly approvalNote: string;
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
    readonly approvalNote?: string;
    readonly createdAt: Timestamp;
    readonly updatedAt: Timestamp;
}

const payoutCollection =
 "servicePartnerPayoutRequests";

export const approveServicePartnerPayoutRequest =
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
        "servicePartners.approvePayouts"
      );

      const input =
       request.data as Partial<ApproveServicePartnerPayoutRequestInput>;

      const payoutId =
       typeof input.payoutId === "string"
         ? input.payoutId.trim()
         : "";

      const approvalNote =

 typeof input.approvalNote === "string"
   ? input.approvalNote.trim()
   : "";

if (!payoutId) {
  throw new HttpsError(
    "invalid-argument",
    "Payout request ID is required."
  );
}

if (
  approvalNote.length < 10 ||
  approvalNote.length > 2000
){
  throw new HttpsError(
     "invalid-argument",
     "Approval note must contain between 10 and 2000 characters."
  );
}

const payoutRef =
 firestore
   .collection(
     payoutCollection
   )
   .doc(payoutId);

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
  "requested"
){
  throw new HttpsError(
     "failed-precondition",
     `Payout request with status ${current.status} cannot be approved.`
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
  wallet.status !==
  "active"
){
  throw new HttpsError(
     "failed-precondition",
     `Wallet with status ${wallet.status} cannot process payouts.`
  );
}

if (
  wallet.balances.heldPaise <

  current.amountPaise
){
  throw new HttpsError(
    "failed-precondition",
    "Wallet held balance is lower than the payout request amount.",
    {
      heldBalancePaise:
       wallet.balances.heldPaise,
      payoutAmountPaise:
       current.amountPaise,
    }
  );
}

const now =
 Timestamp.now();

const updated: ServicePartnerPayoutRequestDocument =
 {
   ...current,
   status: "approved",
   approvedBy:
     actor.uid,
   approvedAt: now,
   approvalNote,
   updatedAt: now,
 };

transaction.update(
  payoutRef,
  {
    status: "approved",
    approvedBy:
     actor.uid,
    approvedAt: now,
    approvalNote,
    updatedAt: now,
  }
);

await createAuditLog(
 {
   actor,
   action:

      "servicePartnerPayout.approved",
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
      payoutMethod:
       current.payoutMethod,
      approvalNote,
    },
  },
  transaction
);

await createNotification(
  {
    userId:
      current.applicantUserId,
    title:
      "Payout Approved",
    body: `Payout request ${current.payoutNumber} has been approved for processing.`,
    type:
      "servicePartnerPayoutApproved",
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

return updated;

           }
         );

        return {
          payout: {
            id: payoutRef.id,
            ...payout,
            requestedAt:
              payout.requestedAt
               .toDate()
               .toISOString(),
            approvedAt:
              payout.approvedAt
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
