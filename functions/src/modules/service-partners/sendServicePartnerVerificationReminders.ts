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

const reminderWindows = [
  30,
  14,
  7,
  3,
  1,
] as const;

function getReminderWindow(
  remainingDays: number
): number | null {
  return (
    reminderWindows.find(
      (window) =>
        remainingDays <= window
    ) ?? null
  );
}

export const sendServicePartnerVerificationReminders =
  onSchedule(
    {
      region:
        "asia-south1",
      schedule:
        "every day 09:00",
      timeZone:
        "Asia/Kolkata",
      timeoutSeconds: 540,
      memory: "1GiB",
      retryCount: 3,
    },
    async () => {
      const now =
        Timestamp.now();

      const maximumExpiry =
        Timestamp.fromMillis(
          now.toMillis() +
            31 *
              24 *
              60 *
              60 *
              1000
        );

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
            ">",
            now
          )
          .where(
            "verification.expiresAt",
            "<=",
            maximumExpiry
          )
          .limit(1000)
          .get();

      let notificationCount = 0;

      for (const document of
        snapshot.docs) {
        const partner =
          document.data() as ServicePartnerDocument;

        const expiresAt =
          partner.verification
            .expiresAt;

        if (!expiresAt) {
          continue;
        }

        const remainingDays =
          Math.ceil(
            (expiresAt.toMillis() -
              now.toMillis()) /
              86_400_000
          );

        const reminderWindow =
          getReminderWindow(
            remainingDays
          );

        if (
          reminderWindow === null
        ) {
          continue;
        }

        const reminderId = `${document.id}_${expiresAt.toMillis()}_${reminderWindow}`;

        const reminderReference =
          firestore
            .collection(
              "servicePartnerVerificationReminders"
            )
            .doc(reminderId);

        const existing =
          await reminderReference.get();

        if (existing.exists) {
          continue;
        }

        const template =
          buildVerificationExpiryNotification(
            {
              partnerId:
                document.id,
              partnerName:
                partner.displayName,
            },
            remainingDays
          );

        const batch =
          firestore.batch();

        batch.create(
          reminderReference,
          {
            partnerId:
              document.id,
            applicantUserId:
              partner.applicantUserId,
            expiresAt,
            remainingDays,
            reminderWindow,
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
              remainingDays,
              expiresAt:
                expiresAt
                  .toDate()
                  .toISOString(),
            },
            read: false,
            createdAt:
              FieldValue.serverTimestamp(),
            updatedAt:
              FieldValue.serverTimestamp(),
          }
        );

        await batch.commit();
        notificationCount += 1;
      }

      logger.info(
        "Service-partner verification reminders completed.",
        {
          evaluatedPartners:
            snapshot.size,
          notificationCount,
        }
      );
    }
  );
