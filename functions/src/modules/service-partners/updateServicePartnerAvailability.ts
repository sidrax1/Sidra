import {
  Timestamp,
} from "firebase-admin/firestore";
import {
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";

import {
  createAuditLog,
  createNotification,
  firestore,
  partnerReference,
  requireAuthenticatedActor,
  requirePermission,
} from "./servicePartnerRepository";
import type {
  ServicePartnerDocument,
} from "./servicePartnerTypes";
import {
  validateAvailabilityInput,
} from "./servicePartnerValidation";

export const updateServicePartnerAvailability =
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

      const input =
        validateAvailabilityInput(
          request.data
        );

      const partnerRef =
        partnerReference(
          input.partnerId
        );

      const result =
        await firestore.runTransaction(
          async (
            transaction
          ) => {
            const snapshot =
              await transaction.get(
                partnerRef
              );

            if (
              !snapshot.exists
            ) {
              throw new HttpsError(
                "not-found",
                "Service partner was not found."
              );
            }

            const partner =
              snapshot.data() as ServicePartnerDocument;

            const selfManaged =
              partner.applicantUserId ===
              actor.uid;

            if (!selfManaged) {
              requirePermission(
                actor,
                "servicePartners.manageAvailability"
              );
            }

            if (
              input.maximumConcurrentAssignments <
              partner.currentAssignmentCount
            ) {
              throw new HttpsError(
                "failed-precondition",
                "Maximum concurrent assignments cannot be lower than the current active assignment count."
              );
            }

            if (
              input.acceptingAssignments &&
              partner.status !==
                "active"
            ) {
              throw new HttpsError(
                "failed-precondition",
                "Only active service partners can accept new assignments."
              );
            }

            if (
              input.acceptingAssignments &&
              partner.verification
                .status !== "verified"
            ) {
              throw new HttpsError(
                "failed-precondition",
                "Only verified service partners can accept new assignments."
              );
            }

            const verificationExpiry =
              partner.verification
                .expiresAt;

            if (
              input.acceptingAssignments &&
              verificationExpiry &&
              verificationExpiry.toMillis() <
                Date.now()
            ) {
              throw new HttpsError(
                "failed-precondition",
                "Partner verification has expired."
              );
            }

            const now =
              Timestamp.now();

            transaction.update(
              partnerRef,
              {
                acceptingAssignments:
                  input.acceptingAssignments,
                maximumConcurrentAssignments:
                  input.maximumConcurrentAssignments,
                lastAvailabilityReason:
                  input.reason ?? null,
                lastAvailabilityChangedBy:
                  actor.uid,
                lastAvailabilityChangedAt:
                  now,
                updatedAt:
                  now,
              }
            );

            await createAuditLog(
              {
                actor,
                action:
                  "servicePartner.availabilityUpdated",
                entityType:
                  "partner",
                entityId:
                  partnerRef.id,
                metadata: {
                  previousAcceptingAssignments:
                    partner.acceptingAssignments,
                  acceptingAssignments:
                    input.acceptingAssignments,
                  previousCapacity:
                    partner.maximumConcurrentAssignments,
                  maximumConcurrentAssignments:
                    input.maximumConcurrentAssignments,
                  reason:
                    input.reason,
                },
              },
              transaction
            );

            if (!selfManaged) {
              await createNotification(
                {
                  userId:
                    partner.applicantUserId,
                  title:
                    "Partner Availability Updated",
                  body: input.acceptingAssignments
                    ? "Your service-partner account is now accepting new assignments."
                    : "New service assignments have been paused for your partner account.",
                  type:
                    "servicePartnerAvailabilityUpdated",
                  actionURL:
                    "/partner",
                  metadata: {
                    partnerId:
                      partnerRef.id,
                    acceptingAssignments:
                      input.acceptingAssignments,
                  },
                },
                transaction
              );
            }

            return {
              ...partner,
              acceptingAssignments:
                input.acceptingAssignments,
              maximumConcurrentAssignments:
                input.maximumConcurrentAssignments,
              updatedAt: now,
            };
          }
        );

      return {
        partner: {
          id:
            partnerRef.id,
          ...result,
          createdAt:
            result.createdAt
              .toDate()
              .toISOString(),
          updatedAt:
            result.updatedAt
              .toDate()
              .toISOString(),
          activatedAt:
            result.activatedAt
              ?.toDate()
              .toISOString(),
          suspendedAt:
            result.suspendedAt
              ?.toDate()
              .toISOString(),
          archivedAt:
            result.archivedAt
              ?.toDate()
              .toISOString(),
        },
      };
    }
  );
