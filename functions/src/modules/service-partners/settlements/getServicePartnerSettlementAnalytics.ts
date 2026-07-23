s

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
import {
  settlementCollections,
} from "./servicePartnerSettlementRepository";
import type {
  ServicePartnerSettlementDocument,
  ServicePartnerSettlementStatus,
} from "./servicePartnerSettlementTypes";

interface GetSettlementAnalyticsInput {
  readonly partnerId?: string;
  readonly periodStart?: string;
  readonly periodEnd?: string;

}

interface SettlementStatusBreakdown {
  readonly status: ServicePartnerSettlementStatus;
  readonly count: number;
  readonly netPayablePaise: number;
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

    if (
      typeof value !== "string"
    ){
      throw new HttpsError(
         "invalid-argument",
         `${label} must be an ISO date-time string.`
      );
    }

    const date = new Date(value);

    if (
      Number.isNaN(
         date.getTime()
      )
    ){
      throw new HttpsError(
         "invalid-argument",
         `${label} is invalid.`
      );
    }

    return Timestamp.fromDate(
     date

    );
}

export const getServicePartnerSettlementAnalytics =
 onCall(
  {
    region:
      "asia-south1",
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
            {}) as GetSettlementAnalyticsInput;

         const privileged =
          hasPermission(
            actor,
            "servicePartners.readSettlementAnalytics"
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
         "You cannot access settlement analytics for this partner."
      );
    }
}

if (
  !partnerId &&
  !privileged
){
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
         analytics: {
          totalSettlements: 0,
          paidSettlements: 0,
          pendingSettlements: 0,
          failedSettlements: 0,
          grossAmountPaise: 0,
          totalDeductionsPaise: 0,
          netPayablePaise: 0,
          paidAmountPaise: 0,

            pendingAmountPaise: 0,
            failedAmountPaise: 0,
            averageSettlementPaise: 0,
            assignmentEarningsPaise: 0,
            bonusPaise: 0,
            taxDeductionPaise: 0,
            platformFeePaise: 0,
            penaltiesPaise: 0,
            recoveriesPaise: 0,
            statusBreakdown: [],
          },
        };
    }

    partnerId =
     ownedPartnerSnapshot.docs[0]!
      .id;
}

const periodStart =
 parseOptionalTimestamp(
   input.periodStart,
   "Settlement period start"
 );

const periodEnd =
 parseOptionalTimestamp(
   input.periodEnd,
   "Settlement period end"
 );

if (
  periodStart &&
  periodEnd &&
  periodStart.toMillis() >
     periodEnd.toMillis()
){
  throw new HttpsError(
     "invalid-argument",
     "Settlement period start cannot be after the end date."
  );
}

let query:

 FirebaseFirestore.Query =
 firestore.collection(
   settlementCollections.settlements
 );

if (partnerId) {
  query = query.where(
    "partnerId",
    "==",
    partnerId
  );
}

if (periodStart) {
  query = query.where(
    "periodEnd",
    ">=",
    periodStart
  );
}

if (periodEnd) {
  query = query.where(
    "periodEnd",
    "<=",
    periodEnd
  );
}

const snapshot =
 await query
  .orderBy(
    "periodEnd",
    "desc"
  )
  .limit(5000)
  .get();

const settlements =
 snapshot.docs.map(
   (document) =>
    document.data() as ServicePartnerSettlementDocument
 );

const includedSettlements =
 settlements.filter(
   (settlement) =>
    settlement.status !==
    "cancelled"
 );

const paidSettlements =
 includedSettlements.filter(
   (settlement) =>
    settlement.status ===
    "paid"
 );

const pendingSettlements =
 includedSettlements.filter(
   (settlement) =>
    [
      "draft",
      "calculated",
      "underReview",
      "approved",
      "processing",
      "onHold",
    ].includes(
      settlement.status
    )
 );

const failedSettlements =
 includedSettlements.filter(
   (settlement) =>
    settlement.status ===
    "failed"
 );

const grossAmountPaise =
 includedSettlements.reduce(
   (
     total,
     settlement
   ) =>
     total +
     settlement.totals

       .grossAmountPaise,
   0
 );

const totalDeductionsPaise =
 includedSettlements.reduce(
   (
     total,
     settlement
   ) =>
     total +
     settlement.totals
      .totalDeductionsPaise,
   0
 );

const netPayablePaise =
 includedSettlements.reduce(
   (
     total,
     settlement
   ) =>
     total +
     settlement.totals
      .netPayablePaise,
   0
 );

const paidAmountPaise =
 paidSettlements.reduce(
   (
     total,
     settlement
   ) =>
     total +
     settlement.totals
      .netPayablePaise,
   0
 );

const pendingAmountPaise =
 pendingSettlements.reduce(
  (
    total,

     settlement
   ) =>
     total +
     settlement.totals
      .netPayablePaise,
   0
 );

const failedAmountPaise =
 failedSettlements.reduce(
   (
     total,
     settlement
   ) =>
     total +
     settlement.totals
      .netPayablePaise,
   0
 );

const statuses: readonly ServicePartnerSettlementStatus[] =
 [
   "draft",
   "calculated",
   "underReview",
   "approved",
   "processing",
   "paid",
   "failed",
   "cancelled",
   "onHold",
 ];

const statusBreakdown: readonly SettlementStatusBreakdown[] =
 statuses
  .map((status) => {
    const matching =
     settlements.filter(
       (settlement) =>
        settlement.status ===
        status
     );

   return {

      status,
      count:
        matching.length,
      netPayablePaise:
        matching.reduce(
          (
            total,
            settlement
          ) =>
            total +
            settlement.totals
             .netPayablePaise,
          0
        ),
    };
  })
  .filter(
    (entry) =>
      entry.count > 0
  );

return {
 analytics: {
   totalSettlements:
    includedSettlements.length,
   paidSettlements:
    paidSettlements.length,
   pendingSettlements:
    pendingSettlements.length,
   failedSettlements:
    failedSettlements.length,
   grossAmountPaise,
   totalDeductionsPaise,
   netPayablePaise,
   paidAmountPaise,
   pendingAmountPaise,
   failedAmountPaise,
   averageSettlementPaise:
    includedSettlements.length >
    0
      ? Math.round(
          netPayablePaise /
           includedSettlements.length
        )

   : 0,
assignmentEarningsPaise:
 includedSettlements.reduce(
   (
     total,
     settlement
   ) =>
     total +
     settlement.totals
      .assignmentEarningsPaise,
   0
 ),
bonusPaise:
 includedSettlements.reduce(
   (
     total,
     settlement
   ) =>
     total +
     settlement.totals
      .bonusPaise,
   0
 ),
taxDeductionPaise:
 includedSettlements.reduce(
   (
     total,
     settlement
   ) =>
     total +
     settlement.totals
      .taxDeductionPaise,
   0
 ),
platformFeePaise:
 includedSettlements.reduce(
   (
     total,
     settlement
   ) =>
     total +
     settlement.totals
      .platformFeePaise,
   0

             ),
            penaltiesPaise:
             includedSettlements.reduce(
               (
                 total,
                 settlement
               ) =>
                 total +
                 settlement.totals
                  .penaltiesPaise,
               0
             ),
            recoveriesPaise:
             includedSettlements.reduce(
               (
                 total,
                 settlement
               ) =>
                 total +
                 settlement.totals
                  .recoveriesPaise,
               0
             ),
            statusBreakdown,
          },
        };
    }
  );
