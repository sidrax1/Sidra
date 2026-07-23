import {
  Timestamp,
} from "firebase-admin/firestore";
import {
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";

import {
  applicationReference,
  createAuditLog,
  createNotification,
  firestore,
  requireAuthenticatedActor,
} from "./servicePartnerRepository";
import {
  enforceServicePartnerRateLimit,
} from "./servicePartnerRateLimit";
import {
  serializeServicePartnerApplication,
} from "./servicePartnerSerializers";
import type {
  ServicePartnerApplicationDocument,
} from "./servicePartnerTypes";

interface WithdrawApplicationInput {
  readonly applicationId: string;
  readonly reason: string;
}

export const withdrawServicePartnerApplication =
  onCall(
    {
      region:
        "asia-south1",
      enforceAppCheck: true,
      cors: true,
      timeoutSeconds: 60,
      memory: "256MiB",
    },
    async (request) => {
      const actor =
        requireAuthenticatedActor(
          request
        );

      await enforceServicePartnerRateLimit(
        {
          actorId: actor.uid,
          action:
            "withdraw-service-partner-application",
          maximumAttempts: 5,
          windowSeconds: 3600,
        }
      );

      const data =
        request.data as Partial<WithdrawApplicationInput>;

      const applicationId =
        typeof data.applicationId ===
          "string"
          ? data.applicationId.trim()
          : "";

      const reason =
        typeof data.reason ===
          "string"
          ? data.reason.trim()
          : "";

      if (!applicationId) {
        throw new HttpsError(
          "invalid-argument",
          "Application ID is required."
        );
      }

      if (
        reason.length < 10 ||
        reason.length > 1000
      ) {
        throw new HttpsError(
          "invalid-argument",
          "Withdrawal reason must contain between 10 and 1000 characters."
        );
      }

      const reference =
        applicationReference(
          applicationId
        );

      const application =
        await firestore.runTransaction(
          async (
            transaction
          ) => {
            const snapshot =
              await transaction.get(
                reference
              );

            if (!snapshot.exists) {
              throw new HttpsError(
                "not-found",
                "Service-partner application was not found."
              );
            }

            const current =
              snapshot.data() as ServicePartnerApplicationDocument;

            if (
              current.applicantUserId !==
              actor.uid
            ) {
              throw new HttpsError(
                "permission-denied",
                "You cannot withdraw another user's application."
              );
            }

            if (
              ![
                "draft",
                "submitted",
                "underReview",
                "additionalInformationRequired",
              ].includes(
                current.status
              )
            ) {
              throw new HttpsError(
                "failed-precondition",
                `Applications with status ${current.status} cannot be withdrawn.`
              );
            }

            const now =
              Timestamp.now();

            const updated: ServicePartnerApplicationDocument =
              {
                ...current,
                status:
                  "withdrawn",
                reviewerNote:
                  reason,
                reviewedAt: now,
                updatedAt: now,
              };

            transaction.update(
              reference,
              {
                status:
                  "withdrawn",
                withdrawalReason:
                  reason,
                withdrawnAt: now,
                reviewedAt: now,
                updatedAt: now,
              }
            );

            await createAuditLog(
              {
                actor,
                action:
                  "servicePartnerApplication.withdrawn",
                entityType:
                  "application",
                entityId:
                  reference.id,
                metadata: {
                  applicationNumber:
                    current.applicationNumber,
                  previousStatus:
                    current.status,
                  reason,
                },
              },
              transaction
            );

            await createNotification(
              {
                userId:
                  actor.uid,
                title:
                  "Application Withdrawn",
                body: `Service-partner application ${current.applicationNumber} was withdrawn.`,
                type:
                  "servicePartnerApplicationWithdrawn",
                actionURL:
                  `/account/service-partner-applications/${reference.id}`,
                metadata: {
                  applicationId:
                    reference.id,
                  applicationNumber:
                    current.applicationNumber,
                },
              },
              transaction
            );

            return updated;
          }
        );

      return {
        application:
          serializeServicePartnerApplication(
            reference.id,
            application
          ),
      };
    }
  );
