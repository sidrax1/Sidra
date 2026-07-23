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
} from "./servicePartnerRepository";
import {
  requireAnyPermission,
} from "./servicePartnerAuthorization";
import {
  enforceServicePartnerRateLimit,
} from "./servicePartnerRateLimit";
import {
  serializeServicePartner,
} from "./servicePartnerSerializers";
import type {
  ServicePartnerDocument,
} from "./servicePartnerTypes";

interface RenewVerificationInput {
  readonly partnerId: string;
  readonly documentPaths: readonly string[];
  readonly declaration: string;
}

export const renewServicePartnerVerification =
  onCall(
    {
      region:
        "asia-south1",
      enforceAppCheck: true,
      cors: true,
      timeoutSeconds: 90,
      memory: "512MiB",
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
            "renew-service-partner-verification",
          maximumAttempts: 5,
          windowSeconds: 86400,
        }
      );

      const input =
        request.data as Partial<RenewVerificationInput>;

      const partnerId =
        typeof input.partnerId ===
          "string"
          ? input.partnerId.trim()
          : "";

      const declaration =
        typeof input.declaration ===
          "string"
          ? input.declaration.trim()
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

      if (!partnerId) {
        throw new HttpsError(
          "invalid-argument",
          "Partner ID is required."
        );
      }

      if (
        declaration.length < 30 ||
        declaration.length >
          2000
      ) {
        throw new HttpsError(
          "invalid-argument",
          "Verification declaration must contain between 30 and 2000 characters."
        );
      }

      if (
        documentPaths.length < 1 ||
        documentPaths.length > 30
      ) {
        throw new HttpsError(
          "invalid-argument",
          "Between 1 and 30 renewal documents are required."
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

            const owner =
              current.applicantUserId ===
              actor.uid;

            if (!owner) {
              requireAnyPermission(
                actor,
                [
                  "servicePartners.renewVerification",
                  "servicePartners.review",
                ]
              );
            }

            if (
              current.status ===
                "archived" ||
              current.status ===
                "rejected"
            ) {
              throw new HttpsError(
                "failed-precondition",
                "Verification cannot be renewed for this partner status."
              );
            }

            const now =
              Timestamp.now();

            const updated: ServicePartnerDocument =
              {
                ...current,
                acceptingAssignments:
                  false,
                verification: {
                  ...current.verification,
                  status:
                    "underReview",
                  submittedAt: now,
                  reviewedAt:
                    undefined,
                  reviewedBy:
                    undefined,
                  failureReason:
                    undefined,
                },
                updatedAt: now,
              };

            transaction.update(
              partnerRef,
              {
                acceptingAssignments:
                  false,
                "verification.status":
                  "underReview",
                "verification.submittedAt":
                  now,
                "verification.reviewedAt":
                  FieldValue.delete(),
                "verification.reviewedBy":
                  FieldValue.delete(),
                "verification.failureReason":
                  FieldValue.delete(),
                renewalDocumentPaths:
                  documentPaths,
                renewalDeclaration:
                  declaration,
                renewalSubmittedBy:
                  actor.uid,
                renewalSubmittedAt:
                  now,
                updatedAt: now,
              }
            );

            transaction.create(
              firestore
                .collection(
                  "servicePartnerVerificationRenewals"
                )
                .doc(),
              {
                partnerId,
                partnerNumber:
                  current.partnerNumber,
                applicantUserId:
                  current.applicantUserId,
                documentPaths,
                declaration,
                status:
                  "underReview",
                submittedBy:
                  actor.uid,
                submittedAt: now,
                createdAt: now,
                updatedAt: now,
              }
            );

            await createAuditLog(
              {
                actor,
                action:
                  "servicePartner.verificationRenewalSubmitted",
                entityType:
                  "partner",
                entityId:
                  partnerId,
                metadata: {
                  documentCount:
                    documentPaths.length,
                  ownerSubmitted:
                    owner,
                },
              },
              transaction
            );

            await createNotification(
              {
                userId:
                  current.applicantUserId,
                title:
                  "Verification Renewal Submitted",
                body: "Your service-partner verification renewal is under review. New assignments are temporarily paused.",
                type:
                  "servicePartnerVerificationRenewalSubmitted",
                actionURL:
                  "/partner/verification",
                metadata: {
                  partnerId,
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
