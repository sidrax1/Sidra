import {
  FieldValue,
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

interface ResubmitApplicationInput {
  readonly applicationId: string;
  readonly documentPaths: readonly string[];
  readonly applicantNote: string;
}

export const resubmitServicePartnerApplication =
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
            "resubmit-service-partner-application",
          maximumAttempts: 8,
          windowSeconds: 3600,
        }
      );

      const input =
        request.data as Partial<ResubmitApplicationInput>;

      const applicationId =
        typeof input.applicationId ===
          "string"
          ? input.applicationId.trim()
          : "";

      const applicantNote =
        typeof input.applicantNote ===
          "string"
          ? input.applicantNote.trim()
          : "";

      const documentPaths =
        Array.isArray(
          input.documentPaths
        )
          ? [
              ...new Set(
                input.documentPaths
                  .filter(
                    (
                      path
                    ): path is string =>
                      typeof path ===
                      "string"
                  )
                  .map((path) =>
                    path.trim()
                  )
                  .filter(Boolean)
              ),
            ]
          : [];

      if (!applicationId) {
        throw new HttpsError(
          "invalid-argument",
          "Application ID is required."
        );
      }

      if (
        documentPaths.length < 1 ||
        documentPaths.length > 25
      ) {
        throw new HttpsError(
          "invalid-argument",
          "Between 1 and 25 verification documents are required."
        );
      }

      if (
        applicantNote.length < 10 ||
        applicantNote.length >
          2000
      ) {
        throw new HttpsError(
          "invalid-argument",
          "Applicant note must contain between 10 and 2000 characters."
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
                "You cannot resubmit another user's application."
              );
            }

            if (
              current.status !==
              "additionalInformationRequired"
            ) {
              throw new HttpsError(
                "failed-precondition",
                "Only applications requiring additional information can be resubmitted."
              );
            }

            const now =
              Timestamp.now();

            const updated: ServicePartnerApplicationDocument =
              {
                ...current,
                documentPaths,
                status:
                  "submitted",
                reviewerId:
                  undefined,
                reviewerNote:
                  undefined,
                submittedAt: now,
                reviewedAt:
                  undefined,
                updatedAt: now,
              };

            transaction.update(
              reference,
              {
                documentPaths,
                status:
                  "submitted",
                applicantNote,
                reviewerId:
                  FieldValue.delete(),
                reviewerNote:
                  FieldValue.delete(),
                reviewedAt:
                  FieldValue.delete(),
                resubmittedAt: now,
                submittedAt: now,
                updatedAt: now,
              }
            );

            await createAuditLog(
              {
                actor,
                action:
                  "servicePartnerApplication.resubmitted",
                entityType:
                  "application",
                entityId:
                  reference.id,
                metadata: {
                  applicationNumber:
                    current.applicationNumber,
                  documentCount:
                    documentPaths.length,
                  applicantNote,
                },
              },
              transaction
            );

            await createNotification(
              {
                userId:
                  actor.uid,
                title:
                  "Application Resubmitted",
                body: `Application ${current.applicationNumber} has been resubmitted for verification.`,
                type:
                  "servicePartnerApplicationResubmitted",
                actionURL:
                  `/account/service-partner-applications/${reference.id}`,
                metadata: {
                  applicationId:
                    reference.id,
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
