import {
  Timestamp,
} from "firebase-admin/firestore";
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
import type {
  ServicePartnerDocument,
} from "../servicePartnerTypes";

type ServicePartnerPayoutStatus =
  | "requested"
  | "approved"
  | "rejected"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

type ServicePartnerPayoutMethod =

 | "bankTransfer"
 | "upi"
 | "manualBankTransfer";

interface ListServicePartnerPayoutRequestsInput {
  readonly partnerId?: string;
  readonly statuses?: readonly ServicePartnerPayoutStatus[];
  readonly payoutMethods?: readonly ServicePartnerPayoutMethod[];
  readonly dateFrom?: string;
  readonly dateTo?: string;
  readonly minimumAmountPaise?: number;
  readonly maximumAmountPaise?: number;
  readonly pageSize?: number;
  readonly cursorId?: string;
}

interface ServicePartnerPayoutRequestDocument {
  readonly payoutNumber: string;
  readonly walletId: string;
  readonly partnerId: string;
  readonly partnerNumber: string;
  readonly partnerName: string;
  readonly applicantUserId: string;
  readonly status: ServicePartnerPayoutStatus;
  readonly currency: "INR";
  readonly amountPaise: number;
  readonly payoutMethod: ServicePartnerPayoutMethod;
  readonly accountReference: string;
  readonly requestNote?: string;
  readonly requestedBy: string;
  readonly requestedAt: Timestamp;
  readonly approvedAt?: Timestamp;
  readonly rejectedAt?: Timestamp;
  readonly processingStartedAt?: Timestamp;
  readonly completedAt?: Timestamp;
  readonly failedAt?: Timestamp;
  readonly cancelledAt?: Timestamp;
  readonly paymentReference?: string;
  readonly paymentProvider?: string;
  readonly retryCount?: number;
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
}

const payoutStatuses =
 new Set<ServicePartnerPayoutStatus>([
   "requested",
   "approved",
   "rejected",
   "processing",
   "completed",
   "failed",
   "cancelled",
 ]);

const payoutMethods =
 new Set<ServicePartnerPayoutMethod>([
   "bankTransfer",
   "upi",
   "manualBankTransfer",
 ]);

function parseOptionalTimestamp(
  value: unknown,
  label: string
): Timestamp | undefined {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ){
    return undefined;
  }

 if (typeof value !== "string") {
   throw new HttpsError(
     "invalid-argument",
     `${label} must be an ISO date-time string.`
   );
 }

 const date = new Date(value);

 if (Number.isNaN(date.getTime())) {
   throw new HttpsError(
     "invalid-argument",
     `${label} is invalid.`
   );

    }

    return Timestamp.fromDate(date);
}

function serializeOptionalTimestamp(
  value?: Timestamp
): string | undefined {
  return value
   ? value
       .toDate()
       .toISOString()
   : undefined;
}

export const listServicePartnerPayoutRequests =
 onCall(
  {
    region: "asia-south1",
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
           {}) as ListServicePartnerPayoutRequestsInput;

        const privileged =
         hasPermission(
           actor,
           "servicePartners.readPayouts"
         ) ||
         hasPermission(
           actor,
           "servicePartners.manageWallets"
         ) ||
         hasPermission(

   actor,
   "servicePartners.processPayouts"
 );

let partnerId =
  input.partnerId?.trim();

if (partnerId) {
  const partnerSnapshot =
    await partnerReference(
      partnerId
    ).get();

 if (!partnerSnapshot.exists) {
   throw new HttpsError(
     "not-found",
     "Service partner was not found."
   );
 }

 const partner =
  partnerSnapshot.data() as ServicePartnerDocument;

  if (
    !privileged &&
    partner.applicantUserId !==
       actor.uid
  ){
    throw new HttpsError(
       "permission-denied",
       "You cannot access payouts for this service partner."
    );
  }
} else if (!privileged) {
  const ownedPartnerSnapshot =
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
      ownedPartnerSnapshot.empty
    ){
      return {
         payouts: [],
         hasMore: false,
         nextCursorId: null,
      };
    }

    partnerId =
     ownedPartnerSnapshot.docs[0]!
      .id;
}

