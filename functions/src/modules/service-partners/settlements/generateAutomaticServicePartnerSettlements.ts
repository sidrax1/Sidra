import {
  Timestamp,
} from "firebase-admin/firestore";
import {
  logger,
} from "firebase-functions";
import {
  onSchedule,
} from "firebase-functions/v2/scheduler";

import {
  createAuditLog,
  createNotification,
  formatSequence,
  firestore,
  nextSequenceNumber,
} from "../servicePartnerRepository";
import {
  calculateSettlementData,
} from "./calculateServicePartnerSettlement";
import {
  settlementCollections,

  settlementReference,
} from "./servicePartnerSettlementRepository";
import type {
  ServicePartnerSettlementDocument,
  ServicePartnerSettlementProfileDocument,
} from "./servicePartnerSettlementTypes";

interface AutomaticSettlementPeriod {
  readonly periodStart: Date;
  readonly periodEnd: Date;
}

function startOfDay(
  date: Date
): Date {
  const normalized =
   new Date(date);

    normalized.setHours(
      0,
      0,
      0,
      0
    );

    return normalized;
}

function endOfPreviousDay(
  date: Date
): Date {
  const normalized =
   startOfDay(date);

    normalized.setMilliseconds(
      -1
    );

    return normalized;
}

function getSettlementPeriod(
 profile: ServicePartnerSettlementProfileDocument,
 now: Date

): AutomaticSettlementPeriod | null {
  const periodEnd =
   endOfPreviousDay(now);

    const periodStart =
     startOfDay(periodEnd);

    if (
      profile.settlementCycle ===
      "weekly"
    ){
      periodStart.setDate(
         periodStart.getDate() -
          6
      );
    } else if (
      profile.settlementCycle ===
      "fortnightly"
    ){
      periodStart.setDate(
         periodStart.getDate() -
          13
      );
    } else if (
      profile.settlementCycle ===
      "monthly"
    ){
      periodStart.setDate(1);
    } else {
      return null;
    }

    return {
      periodStart,
      periodEnd,
    };
}

function shouldRunCycle(
  profile: ServicePartnerSettlementProfileDocument,
  now: Date
): boolean {
  const day = now.getDay();
  const date = now.getDate();

    if (
      profile.settlementCycle ===
      "weekly"
    ){
      return day === 1;
    }

    if (
      profile.settlementCycle ===
      "fortnightly"
    ){
      return (
         date === 1 ||
         date === 16
      );
    }

    if (
      profile.settlementCycle ===
      "monthly"
    ){
      return date === 1;
    }

    return false;
}

async function createAutomaticSettlement(
  profile: ServicePartnerSettlementProfileDocument,
  period: AutomaticSettlementPeriod
): Promise<
  | "created"
  | "skipped"
