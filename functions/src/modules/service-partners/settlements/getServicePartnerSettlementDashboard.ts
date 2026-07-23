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
  serializeSettlement,
  settlementCollections,
  settlementProfileReference,
} from "./servicePartnerSettlementRepository";
import {
  calculateServicePartnerSettlementMetrics,
} from "./servicePartnerSettlementMetrics";
import type {
  ServicePartnerSettlementDocument,
  ServicePartnerSettlementProfileDocument,
} from "./servicePartnerSettlementTypes";

interface GetServicePartnerSettlementDashboardInput {
  readonly partnerId?: string;
  readonly periodDays?: number;
}

export const getServicePartnerSettlementDashboard =
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
   {}) as GetServicePartnerSettlementDashboardInput;

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
         "You cannot access the settlement dashboard for this partner."
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
         dashboard: {
           profile: null,
           metrics:
            calculateServicePartnerSettlementMetrics(
              []
            ),
           recentSettlements:
            [],
           overdueCount: 0,
         },
      };
    }

    partnerId =
     partnerSnapshot.docs[0]!
      .id;
}

const periodDays =
 Number.isInteger(
   input.periodDays
 )
   ? Math.min(
      Math.max(

       input.periodDays!,
       7
     ),
     730
    )
  : 90;

const periodStart =
 Timestamp.fromMillis(
   Date.now() -
    periodDays *
     86_400_000
 );

let settlementQuery:
  FirebaseFirestore.Query =
  firestore
    .collection(
      settlementCollections.settlements
    )
    .where(
      "createdAt",
      ">=",
      periodStart
    )
    .orderBy(
      "createdAt",
      "desc"
    );

if (partnerId) {
  settlementQuery =
    settlementQuery.where(
      "partnerId",
      "==",
      partnerId
    );
}

const [
  settlementSnapshot,
  profileSnapshot,
] = await Promise.all([
  settlementQuery

    .limit(5000)
    .get(),
  partnerId
    ? settlementProfileReference(
        partnerId
      ).get()
    : Promise.resolve(
        null
      ),
]);

const settlements =
 settlementSnapshot.docs.map(
   (document) =>
    document.data() as ServicePartnerSettlementDocument
 );

const metrics =
 calculateServicePartnerSettlementMetrics(
   settlements
 );

const overdueCutoff =
 Date.now() -
 72 *
  60 *
  60 *
  1000;

const overdueCount =
 settlements.filter(
   (settlement) =>
     [
       "approved",
       "processing",
       "failed",
       "onHold",
     ].includes(
       settlement.status
     ) &&
     settlement.updatedAt.toMillis() <=
       overdueCutoff
 ).length;

const profile =
 profileSnapshot &&
 profileSnapshot.exists
  ? (profileSnapshot.data() as ServicePartnerSettlementProfileDocument)
  : null;

return {
 dashboard: {
   periodDays,
   partnerId:
    partnerId ?? null,
   metrics,
   overdueCount,
   profile: profile
    ?{
        ...profile,
        bankAccount:
          profile.bankAccount
           ?{
               ...profile.bankAccount,
               verifiedAt:
                 profile.bankAccount.verifiedAt
                  ?.toDate()
                  .toISOString(),
             }
           : undefined,
        createdAt:
          profile.createdAt
           .toDate()
           .toISOString(),
        updatedAt:
          profile.updatedAt
           .toDate()
           .toISOString(),
      }
    : null,
   recentSettlements:
    settlementSnapshot.docs
      .slice(0, 10)
      .map(
        (document) =>
          serializeSettlement(
           document.id,
           document.data() as ServicePartnerSettlementDocument

                    )
               ),
          },
        };
    }
  );
