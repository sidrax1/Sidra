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
  partnerReference,
  requireAuthenticatedActor,
  requirePermission,
} from "../servicePartnerRepository";
import {
  settlementCollections,
} from "./servicePartnerSettlementRepository";
import type {
  ServicePartnerSettlementAdjustmentDocument,
} from "./servicePartnerSettlementTypes";

interface CreateSettlementAdjustmentInput {
  readonly partnerId: string;
  readonly type:

     | "credit"
     | "debit";
    readonly category:
     | "bonus"
     | "penalty"
     | "refundRecovery"
     | "disputeRecovery"
     | "manual";
    readonly title: string;
    readonly description: string;
    readonly amountPaise: number;
    readonly taxable: boolean;
    readonly referenceId?: string;
}

const allowedTypes =
 new Set([
   "credit",
   "debit",
 ] as const);

const allowedCategories =
 new Set([
   "bonus",
   "penalty",
   "refundRecovery",
   "disputeRecovery",
   "manual",
 ] as const);

export const createServicePartnerSettlementAdjustment =
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
 request.data as Partial<CreateSettlementAdjustmentInput>;

const partnerId =
 typeof input.partnerId ===
   "string"
   ? input.partnerId.trim()
   : "";

const title =
 typeof input.title ===
   "string"
   ? input.title.trim()
   : "";

const description =
 typeof input.description ===
   "string"
   ? input.description.trim()
   : "";

const referenceId =
 typeof input.referenceId ===
   "string"
   ? input.referenceId
      .trim()
      .slice(0, 200)
   : undefined;

if (!partnerId) {
  throw new HttpsError(
    "invalid-argument",
    "Partner ID is required."
  );
}

if (

  !input.type ||
  !allowedTypes.has(
    input.type
  )
){
  throw new HttpsError(
    "invalid-argument",
    "Adjustment type is invalid."
  );
}

if (
  !input.category ||
  !allowedCategories.has(
     input.category
  )
){
  throw new HttpsError(
     "invalid-argument",
     "Adjustment category is invalid."
  );
}

if (
  title.length < 3 ||
  title.length > 160
){
  throw new HttpsError(
     "invalid-argument",
     "Adjustment title must contain between 3 and 160 characters."
  );
}

if (
  description.length <
     10 ||
  description.length >
     2000
){
  throw new HttpsError(
     "invalid-argument",
     "Adjustment description must contain between 10 and 2000 characters."
  );
}

if (
  !Number.isInteger(
     input.amountPaise
  ) ||
  input.amountPaise! <= 0 ||
  input.amountPaise! >
     100_000_000
){
  throw new HttpsError(
     "invalid-argument",
     "Adjustment amount must be a positive integer not exceeding ₹10,00,000."
  );
}

if (
  typeof input.taxable !==
  "boolean"
){
  throw new HttpsError(
     "invalid-argument",
     "Taxable must be a boolean value."
  );
}

if (
  input.category ===
     "bonus" &&
  input.type !== "credit"
){
  throw new HttpsError(
     "invalid-argument",
     "Bonus adjustments must be credits."
  );
}

if (
  [
    "penalty",
    "refundRecovery",
    "disputeRecovery",
  ].includes(
    input.category
  ) &&

  input.type !== "debit"
){
  throw new HttpsError(
    "invalid-argument",
    "Penalty and recovery adjustments must be debits."
  );
}

const partnerSnapshot =
 await partnerReference(
   partnerId
 ).get();

if (
  !partnerSnapshot.exists
){
  throw new HttpsError(
     "not-found",
     "Service partner was not found."
  );
}

const reference =
 firestore
   .collection(
     settlementCollections.adjustments
   )
   .doc();

const now =
 Timestamp.now();

const adjustment: ServicePartnerSettlementAdjustmentDocument =
 {
   partnerId,
   type: input.type,
   category:
     input.category,
   title,
   description,
   amountPaise:
     input.amountPaise,
   taxable:
     input.taxable,

   status: "pending",
   createdBy:
    actor.uid,
   createdAt: now,
   updatedAt: now,
 };

await firestore.runTransaction(
 async (transaction) => {
  transaction.create(
    reference,
    {
      ...adjustment,
      referenceId:
        referenceId ??
        null,
    }
  );

  await createAuditLog(
    {
      actor,
      action:
        "servicePartnerSettlementAdjustment.created",
      entityType:
        "partner",
      entityId:
        partnerId,
      metadata: {
        adjustmentId:
          reference.id,
        type:
          input.type,
        category:
          input.category,
        amountPaise:
          input.amountPaise,
        taxable:
          input.taxable,
        referenceId,
      },
    },
    transaction
  );

          }
        );

        return {
          adjustment: {
            id: reference.id,
            ...adjustment,
            referenceId,
            createdAt:
              now
               .toDate()
               .toISOString(),
            updatedAt:
              now
               .toDate()
               .toISOString(),
          },
        };
    }
  );
