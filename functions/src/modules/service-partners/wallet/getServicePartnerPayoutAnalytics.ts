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

interface GetServicePartnerPayoutAnalyticsInput {
  readonly partnerId?: string;
  readonly dateFrom?: string;
  readonly dateTo?: string;
}

interface ServicePartnerPayoutRequestDocument {
  readonly partnerId: string;
  readonly status: ServicePartnerPayoutStatus;
  readonly amountPaise: number;
  readonly payoutMethod: ServicePartnerPayoutMethod;
  readonly requestedAt: Timestamp;
  readonly approvedAt?: Timestamp;
  readonly processingStartedAt?: Timestamp;
  readonly completedAt?: Timestamp;
  readonly failedAt?: Timestamp;
  readonly cancelledAt?: Timestamp;

    readonly retryCount?: number;
}

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

    const parsedDate =
     new Date(value);

    if (
      Number.isNaN(
         parsedDate.getTime()
      )
    ){
      throw new HttpsError(
         "invalid-argument",
         `${label} is invalid.`
      );
    }

    return Timestamp.fromDate(
      parsedDate
    );
}

function average(
  values: readonly number[]
): number {

    if (values.length === 0) {
      return 0;
    }

    return (
      values.reduce(
        (
          total,
          value
        ) => total + value,
        0
      ) / values.length
    );
}

export const getServicePartnerPayoutAnalytics =
 onCall(
  {
    region: "asia-south1",
    enforceAppCheck: true,
    cors: true,
    timeoutSeconds: 120,
    memory: "1GiB",
  },
  async (request) => {
    const actor =
      requireAuthenticatedActor(
        request
      );

      const input =
       (request.data ??
         {}) as GetServicePartnerPayoutAnalyticsInput;

      const privileged =
       hasPermission(
         actor,
         "servicePartners.readPayoutAnalytics"
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
       "You cannot access payout analytics for this service partner."
    );
  }
} else if (!privileged) {
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
         analytics: {
           totalPayouts: 0,
           requestedCount: 0,
           approvedCount: 0,
           processingCount: 0,
           completedCount: 0,
           failedCount: 0,
           rejectedCount: 0,
           cancelledCount: 0,
           totalRequestedPaise: 0,
           completedAmountPaise: 0,
           pendingAmountPaise: 0,
           failedAmountPaise: 0,
           rejectedAmountPaise: 0,
           averagePayoutPaise: 0,
           paymentSuccessRate: 100,
           averageApprovalHours: 0,
           averageCompletionHours: 0,
           totalRetryCount: 0,
           statusBreakdown: [],
           methodBreakdown: [],
         },
      };
    }

    partnerId =
     partnerSnapshot.docs[0]!
      .id;
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

let query:
  FirebaseFirestore.Query =
  firestore.collection(
    "servicePartnerPayoutRequests"
  );

if (partnerId) {
  query = query.where(
    "partnerId",
    "==",
    partnerId
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

const snapshot =
 await query
  .orderBy(
    "requestedAt",
    "desc"
  )
  .limit(5000)
  .get();

const payouts =
 snapshot.docs.map(
   (document) =>
    document.data() as ServicePartnerPayoutRequestDocument
 );

const completed =
 payouts.filter(
   (payout) =>
    payout.status ===
    "completed"
 );

const failed =
 payouts.filter(
   (payout) =>
    payout.status ===
    "failed"
 );

const pending =
 payouts.filter(
   (payout) =>
    [
      "requested",
      "approved",
      "processing",
    ].includes(
      payout.status
    )
 );

const approvalHours =
 payouts
  .filter(
    (payout) =>
      Boolean(
        payout.approvedAt
      )
  )
  .map((payout) =>
    Math.max(
      (payout.approvedAt!.toMillis() -
        payout.requestedAt.toMillis()) /
        3_600_000,
      0
    )
  );

const completionHours =
 completed
  .filter(
    (payout) =>
      Boolean(
        payout.completedAt
      )
  )
  .map((payout) =>
    Math.max(
      (payout.completedAt!.toMillis() -
        payout.requestedAt.toMillis()) /
        3_600_000,
      0
    )
  );

const payoutStatuses: readonly ServicePartnerPayoutStatus[] =
 [
   "requested",
   "approved",
   "rejected",
   "processing",
   "completed",
   "failed",
   "cancelled",
 ];

const payoutMethods: readonly ServicePartnerPayoutMethod[] =
 [
   "bankTransfer",
   "upi",
   "manualBankTransfer",
 ];

const paymentAttempts =
 completed.length +
 failed.length;

const totalRequestedPaise =
 payouts.reduce(
   (
     total,
     payout
   ) =>
     total +
     payout.amountPaise,
   0
 );

return {
 analytics: {
   totalPayouts:
    payouts.length,
   requestedCount:
    payouts.filter(
      (payout) =>
        payout.status ===
        "requested"
    ).length,
   approvedCount:
    payouts.filter(
      (payout) =>
        payout.status ===
        "approved"
    ).length,
   processingCount:
    payouts.filter(
      (payout) =>
        payout.status ===
        "processing"

 ).length,
completedCount:
 completed.length,
failedCount:
 failed.length,
rejectedCount:
 payouts.filter(
   (payout) =>
     payout.status ===
     "rejected"
 ).length,
cancelledCount:
 payouts.filter(
   (payout) =>
     payout.status ===
     "cancelled"
 ).length,
totalRequestedPaise,
completedAmountPaise:
 completed.reduce(
   (
     total,
     payout
   ) =>
     total +
     payout.amountPaise,
   0
 ),
pendingAmountPaise:
 pending.reduce(
   (
     total,
     payout
   ) =>
     total +
     payout.amountPaise,
   0
 ),
failedAmountPaise:
 failed.reduce(
   (
     total,
     payout
   ) =>

     total +
     payout.amountPaise,
   0
 ),
rejectedAmountPaise:
 payouts
   .filter(
     (payout) =>
       payout.status ===
       "rejected"
   )
   .reduce(
     (
       total,
       payout
     ) =>
       total +
       payout.amountPaise,
     0
   ),
averagePayoutPaise:
 payouts.length > 0
   ? Math.round(
       totalRequestedPaise /
         payouts.length
     )
   : 0,
paymentSuccessRate:
 paymentAttempts > 0
   ? Number(
       (
         (completed.length /
          paymentAttempts) *
         100
       ).toFixed(2)
     )
   : 100,
averageApprovalHours:
 Number(
   average(
     approvalHours
   ).toFixed(2)
 ),
averageCompletionHours:

 Number(
   average(
     completionHours
   ).toFixed(2)
 ),
totalRetryCount:
 payouts.reduce(
   (
     total,
     payout
   ) =>
     total +
     (payout.retryCount ??
      0),
   0
 ),
statusBreakdown:
 payoutStatuses.map(
   (status) => {
     const matching =
      payouts.filter(
        (payout) =>
         payout.status ===
         status
      );

   return {
     status,
     count:
      matching.length,
     amountPaise:
      matching.reduce(
        (
          total,
          payout
        ) =>
          total +
          payout.amountPaise,
        0
      ),
   };
   }
 ),
methodBreakdown:

              payoutMethods.map(
               (payoutMethod) => {
                const matching =
                 payouts.filter(
                   (payout) =>
                    payout.payoutMethod ===
                    payoutMethod
                 );

                    return {
                      payoutMethod,
                      count:
                       matching.length,
                      amountPaise:
                       matching.reduce(
                         (
                           total,
                           payout
                         ) =>
                           total +
                           payout.amountPaise,
                         0
                       ),
                    };
                }
              ),
         },
       };
   }
 );
