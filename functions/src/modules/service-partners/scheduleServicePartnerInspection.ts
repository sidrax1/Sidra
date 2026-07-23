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
  timestampFromISO,
} from "./servicePartnerRepository";
import {
  enforceServicePartnerRateLimit,
} from "./servicePartnerRateLimit";
import {
  serializeServicePartner,
} from "./servicePartnerSerializers";
import type {
  ServicePartnerDocument,
} from "./servicePartnerTypes";

interface ScheduleInspectionInput {
  readonly partnerId: string;
  readonly inspectionAt: string;
  readonly inspectorId: string;
  readonly inspectionAddress: string;
  readonly instructions?: string;
}

export const scheduleServicePartnerInspection =
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

      requirePermission(
        actor,
        "servicePartners.scheduleInspection"
      );

      await enforceServicePartnerRateLimit(
        {
          actorId: actor.uid,
          action:
            "schedule-service-partner-inspection",
          maximumAttempts: 30,
          windowSeconds: 3600,
        }
      );

      const input =
        request.data as Partial<ScheduleInspectionInput>;

      const partnerId =
        typeof input.partnerId ===
          "string"
          ? input.partnerId.trim()
          : "";

      const inspectorId =
        typeof input.inspectorId ===
          "string"
          ? input.inspectorId.trim()
          : "";

      const inspectionAddress =
        typeof input.inspectionAddress ===
          "string"
          ? input.inspectionAddress.trim()
          : "";

      const instructions =
        typeof input.instructions ===
          "string"
          ? input.instructions.trim()
          : "";

      if (!partnerId) {
        throw new HttpsError(
          "invalid-argument",
          "Partner ID is required."
        );
      }

      if (!inspectorId) {
        throw new HttpsError(
          "invalid-argument",
          "Inspector ID is required."
        );
      }

      if (
        inspectionAddress.length <
          10 ||
        inspectionAddress.length >
          500
      ) {
        throw new HttpsError(
          "invalid-argument",
          "Inspection address must contain between 10 and 500 characters."
        );
      }

      const inspectionAt =
        timestampFromISO(
          typeof input.inspectionAt ===
            "string"
            ? input.inspectionAt
            : ""
        );

      if (
        inspectionAt.toMillis() <=
        Date.now()
      ) {
        throw new HttpsError(
          "invalid-argument",
          "Inspection date must be in the future."
        );
      }

      const partnerRef =
        partnerReference(
          partnerId
        );

      const partner =
        await firestore.runTransaction(
          async (
            transaction
          ) => {
            const snapshot =
              await transaction.get(
                partnerRef
              );

            if (!snapshot.exists) {
              throw new HttpsError(
                "not-found",
                "Service partner was not found."
              );
            }

            const current =
              snapshot.data() as ServicePartnerDocument;

            if (
              [
                "rejected",
                "archived",
              ].includes(
                current.status
              )
            ) {
              throw new HttpsError(
                "failed-precondition",
                "Inspection cannot be scheduled for this partner status."
              );
            }

            const now =
              Timestamp.now();

            const updated: ServicePartnerDocument =
              {
                ...current,
                verification: {
                  ...current.verification,
                  status:
                    "siteInspectionPending",
                  siteInspectionAt:
                    inspectionAt,
                  siteInspectionBy:
                    inspectorId,
                },
                updatedAt: now,
              };

            transaction.update(
              partnerRef,
              {
                "verification.status":
                  "siteInspectionPending",
                "verification.siteInspectionAt":
                  inspectionAt,
                "verification.siteInspectionBy":
                  inspectorId,
                inspectionAddress,
                inspectionInstructions:
                  instructions || null,
                inspectionScheduledBy:
                  actor.uid,
                updatedAt: now,
              }
            );

            transaction.create(
              firestore
                .collection(
                  "servicePartnerInspections"
                )
                .doc(),
              {
                partnerId,
                partnerNumber:
                  current.partnerNumber,
                inspectorId,
                inspectionAt,
                inspectionAddress,
                instructions:
                  instructions || null,
                status:
                  "scheduled",
                scheduledBy:
                  actor.uid,
                createdAt: now,
                updatedAt: now,
              }
            );

            await createAuditLog(
              {
                actor,
                action:
                  "servicePartner.inspectionScheduled",
                entityType:
                  "partner",
                entityId:
                  partnerId,
                metadata: {
                  inspectorId,
                  inspectionAt:
                    inspectionAt
                      .toDate()
                      .toISOString(),
                  inspectionAddress,
                },
              },
              transaction
            );

            await createNotification(
              {
                userId:
                  current.applicantUserId,
                title:
                  "Site Inspection Scheduled",
                body: `A verification inspection has been scheduled for ${inspectionAt
                  .toDate()
                  .toLocaleString(
                    "en-IN"
                  )}.`,
                type:
                  "servicePartnerInspectionScheduled",
                actionURL:
                  "/partner/verification",
                metadata: {
                  partnerId,
                  inspectionAt:
                    inspectionAt
                      .toDate()
                      .toISOString(),
                },
              },
              transaction
            );

            await createNotification(
              {
                userId:
                  inspectorId,
                title:
                  "New Partner Inspection",
                body: `You have been assigned to inspect ${current.displayName}.`,
                type:
                  "servicePartnerInspectionAssigned",
                actionURL:
                  `/admin/service-partners/${partnerId}/inspection`,
                metadata: {
                  partnerId,
                  inspectionAt:
                    inspectionAt
                      .toDate()
                      .toISOString(),
                },
              },
              transaction
            );

            return updated;
          }
        );

      return {
        partner:
          serializeServicePartner(
            partnerRef.id,
            partner
          ),
      };
    }
  );
