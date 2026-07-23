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
  createPaymentEventReference,
  serializeSettlement,
  settlementReference,
} from "./servicePartnerSettlementRepository";
import type {
  ServicePartnerSettlementDocument,
  ServicePartnerSettlementPaymentMethod,
} from "./servicePartnerSettlementTypes";

interface StartSettlementProcessingInput {
  readonly settlementId: string;
  readonly paymentMethod: ServicePartnerSettlementPaymentMethod;
  readonly paymentProvider?: string;
  readonly processingNote?: string;
}

const allowedPaymentMethods =

 new Set<ServicePartnerSettlementPaymentMethod>(
   [
     "bankTransfer",
     "upi",
     "manualBankTransfer",
   ]
 );

export const startServicePartnerSettlementProcessing =
 onCall(
  {
    region:
      "asia-south1",
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
     "servicePartners.processSettlements"
   );

   const input =
    request.data as Partial<StartSettlementProcessingInput>;

   const settlementId =
    typeof input.settlementId ===
      "string"
      ? input.settlementId.trim()
      : "";

   const paymentProvider =
    typeof input.paymentProvider ===
      "string"
      ? input.paymentProvider
         .trim()
         .slice(0, 120)

  : undefined;

const processingNote =
 typeof input.processingNote ===
   "string"
   ? input.processingNote
      .trim()
      .slice(0, 2000)
   : undefined;

if (!settlementId) {
  throw new HttpsError(
    "invalid-argument",
    "Settlement ID is required."
  );
}

if (
  !input.paymentMethod ||
  !allowedPaymentMethods.has(
     input.paymentMethod
  )
){
  throw new HttpsError(
     "invalid-argument",
     "A valid settlement payment method is required."
  );
}

const reference =
 settlementReference(
   settlementId
 );

const paymentEventReference =
 createPaymentEventReference();

const settlement =
 await firestore.runTransaction(
  async (transaction) => {
   const snapshot =
    await transaction.get(
      reference
    );

if (!snapshot.exists) {
  throw new HttpsError(
    "not-found",
    "Service-partner settlement was not found."
  );
}

const current =
 snapshot.data() as ServicePartnerSettlementDocument;

if (
  ![
     "approved",
     "failed",
  ].includes(
     current.status
  )
){
  throw new HttpsError(
     "failed-precondition",
     `Settlement with status ${current.status} cannot enter payment processing.`
  );
}

if (
  current.totals
     .netPayablePaise <= 0
){
  throw new HttpsError(
     "failed-precondition",
     "Settlement payable amount must be greater than zero."
  );
}

if (
  input.paymentMethod !==
     "upi" &&
  !current.bankSnapshot
     ?.verified
){
  throw new HttpsError(
     "failed-precondition",
     "A verified bank account is required for bank settlement processing."

    );
}

const now =
 Timestamp.now();

const updated: ServicePartnerSettlementDocument =
 {
   ...current,
   status:
     "processing",
   paymentMethod:
     input.paymentMethod,
   paymentProvider,
   paymentFailureReason:
     undefined,
   processingStartedAt:
     now,
   updatedAt: now,
 };

transaction.update(
  reference,
  {
    status:
     "processing",
    paymentMethod:
     input.paymentMethod,
    paymentProvider:
     paymentProvider ??
     null,
    paymentFailureReason:
     null,
    processingNote:
     processingNote ??
     null,
    processingStartedBy:
     actor.uid,
    processingStartedAt:
     now,
    failedAt: null,
    updatedAt: now,
  }
);

transaction.create(
  paymentEventReference,
  {
    settlementId:
     reference.id,
    settlementNumber:
     current.settlementNumber,
    partnerId:
     current.partnerId,
    partnerNumber:
     current.partnerNumber,
    applicantUserId:
     current.applicantUserId,
    eventType:
     "paymentProcessingStarted",
    status:
     "processing",
    amountPaise:
     current.totals
       .netPayablePaise,
    currency:
     current.currency,
    paymentMethod:
     input.paymentMethod,
    paymentProvider:
     paymentProvider ??
     null,
    processingNote:
     processingNote ??
     null,
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
    "servicePartnerSettlement.processingStarted",
   entityType:

          "partner",
        entityId:
          current.partnerId,
        metadata: {
          settlementId:
           reference.id,
          settlementNumber:
           current.settlementNumber,
          paymentMethod:
           input.paymentMethod,
          paymentProvider,
          amountPaise:
           current.totals
             .netPayablePaise,
        },
      },
      transaction
    );

    await createNotification(
      {
        userId:
          current.applicantUserId,
        title:
          "Settlement Processing",
        body: `Payment processing has started for settlement ${current.settlementNumber}.`,
        type:
          "servicePartnerSettlementProcessing",
        actionURL:
          `/partner/settlements/${reference.id}`,
        metadata: {
          settlementId:
            reference.id,
          settlementNumber:
            current.settlementNumber,
          paymentMethod:
            input.paymentMethod,
        },
      },
      transaction
    );

    return updated;
}

         );

        return {
          settlement:
           serializeSettlement(
             reference.id,
             settlement
           ),
        };
    }
  );
