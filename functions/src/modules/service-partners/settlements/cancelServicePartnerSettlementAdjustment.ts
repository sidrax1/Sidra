import {
  Timestamp,
} from "firebase-admin/firestore";
import {
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";

import {
  createAuditLog,
  firestore,
  requireAuthenticatedActor,
  requirePermission,
} from "../servicePartnerRepository";
import {
  settlementCollections,
} from "./servicePartnerSettlementRepository";
import type {
  ServicePartnerSettlementAdjustmentDocument,
} from "./servicePartnerSettlementTypes";

interface CancelSettlementAdjustmentInput {
  readonly adjustmentId: string;
  readonly reason: string;
}

export const cancelServicePartnerSettlementAdjustment =
 onCall(
  {
    region:
      "asia-south1",
    enforceAppCheck: true,
    cors: true,
    timeoutSeconds: 60,
    memory: "256MiB",
  },
  async (request) => {
    const actor =
      requireAuthenticatedActor(
        request
      );

   requirePermission(
     actor,
     "servicePartners.manageSettlementAdjustments"
   );

   const input =
    request.data as Partial<CancelSettlementAdjustmentInput>;

   const adjustmentId =
    typeof input.adjustmentId ===

  "string"
  ? input.adjustmentId.trim()
  : "";

const reason =
 typeof input.reason ===
   "string"
   ? input.reason.trim()
   : "";

if (!adjustmentId) {
  throw new HttpsError(
    "invalid-argument",
    "Settlement adjustment ID is required."
  );
}

if (
  reason.length < 10 ||
  reason.length > 2000
){
  throw new HttpsError(
     "invalid-argument",
     "Cancellation reason must contain between 10 and 2000 characters."
  );
}

const reference =
 firestore
   .collection(
     settlementCollections.adjustments
   )
   .doc(
     adjustmentId
   );

const adjustment =
 await firestore.runTransaction(
  async (transaction) => {
   const snapshot =
    await transaction.get(
      reference
    );

if (!snapshot.exists) {
  throw new HttpsError(
    "not-found",
    "Settlement adjustment was not found."
  );
}

const current =
 snapshot.data() as ServicePartnerSettlementAdjustmentDocument;

if (
  current.status ===
  "cancelled"
){
  throw new HttpsError(
     "already-exists",
     "Settlement adjustment is already cancelled."
  );
}

if (
  current.status ===
  "consumed"
){
  throw new HttpsError(
     "failed-precondition",
     "An adjustment already consumed by a settlement cannot be cancelled."
  );
}

const now =
 Timestamp.now();

const updated: ServicePartnerSettlementAdjustmentDocument =
 {
   ...current,
   status:
     "cancelled",
   updatedAt: now,
 };

transaction.update(
  reference,
  {

             status:
              "cancelled",
             cancellationReason:
              reason,
             cancelledBy:
              actor.uid,
             cancelledAt: now,
             updatedAt: now,
         }
       );

       await createAuditLog(
         {
           actor,
           action:
             "servicePartnerSettlementAdjustment.cancelled",
           entityType:
             "partner",
           entityId:
             current.partnerId,
           metadata: {
             adjustmentId:
               reference.id,
             type:
               current.type,
             category:
               current.category,
             amountPaise:
               current.amountPaise,
             reason,
           },
         },
         transaction
       );

       return updated;
   }
 );

return {
 adjustment: {
   id:
     reference.id,
   ...adjustment,

            createdAt:
             adjustment.createdAt
               .toDate()
               .toISOString(),
            updatedAt:
             adjustment.updatedAt
               .toDate()
               .toISOString(),
            consumedAt:
             adjustment.consumedAt
               ?.toDate()
               .toISOString(),
            cancellationReason:
             reason,
          },
        };
    }
  );
