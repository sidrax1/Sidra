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
} from "./servicePartnerRepository";
import {
  buildVerificationExpiryNotification,
} from "./servicePartnerNotificationTemplates";
import type {
  ServicePartnerDocument,
} from "./servicePartnerTypes";

export const archiveExpiredServicePartnerVerifications =
  onSchedule(
    {
      region:
        "asia-south1",
      schedule:
        "every day 02:15",
      timeZone:
        "Asia/Kolkata",
      timeoutSeconds: 540,
      memory: "1GiB",
      retryCount: 3,
    },
    async () => {
      const now =
        Timestamp.now();

      const snapshot =
        await firestore
          .collection(
            "servicePartners"
          )
          .where(
            "verification.status",
            "==",
            "verified"
          )
          .where(
            "verification.expiresAt",
            "<=",
            now
          )
          .limit(500)
          .get();

      if (snapshot.empty) {
        logger.info(
          "No expired service-partner verifications found."
        );

        return;
      }

      let batch =
        firestore.batch();

      let batchOperationCount =
        0;

      const commitBatch =
        async (): Promise<void> => {
          if (
            batchOperationCount === 0
          ) {
            return;
          }

          await batch.commit();
          batch =
            firestore.batch();
          batchOperationCount = 0;
        };

      for (const document of
        snapshot.docs) {
        const partner =
          document.data() as ServicePartnerDocument;

        batch.update(
          document.ref,
          {
            acceptingAssignments:
              false,
            "verification.status":
              "expired",
            verificationExpiredAt:
              now,
            updatedAt: now,
          }
        );

        batchOperationCount += 1;

        const template =
          buildVerificationExpiryNotification(
            {
              partnerId:
                document.id,
              partnerName:
                partner.displayName,
            },
            0
          );

        const notificationReference =
          firestore
            .collection(
              "notifications"
            )
            .doc();

        batch.create(
          notificationReference,
          {
            userId:
              partner.applicantUserId,
            title:
              template.title,
            body:
              template.body,
            type:
              template.type,
            actionURL:
              "/partner/verification",
            metadata: {
              partnerId:
                document.id,
            },
            read: false,
            createdAt:
              FieldValue.serverTimestamp(),
            updatedAt:
              FieldValue.serverTimestamp(),
          }
        );

        batchOperationCount += 1;

        const eventReference =
          firestore
            .collection(
              "servicePartnerEvents"
            )
            .doc();

        batch.create(
          eventReference,
          {
            eventType:
              "verification.expired",
            entityType:
              "verification",
            entityId:
              document.id,
            partnerId:
              document.id,
            actorId: "system",
            actorRole: "system",
            title:
              "Partner Verification Expired",
            description: `${partner.displayName}'s service-partner verification expired.`,
            severity:
              "critical",
            metadata: {
              expiresAt:
                partner.verification.expiresAt
                  ?.toDate()
                  .toISOString(),
            },
            occurredAt: now,
            createdAt: now,
          }
        );

        batchOperationCount += 1;

        if (
          batchOperationCount >=
          450
        ) {
          await commitBatch();
        }
      }

      await commitBatch();

      logger.info(
        "Expired service-partner verifications processed.",
        {
          partnerCount:
            snapshot.size,
        }
      );
    }
  );