if (
  input.statuses?.some(
     (status) =>
       !payoutStatuses.has(
         status
       )
  )
){
  throw new HttpsError(
     "invalid-argument",
     "One or more payout statuses are invalid."
  );
}

if (
  input.payoutMethods?.some(
     (method) =>
       !payoutMethods.has(
         method
       )
  )
){
  throw new HttpsError(
     "invalid-argument",
     "One or more payout methods are invalid."
  );

}

const dateFrom =
 parseOptionalTimestamp(
   input.dateFrom,
   "Start date"
 );

const dateTo =
 parseOptionalTimestamp(
   input.dateTo,
   "End date"
 );

if (
  dateFrom &&
  dateTo &&
  dateFrom.toMillis() >
     dateTo.toMillis()
){
  throw new HttpsError(
     "invalid-argument",
     "Start date cannot be after end date."
  );
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
      "servicePartnerPayoutRequests"

  )
  .orderBy(
    "requestedAt",
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
  input.payoutMethods?.length
){
  query = query.where(
     "payoutMethod",
     "in",
     input.payoutMethods.slice(
       0,
       10
     )
  );
}

if (dateFrom) {
  query = query.where(
    "requestedAt",
    ">=",

      dateFrom
    );
}

if (dateTo) {
  query = query.where(
    "requestedAt",
    "<=",
    dateTo
  );
}

if (
  input.minimumAmountPaise !==
  undefined
){
  if (
     !Number.isInteger(
       input.minimumAmountPaise
     ) ||
     input.minimumAmountPaise <
       0
  ){
     throw new HttpsError(
       "invalid-argument",
       "Minimum payout amount is invalid."
     );
  }

    query = query.where(
      "amountPaise",
      ">=",
      input.minimumAmountPaise
    );
}

if (
  input.maximumAmountPaise !==
  undefined
){
  if (
     !Number.isInteger(
       input.maximumAmountPaise
     ) ||

      input.maximumAmountPaise <
        0
    ){
      throw new HttpsError(
        "invalid-argument",
        "Maximum payout amount is invalid."
      );
    }

    query = query.where(
      "amountPaise",
      "<=",
      input.maximumAmountPaise
    );
}

if (
  input.cursorId?.trim()
){
  const cursorSnapshot =
     await firestore
      .collection(
        "servicePartnerPayoutRequests"
      )
      .doc(
        input.cursorId.trim()
      )
      .get();

    if (
      !cursorSnapshot.exists ||
      (partnerId &&
         cursorSnapshot.data()
           ?.partnerId !==
           partnerId)
    ){
      throw new HttpsError(
         "invalid-argument",
         "Payout cursor is invalid."
      );
    }

    query =
     query.startAfter(

      cursorSnapshot
    );
}

const snapshot =
 await query
  .limit(pageSize + 1)
  .get();

const documents =
 snapshot.docs.slice(
   0,
   pageSize
 );

return {
 payouts:
   documents.map(
    (document) => {
     const payout =
       document.data() as ServicePartnerPayoutRequestDocument;

      return {
       id: document.id,
       ...payout,
       requestedAt:
         payout.requestedAt
           .toDate()
           .toISOString(),
       approvedAt:
         serializeOptionalTimestamp(
           payout.approvedAt
         ),
       rejectedAt:
         serializeOptionalTimestamp(
           payout.rejectedAt
         ),
       processingStartedAt:
         serializeOptionalTimestamp(
           payout.processingStartedAt
         ),
       completedAt:
         serializeOptionalTimestamp(
           payout.completedAt

            ),
           failedAt:
            serializeOptionalTimestamp(
              payout.failedAt
            ),
           cancelledAt:
            serializeOptionalTimestamp(
              payout.cancelledAt
            ),
           createdAt:
            payout.createdAt
              .toDate()
              .toISOString(),
           updatedAt:
            payout.updatedAt
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
        ? documents.at(-1)?.id ??
          null
        : null,
   };
    }
  );
