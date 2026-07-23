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

interface ListSettlementPaymentEventsInput {
  readonly partnerId?: string;
  readonly settlementId?: string;
  readonly statuses?: readonly (
    | "processing"
    | "paid"
    | "failed"
  )[];

    readonly pageSize?: number;
    readonly cursorId?: string;
}

interface SettlementPaymentEventDocument {
  readonly settlementId: string;
  readonly settlementNumber: string;
  readonly partnerId: string;
  readonly partnerNumber: string;
  readonly applicantUserId: string;
  readonly eventType: string;
  readonly status:
   | "processing"
   | "paid"
   | "failed";
  readonly amountPaise: number;
  readonly currency: "INR";
  readonly paymentMethod?: string | null;
  readonly paymentReference?: string | null;
  readonly paymentProvider?: string | null;
  readonly failureReason?: string | null;
  readonly processedBy: string;
  readonly processedAt: FirebaseFirestore.Timestamp;
  readonly createdAt: FirebaseFirestore.Timestamp;
}

const validStatuses =
 new Set([
   "processing",
   "paid",
   "failed",
 ]);

export const listServicePartnerSettlementPaymentEvents =
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
   {}) as ListSettlementPaymentEventsInput;

const privileged =
 hasPermission(
   actor,
   "servicePartners.readSettlementPaymentEvents"
 ) ||
 hasPermission(
   actor,
   "servicePartners.manageSettlements"
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
         "You cannot access payment events for this partner."
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
         paymentEvents: [],
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
       : 25,
     1
   ),
   100
 );

let query:
  FirebaseFirestore.Query =
  firestore
    .collection(
      settlementCollections.paymentEvents
    )
    .orderBy(
      "processedAt",
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
  input.settlementId?.trim()
){
  query = query.where(
     "settlementId",
     "==",
     input.settlementId.trim()
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
       "One or more payment-event statuses are invalid."

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
  input.cursorId?.trim()
){
  const cursorSnapshot =
     await firestore
      .collection(
        settlementCollections.paymentEvents
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
         "Payment-event cursor is invalid."
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
         paymentEvents:
           documents.map(
            (document) => {
             const event =
               document.data() as SettlementPaymentEventDocument;

            return {
              id: document.id,
              ...event,
              processedAt:
                event.processedAt
                 .toDate()
                 .toISOString(),
              createdAt:
                event.createdAt
                 .toDate()
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
