import {
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";

import {
  firestore,
  partnerReference,
  requireAuthenticatedActor,
} from "../servicePartnerRepository";
import {
  hasPermission,
} from "../servicePartnerAuthorization";
import {
  settlementCollections,
} from "./servicePartnerSettlementRepository";
import type {
  ServicePartnerSettlementAdjustmentDocument,

} from "./servicePartnerSettlementTypes";

interface ListSettlementAdjustmentsInput {
  readonly partnerId?: string;
  readonly statuses?: readonly (
    | "pending"
    | "consumed"
    | "cancelled"
  )[];
  readonly types?: readonly (
    | "credit"
    | "debit"
  )[];
  readonly categories?: readonly (
    | "bonus"
    | "penalty"
    | "refundRecovery"
    | "disputeRecovery"
    | "manual"
  )[];
  readonly pageSize?: number;
  readonly cursorId?: string;
}

const validStatuses =
 new Set([
   "pending",
   "consumed",
   "cancelled",
 ]);

const validTypes =
 new Set([
   "credit",
   "debit",
 ]);

const validCategories =
 new Set([
  "bonus",
  "penalty",
  "refundRecovery",
  "disputeRecovery",
  "manual",

 ]);

export const listServicePartnerSettlementAdjustments =
 onCall(
  {
    region:
      "asia-south1",
    enforceAppCheck: true,
    cors: true,
    timeoutSeconds: 60,
    memory: "512MiB",
  },
  async (request) => {
    const actor =
      requireAuthenticatedActor(
        request
      );

       const input =
        (request.data ??
          {}) as ListSettlementAdjustmentsInput;

       const privileged =
        hasPermission(
          actor,
          "servicePartners.readSettlementAdjustments"
        ) ||
        hasPermission(
          actor,
          "servicePartners.manageSettlementAdjustments"
        );

       let partnerId =
         input.partnerId?.trim();

       if (
         partnerId &&
         !privileged
       ){
         const partnerSnapshot =
            await partnerReference(
              partnerId
            ).get();

    if (
      !partnerSnapshot.exists ||
      partnerSnapshot.data()
         ?.applicantUserId !==
         actor.uid
    ){
      throw new HttpsError(
         "permission-denied",
         "You cannot access settlement adjustments for this partner."
      );
    }
}

if (
  !partnerId &&
  !privileged
){
  const partnerSnapshot =
     await firestore
      .collection(
        "servicePartners"
      )
      .where(
        "applicantUserId",
        "==",
        actor.uid
      )
      .limit(1)
      .get();

    if (
      partnerSnapshot.empty
    ){
      return {
         adjustments: [],
         hasMore: false,
         nextCursorId: null,
      };
    }

    partnerId =
     partnerSnapshot.docs[0]!
      .id;
}

const pageSize =
 Math.min(
   Math.max(
     Number.isInteger(
       input.pageSize
     )
       ? input.pageSize!
       : 20,
     1
   ),
   50
 );

let query:
  FirebaseFirestore.Query =
  firestore
    .collection(
      settlementCollections.adjustments
    )
    .orderBy(
      "createdAt",
      "desc"
    );

if (partnerId) {
  query = query.where(
    "partnerId",
    "==",
    partnerId
  );
}

if (
  input.statuses?.length
){
  if (
     input.statuses.some(
       (status) =>
        !validStatuses.has(
          status
        )
     )
  ){

        throw new HttpsError(
          "invalid-argument",
          "One or more adjustment statuses are invalid."
        );
    }

    query = query.where(
      "status",
      "in",
      input.statuses.slice(
        0,
        10
      )
    );
}

if (
  input.types?.length
){
  if (
     input.types.some(
       (type) =>
         !validTypes.has(type)
     )
  ){
     throw new HttpsError(
       "invalid-argument",
       "One or more adjustment types are invalid."
     );
  }

    query = query.where(
      "type",
      "in",
      input.types.slice(
        0,
        10
      )
    );
}

if (
  input.categories?.length
){

    if (
      input.categories.some(
         (category) =>
           !validCategories.has(
             category
           )
      )
    ){
      throw new HttpsError(
         "invalid-argument",
         "One or more adjustment categories are invalid."
      );
    }

    query = query.where(
      "category",
      "in",
      input.categories.slice(
        0,
        10
      )
    );
}

if (
  input.cursorId?.trim()
){
  const cursorSnapshot =
     await firestore
      .collection(
        settlementCollections.adjustments
      )
      .doc(
        input.cursorId.trim()
      )
      .get();

    if (
      !cursorSnapshot.exists
    ){
      throw new HttpsError(
         "invalid-argument",
         "Settlement adjustment cursor is invalid."
      );

    }

    query =
     query.startAfter(
       cursorSnapshot
     );
}

const snapshot =
 await query
  .limit(
    pageSize + 1
  )
  .get();

const documents =
 snapshot.docs.slice(
   0,
   pageSize
 );

return {
 adjustments:
   documents.map(
    (document) => {
     const adjustment =
       document.data() as ServicePartnerSettlementAdjustmentDocument;

        return {
          id: document.id,
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
        };

             }
           ),
          hasMore:
           snapshot.docs.length >
           pageSize,
          nextCursorId:
           snapshot.docs.length >
           pageSize
             ? documents.at(-1)
                ?.id ?? null
             : null,
        };
    }
  );
