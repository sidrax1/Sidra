import {
  FieldValue,
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
  ServicePartnerStatus,
} from "./servicePartnerTypes";
import {
  validateUpdateStatusInput,
} from "./servicePartnerValidation";

const allowedTransitions: Readonly<
  Record<
    ServicePartnerStatus,
    readonly ServicePartnerStatus[]
  >
> = {
  pendingVerification: [
    "active",
    "rejected",
    "archived",
  ],
  active: [
    "temporarilyUnavailable",
    "suspended",
    "archived",
  ],
  temporarilyUnavailable: [
    "active",
    "suspended",
    "archived",
  ],
  suspended: [
    "active",
    "rejected",
    "archived",
  ],
  rejected: [
    "pendingVerification",
    "archived",
  ],
  archived: [
    "pendingVerification",
  ],
};

export const updateServicePartnerStatus =
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
        "servicePartners.manageStatus"
      );

      const input =
        validateUpdateStatusInput(
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

            if (
              partner.status ===
              input.status
            ) {
              throw new HttpsError(
                "failed-precondition",
                "Service partner already has the requested status."
              );
            }

            if (
              !allowedTransitions[
                partner.status
              ].includes(
                input.status
              )
            ) {
              throw new HttpsError(
                "failed-precondition",
                `Status transition from ${partner.status} to ${input.status} is not allowed.`
              );
            }

            if (
              input.status ===
                "active" &&
              partner.verification
                .status !== "verified"
            ) {
              throw new HttpsError(
                "failed-precondition",
                "Only verified partners can be activated."
              );
            }

            const now =
              Timestamp.now();

            const acceptingAssignments =
              input.status ===
                "active"
                ? partner.acceptingAssignments
                : false;

            const updateData: Record<
              string,
              unknown
            > = {
              status:
                input.status,
              acceptingAssignments,
              updatedAt: now,
              lastStatusReason:
                input.reason,
              lastStatusChangedBy:
                actor.uid,
              lastStatusChangedAt:
                now,
            };

            if (
              input.status ===
              "suspended"
            ) {
              updateData.suspendedAt =
                now;
              updateData.suspensionReason =
                input.reason;
            }

            if (
              input.status ===
              "archived"
            ) {
              updateData.archivedAt =
                now;
            }

            if (
              input.status ===
              "active"
            ) {
              updateData.activatedAt =
                partner.activatedAt ??
                now;
              updateData.suspendedAt =
                FieldValue.delete();
              updateData.suspensionReason =
                FieldValue.delete();
              updateData.archivedAt =
                FieldValue.delete();
            }

            transaction.update(
              partnerRef,
              updateData
            );

            transaction.set(
              firestore
                .collection(
                  "users"
                )
                .doc(
                  partner.applicantUserId
                ),
              {
                servicePartnerStatus:
                  input.status,
                updatedAt: now,
              },
              {
                merge: true,
              }
            );

            await createAuditLog(
              {
                actor,
                action:
                  "servicePartner.statusUpdated",
                entityType:
                  "partner",
                entityId:
                  partnerRef.id,
                metadata: {
                  previousStatus:
                    partner.status,
                  status:
                    input.status,
                  reason:
                    input.reason,
                },
              },
              transaction
            );

            await createNotification(
              {
                userId:
                  partner.applicantUserId,
                title:
                  "Service Partner Status Updated",
                body: `Your Sidra service-partner status changed from ${partner.status} to ${input.status}.`,
                type:
                  "servicePartnerStatusUpdated",
                actionURL:
                  `/partner`,
                metadata: {
                  partnerId:
                    partnerRef.id,
                  previousStatus:
                    partner.status,
                  status:
                    input.status,
                },
              },
              transaction
            );

            return {
              ...partner,
              status:
                input.status,
              acceptingAssignments,
              suspendedAt:
                input.status ===
                "suspended"
                  ? now
                  : partner.suspendedAt,
              suspensionReason:
                input.status ===
                "suspended"
                  ? input.reason
                  : partner.suspensionReason,
              archivedAt:
                input.status ===
                "archived"
                  ? now
                  : partner.archivedAt,
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
