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
  serializeSettlement,
  settlementReference,
} from "./servicePartnerSettlementRepository";
import type {
  ServicePartnerSettlementDocument,
} from "./servicePartnerSettlementTypes";

interface ReleaseServicePartnerSettlementHoldInput {
  readonly settlementId: string;
  readonly releaseNote: string;
  readonly nextStatus?:
   | "underReview"
   | "approved";
}

export const releaseServicePartnerSettlementHold =
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
   "servicePartners.releaseSettlementHolds"
 );

 const input =
  request.data as Partial<ReleaseServicePartnerSettlementHoldInput>;

 const settlementId =
  typeof input.settlementId ===
    "string"
    ? input.settlementId.trim()
    : "";

 const releaseNote =
  typeof input.releaseNote ===
    "string"
    ? input.releaseNote.trim()
    : "";

 const nextStatus =
  input.nextStatus ??
  "underReview";

 if (!settlementId) {
   throw new HttpsError(
     "invalid-argument",
     "Settlement ID is required."
   );
 }

 if (

  releaseNote.length <
    10 ||
  releaseNote.length >
    2000
){
  throw new HttpsError(
    "invalid-argument",
    "Release note must contain between 10 and 2000 characters."
  );
}

if (
  ![
     "underReview",
     "approved",
  ].includes(nextStatus)
){
  throw new HttpsError(
     "invalid-argument",
     "Next settlement status is invalid."
  );
}

const reference =
 settlementReference(
   settlementId
 );

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
  "onHold"
){
  throw new HttpsError(
     "failed-precondition",
     "Only settlements currently on hold can be released."
  );
}

if (
  nextStatus ===
     "approved" &&
  !current.bankSnapshot
     ?.verified
){
  throw new HttpsError(
     "failed-precondition",
     "A verified bank account is required before settlement approval."
  );
}

const now =
 Timestamp.now();

const approved =
 nextStatus ===
 "approved";

const updated: ServicePartnerSettlementDocument =
 {
   ...current,
   status:
     nextStatus,
   holdReason:
     undefined,
   reviewNote:
     releaseNote,
   reviewedBy:
     actor.uid,
   reviewedAt: now,
   approvedBy:

    approved
     ? actor.uid
     : current.approvedBy,
   approvedAt:
    approved
     ? now
     : current.approvedAt,
   approvedNote:
    approved
     ? releaseNote
     : current.approvedNote,
   updatedAt: now,
 };

transaction.update(
  reference,
  {
    status:
     nextStatus,
    holdReason: null,
    holdReleasedBy:
     actor.uid,
    holdReleasedAt:
     now,
    holdReleaseNote:
     releaseNote,
    reviewedBy:
     actor.uid,
    reviewedAt: now,
    approvedBy:
     approved
       ? actor.uid
       : current.approvedBy ??
         null,
    approvedAt:
     approved
       ? now
       : current.approvedAt ??
         null,
    approvedNote:
     approved
       ? releaseNote
       : current.approvedNote ??
         null,

      updatedAt: now,
  }
);

await createAuditLog(
  {
    actor,
    action:
      "servicePartnerSettlement.holdReleased",
    entityType:
      "partner",
    entityId:
      current.partnerId,
    metadata: {
      settlementId:
       reference.id,
      settlementNumber:
       current.settlementNumber,
      previousHoldReason:
       current.holdReason,
      nextStatus,
      releaseNote,
    },
  },
  transaction
);

await createNotification(
 {
   userId:
     current.applicantUserId,
   title:
     approved
       ? "Settlement Approved"
       : "Settlement Hold Released",
   body: approved
     ? `Settlement ${current.settlementNumber} has been approved for payment.`
     : `Settlement ${current.settlementNumber} has returned to review.`,
   type: approved
     ? "servicePartnerSettlementApproved"
     : "servicePartnerSettlementHoldReleased",
   actionURL:
     `/partner/settlements/${reference.id}`,
   metadata: {

                     settlementId:
                      reference.id,
                     settlementNumber:
                      current.settlementNumber,
                     nextStatus,
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
