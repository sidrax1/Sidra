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
  createPaymentEventReference,
  serializeSettlement,
  settlementReference,
} from "./servicePartnerSettlementRepository";
import type {
  ServicePartnerSettlementDocument,
  ServicePartnerSettlementPaymentMethod,
} from "./servicePartnerSettlementTypes";

interface RetryServicePartnerSettlementPaymentInput {
  readonly settlementId: string;
  readonly paymentMethod?: ServicePartnerSettlementPaymentMethod;
  readonly paymentProvider?: string;
  readonly retryNote: string;
}

const validPaymentMethods =
 new Set<ServicePartnerSettlementPaymentMethod>(

  [
       "bankTransfer",
       "upi",
       "manualBankTransfer",
   ]
 );

export const retryServicePartnerSettlementPayment =
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
         "servicePartners.retrySettlementPayments"
       );

       await enforceServicePartnerRateLimit(
         {
           actorId: actor.uid,
           action:
            "retry-service-partner-settlement-payment",
           maximumAttempts: 30,
           windowSeconds: 3600,
         }
       );

       const input =
        request.data as Partial<RetryServicePartnerSettlementPaymentInput>;

       const settlementId =
        typeof input.settlementId ===
          "string"

  ? input.settlementId.trim()
  : "";

const retryNote =
 typeof input.retryNote ===
   "string"
   ? input.retryNote.trim()
   : "";

const paymentProvider =
 typeof input.paymentProvider ===
   "string"
   ? input.paymentProvider
      .trim()
      .slice(0, 120)
   : undefined;

if (!settlementId) {
  throw new HttpsError(
    "invalid-argument",
    "Settlement ID is required."
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
  input.paymentMethod &&
  !validPaymentMethods.has(
     input.paymentMethod
  )
){
  throw new HttpsError(
     "invalid-argument",
     "Payment method is invalid."
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
      current.status !==
      "failed"
    ){
      throw new HttpsError(
         "failed-precondition",
         "Only failed settlement payments can be retried."
      );
    }

    if (
      !current.approvedAt ||
      !current.approvedBy
    ){
      throw new HttpsError(
         "failed-precondition",

      "Settlement approval is required before retrying payment."
    );
}

const paymentMethod =
 input.paymentMethod ??
 current.paymentMethod;

if (!paymentMethod) {
  throw new HttpsError(
    "failed-precondition",
    "A payment method is required before retrying payment."
  );
}

if (
  paymentMethod !==
     "upi" &&
  !current.bankSnapshot
     ?.verified
){
  throw new HttpsError(
     "failed-precondition",
     "A verified bank account is required for settlement payment."
  );
}

const now =
 Timestamp.now();

const updated: ServicePartnerSettlementDocument =
 {
   ...current,
   status:
     "processing",
   paymentMethod,
   paymentProvider:
     paymentProvider ??
     current.paymentProvider,
   paymentFailureReason:
     undefined,
   processingStartedAt:
     now,
   failedAt:

    undefined,
   updatedAt: now,
 };

transaction.update(
  reference,
  {
    status:
      "processing",
    paymentMethod,
    paymentProvider:
      paymentProvider ??
      current.paymentProvider ??
      null,
    paymentFailureReason:
      null,
    processingStartedAt:
      now,
    processingStartedBy:
      actor.uid,
    retryNote,
    retryCount:
      FirebaseFirestore.FieldValue.increment(
        1
      ),
    lastRetryAt:
      now,
    lastRetryBy:
      actor.uid,
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
       "paymentRetryStarted",
      status:
       "processing",
      amountPaise:
       current.totals
         .netPayablePaise,
      currency:
       current.currency,
      paymentMethod,
      paymentProvider:
       paymentProvider ??
       current.paymentProvider ??
       null,
      previousFailureReason:
       current.paymentFailureReason ??
       null,
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
    "servicePartnerSettlement.paymentRetried",
   entityType:
    "partner",
   entityId:
    current.partnerId,
   metadata: {
    settlementId:
     reference.id,
    settlementNumber:
     current.settlementNumber,
    paymentMethod,
    paymentProvider:

                    paymentProvider ??
                    current.paymentProvider,
                   previousFailureReason:
                    current.paymentFailureReason,
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
             "Settlement Payment Retried",
           body: `Payment processing has restarted for settlement
${current.settlementNumber}.`,
           type:
             "servicePartnerSettlementPaymentRetried",
           actionURL:
             `/partner/settlements/${reference.id}`,
           metadata: {
             settlementId:
               reference.id,
             settlementNumber:
               current.settlementNumber,
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
