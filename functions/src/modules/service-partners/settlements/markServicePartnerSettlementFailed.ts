s

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
} from "./servicePartnerSettlementTypes";
import {
  validateMarkSettlementFailedInput,
} from "./servicePartnerSettlementValidation";

export const markServicePartnerSettlementFailed =
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
  "servicePartners.markSettlementsFailed"
);

const input =
 validateMarkSettlementFailedInput(
   request.data
 );

const reference =
 settlementReference(
   input.settlementId
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

    "processing",
  ].includes(
    current.status
  )
){
  throw new HttpsError(
    "failed-precondition",
    `Settlement with status ${current.status} cannot be marked as failed.`
  );
}

const now =
 Timestamp.now();

const updated: ServicePartnerSettlementDocument =
 {
   ...current,
   status: "failed",
   paymentFailureReason:
     input.failureReason,
   failedAt: now,
   updatedAt: now,
 };

transaction.update(
  reference,
  {
    status: "failed",
    paymentFailureReason:
     input.failureReason,
    failedAt: now,
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
       "paymentFailed",
      status: "failed",
      amountPaise:
       current.totals
         .netPayablePaise,
      currency:
       current.currency,
      paymentMethod:
       current.paymentMethod ??
       null,
      paymentReference:
       current.paymentReference ??
       null,
      paymentProvider:
       current.paymentProvider ??
       null,
      failureReason:
       input.failureReason,
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
    "servicePartnerSettlement.paymentFailed",
   entityType:
    "partner",
   entityId:
    current.partnerId,
   metadata: {
    settlementId:
     reference.id,
    settlementNumber:
     current.settlementNumber,

                amountPaise:
                 current.totals
                   .netPayablePaise,
                failureReason:
                 input.failureReason,
              },
            },
            transaction
          );

        await createNotification(
          {
            userId:
              current.applicantUserId,
            title:
              "Settlement Payment Delayed",
            body: `Payment for settlement ${current.settlementNumber} could not be completed
and will require review.`,
            type:
              "servicePartnerSettlementPaymentFailed",
            actionURL:
              `/partner/settlements/${reference.id}`,
            metadata: {
              settlementId:
                reference.id,
              settlementNumber:
                current.settlementNumber,
              failureReason:
                input.failureReason,
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
