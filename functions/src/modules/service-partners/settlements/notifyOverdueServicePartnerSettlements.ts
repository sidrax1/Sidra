import {
  FieldValue,
  Timestamp,
} from "firebase-admin/firestore";
import {
  logger,
} from "firebase-functions";
import {
  onSchedule,
} from "firebase-functions/v2/scheduler";

import {

  firestore,
} from "../servicePartnerRepository";
import {
  settlementCollections,
} from "./servicePartnerSettlementRepository";
import type {
  ServicePartnerSettlementDocument,
} from "./servicePartnerSettlementTypes";

const overdueThresholdHours =
 72;

export const notifyOverdueServicePartnerSettlements =
 onSchedule(
  {
    region:
      "asia-south1",
    schedule:
      "every day 10:30",
    timeZone:
      "Asia/Kolkata",
    timeoutSeconds: 540,
    memory: "1GiB",
    retryCount: 3,
  },
  async () => {
    const now =
      Timestamp.now();

   const cutoff =
    Timestamp.fromMillis(
      now.toMillis() -
       overdueThresholdHours *
        60 *
        60 *
        1000
    );

   const snapshot =
    await firestore
     .collection(
       settlementCollections.settlements
     )
     .where(

       "status",
       "in",
       [
         "approved",
         "processing",
         "failed",
         "onHold",
       ]
      )
      .where(
        "updatedAt",
        "<=",
        cutoff
      )
      .limit(500)
      .get();

   let notifiedCount = 0;
   let skippedCount = 0;

   for (const document of
    snapshot.docs) {
    const settlement =
      document.data() as ServicePartnerSettlementDocument;

     const notificationKey =
`${document.id}_${settlement.status}_${settlement.updatedAt.toMillis()}`;

     const reminderReference =
      firestore
        .collection(
          "servicePartnerSettlementReminders"
        )
        .doc(
          notificationKey
        );

     const existing =
      await reminderReference.get();

     if (existing.exists) {
       skippedCount += 1;
       continue;
     }

    const ageHours =
     Math.floor(
       (now.toMillis() -
        settlement.updatedAt.toMillis()) /
        3_600_000
     );

    const batch =
     firestore.batch();

    batch.create(
      reminderReference,
      {
        settlementId:
         document.id,
        settlementNumber:
         settlement.settlementNumber,
        partnerId:
         settlement.partnerId,
        applicantUserId:
         settlement.applicantUserId,
        status:
         settlement.status,
        ageHours,
        createdAt: now,
      }
    );

      batch.create(
       firestore
         .collection(
           "notifications"
         )
         .doc(),
       {
         userId:
           settlement.applicantUserId,
         title:
           "Settlement Requires Attention",
         body: `Settlement ${settlement.settlementNumber} has remained ${settlement.status}
for ${ageHours} hours.`,
         type:
           "servicePartnerSettlementOverdue",

          actionURL:
            `/partner/settlements/${document.id}`,
          metadata: {
            settlementId:
              document.id,
            settlementNumber:
              settlement.settlementNumber,
            status:
              settlement.status,
            ageHours,
          },
          read: false,
          createdAt:
            FieldValue.serverTimestamp(),
          updatedAt:
            FieldValue.serverTimestamp(),
      }
    );

     batch.create(
       firestore
         .collection(
           "servicePartnerEvents"
         )
         .doc(),
       {
         eventType:
           "settlement.overdue",
         entityType:
           "settlement",
         entityId:
           document.id,
         partnerId:
           settlement.partnerId,
         actorId: "system",
         actorRole: "system",
         title:
           "Settlement Processing Delay",
         description: `Settlement ${settlement.settlementNumber} has remained
${settlement.status} for ${ageHours} hours.`,
         severity:
           settlement.status ===
             "failed"
             ? "critical"

                     : "warning",
                  metadata: {
                    settlementNumber:
                     settlement.settlementNumber,
                    status:
                     settlement.status,
                    ageHours,
                    netPayablePaise:
                     settlement.totals
                       .netPayablePaise,
                  },
                  occurredAt: now,
                  createdAt: now,
              }
            );

            await batch.commit();
            notifiedCount += 1;
        }

        logger.info(
          "Overdue service-partner settlement notifications completed.",
          {
            evaluatedSettlements:
             snapshot.size,
            notifiedCount,
            skippedCount,
          }
        );
    }
  );