>{
  const periodStartISO =
    period.periodStart.toISOString();

    const periodEndISO =
     period.periodEnd.toISOString();

    const existingSnapshot =
     await firestore
      .collection(

   settlementCollections.settlements
  )
  .where(
    "partnerId",
    "==",
    profile.partnerId
  )
  .where(
    "periodStart",
    "==",
    Timestamp.fromDate(
      period.periodStart
    )
  )
  .where(
    "periodEnd",
    "==",
    Timestamp.fromDate(
      period.periodEnd
    )
  )
  .limit(1)
  .get();

if (
  !existingSnapshot.empty
){
  return "skipped";
}

const calculation =
 await calculateSettlementData(
  {
    partnerId:
      profile.partnerId,
    periodStart:
      periodStartISO,
    periodEnd:
      periodEndISO,
    cycle:
      profile.settlementCycle,
    includePendingAdjustments:
      true,
  }

 );

if (
  calculation.lines.length ===
     0 ||
  calculation.totals
     .netPayablePaise <
     profile.minimumSettlementPaise
){
  return "skipped";
}

const reference =
 settlementReference(
   firestore
     .collection(
       settlementCollections.settlements
     )
     .doc().id
 );

await firestore.runTransaction(
 async (transaction) => {
  const duplicateQuery =
   firestore
     .collection(
       settlementCollections.settlements
     )
     .where(
       "partnerId",
       "==",
       profile.partnerId
     )
     .where(
       "periodStart",
       "==",
       Timestamp.fromDate(
         period.periodStart
       )
     )
     .where(
       "periodEnd",
       "==",
       Timestamp.fromDate(

     period.periodEnd
    )
  )
  .limit(1);

const duplicateSnapshot =
 await transaction.get(
   duplicateQuery
 );

if (
  !duplicateSnapshot.empty
){
  return;
}

const sequence =
 await nextSequenceNumber(
   transaction,
   "servicePartnerSettlements"
 );

const settlementNumber =
 formatSequence(
   "SPS",
   sequence,
   8
 );

const now =
 Timestamp.now();

const settlement: ServicePartnerSettlementDocument =
 {
   settlementNumber,
   partnerId:
    calculation.partner.id,
   partnerNumber:
    calculation.partner
     .partnerNumber,
   partnerName:
    calculation.partner
     .partnerName,
   applicantUserId:

     calculation.partner
       .applicantUserId,
   cycle:
     profile.settlementCycle,
   periodStart:
     Timestamp.fromDate(
       period.periodStart
     ),
   periodEnd:
     Timestamp.fromDate(
       period.periodEnd
     ),
   status:
     "underReview",
   currency: "INR",
   totals:
     calculation.totals,
   lineCount:
     calculation.lines.length,
   assignmentIds:
     calculation.assignmentIds,
   bankSnapshot:
     profile.bankAccount,
   reviewNote:
     "Automatically generated according to the partner settlement cycle.",
   calculatedBy:
     "system",
   calculatedAt: now,
   createdAt: now,
   updatedAt: now,
 };

transaction.create(
  reference,
  settlement
);

for (const line of
 calculation.lines) {
 transaction.create(
   reference
     .collection(
       "lines"
     )

        .doc(line.id),
      line
    );

    if (
      line.referenceType ===
      "adjustment"
    ){
      transaction.update(
         firestore
           .collection(
             settlementCollections.adjustments
           )
           .doc(
             line.referenceId
           ),
         {
           status:
             "consumed",
           settlementId:
             reference.id,
           consumedAt: now,
           updatedAt: now,
         }
      );
    }
}

await createAuditLog(
 {
   actor: {
     uid: "system",
     role: "system",
     permissions: [],
   },
   action:
     "servicePartnerSettlement.automaticallyGenerated",
   entityType:
     "partner",
   entityId:
     profile.partnerId,
   metadata: {
     settlementId:
      reference.id,

            settlementNumber,
            periodStart:
              periodStartISO,
            periodEnd:
              periodEndISO,
            lineCount:
              calculation.lines.length,
            netPayablePaise:
              calculation.totals
               .netPayablePaise,
          },
        },
        transaction
      );

     await createNotification(
       {
         userId:
           calculation.partner
             .applicantUserId,
         title:
           "Settlement Generated",
         body: `Settlement ${settlementNumber} has been automatically generated and is under
review.`,
         type:
           "servicePartnerSettlementAutomaticallyGenerated",
         actionURL:
           `/partner/settlements/${reference.id}`,
         metadata: {
           settlementId:
             reference.id,
           settlementNumber,
           netPayablePaise:
             calculation.totals
              .netPayablePaise,
         },
       },
       transaction
     );
   }
 );

    return "created";
}

export const generateAutomaticServicePartnerSettlements =
 onSchedule(
  {
    region:
      "asia-south1",
    schedule:
      "every day 01:30",
    timeZone:
      "Asia/Kolkata",
    timeoutSeconds: 540,
    memory: "1GiB",
    retryCount: 3,
  },
  async () => {
    const now = new Date();

   const profileSnapshot =
    await firestore
     .collection(
       settlementCollections.settlementProfiles
     )
     .where(
       "automaticSettlementEnabled",
       "==",
       true
     )
     .limit(1000)
     .get();

   let createdCount = 0;
   let skippedCount = 0;
   let failureCount = 0;

   for (const document of
    profileSnapshot.docs) {
    const profile =
      document.data() as ServicePartnerSettlementProfileDocument;

    if (
      !shouldRunCycle(
         profile,
         now
      )

){
  skippedCount += 1;
  continue;
}

const period =
 getSettlementPeriod(
   profile,
   now
 );

if (!period) {
  skippedCount += 1;
  continue;
}

try {
  const result =
   await createAutomaticSettlement(
     profile,
     period
   );

  if (
    result === "created"
  ){
    createdCount += 1;
  } else {
    skippedCount += 1;
  }
} catch (error) {
  failureCount += 1;

    logger.error(
      "Automatic service-partner settlement generation failed.",
      {
        partnerId:
         profile.partnerId,
        settlementCycle:
         profile.settlementCycle,
        error,
      }
    );
}

        }

        logger.info(
          "Automatic service-partner settlement generation completed.",
          {
            evaluatedProfiles:
             profileSnapshot.size,
            createdCount,
            skippedCount,
            failureCount,
          }
        );
    }
  );
