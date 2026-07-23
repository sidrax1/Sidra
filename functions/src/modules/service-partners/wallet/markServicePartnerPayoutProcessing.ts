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

interface MarkServicePartnerPayoutProcessingInput {
  readonly payoutId: string;
  readonly paymentProvider?: string;
  readonly providerRequestId?: string;
  readonly processingNote: string;
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

export const markServicePartnerPayoutProcessing =
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
        "servicePartners.processPayouts"
      );

      const input =
       request.data as Partial<MarkServicePartnerPayoutProcessingInput>;

      const payoutId =
       typeof input.payoutId === "string"
         ? input.payoutId.trim()
         : "";

const processingNote =
 typeof input.processingNote === "string"
   ? input.processingNote.trim()
   : "";

const paymentProvider =
 typeof input.paymentProvider === "string"
   ? input.paymentProvider
      .trim()
      .slice(0, 120)
   : undefined;

const providerRequestId =
 typeof input.providerRequestId === "string"
   ? input.providerRequestId
      .trim()
      .slice(0, 200)
   : undefined;

if (!payoutId) {
  throw new HttpsError(
    "invalid-argument",
    "Payout request ID is required."
  );
}

if (
  processingNote.length < 10 ||
  processingNote.length > 2000
){
  throw new HttpsError(
     "invalid-argument",
     "Processing note must contain between 10 and 2000 characters."
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
     "approved"
   ){
     throw new HttpsError(
        "failed-precondition",
        "Only approved payout requests can enter processing."
     );
   }

   const walletSnapshot =
    await transaction.get(
      servicePartnerWalletReference(
        current.partnerId
      )
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
     "Reserved wallet balance is lower than the payout amount."
  );
}

const now =
 Timestamp.now();

const updated: ServicePartnerPayoutRequestDocument =
 {
   ...current,
   status:
     "processing",
   updatedAt: now,
 };

transaction.update(
  payoutRef,
  {
    status:
     "processing",
    processingStartedBy:

       actor.uid,
      processingStartedAt:
       now,
      processingNote,
      paymentProvider:
       paymentProvider ??
       null,
      providerRequestId:
       providerRequestId ??
       null,
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
     "processingStarted",
    status:
     "processing",
    amountPaise:
     current.amountPaise,
    currency:
     current.currency,
    payoutMethod:
     current.payoutMethod,
    paymentProvider:
     paymentProvider ??
     null,
    providerRequestId:
     providerRequestId ??
     null,
    note:
     processingNote,
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
      "servicePartnerPayout.processingStarted",
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
     "Payout Processing Started",
   body: `Payout ${current.payoutNumber} is now being processed.`,
   type:
     "servicePartnerPayoutProcessing",
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
            paymentProvider,
            providerRequestId,
            processingNote,
            requestedAt:
              payout.requestedAt
               .toDate()
               .toISOString(),
            approvedAt:
              payout.approvedAt
               ?.toDate()
               .toISOString(),
            processingStartedAt:
              new Date().toISOString(),
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
