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
import {
  serializeServicePartner,
} from "./servicePartnerSerializers";
import type {
  ServicePartnerDocument,
} from "./servicePartnerTypes";

interface CompleteInspectionInput {
  readonly partnerId: string;
  readonly inspectionId: string;
  readonly result:
    | "passed"
    | "failed"
    | "conditional";
  readonly qualityScore: number;
  readonly riskScore: number;
  readonly reportNote: string;
  readonly evidencePaths: readonly string[];
}

export const completeServicePartnerInspection =
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

      requirePermission(
        actor,
        "servicePartners.completeInspection"
      );

      const input =
        request.data as Partial<CompleteInspectionInput>;

      const partnerId =
        typeof input.partnerId ===
          "string"
          ? input.partnerId.trim()
          : "";

      const inspectionId =
        typeof input.inspectionId ===
          "string"
          ? input.inspectionId.trim()
          : "";

      const reportNote =
        typeof input.reportNote ===
          "string"
          ? input.reportNote.trim()
          : "";

      const result =
        input.result;

      const qualityScore =
        Number(
          input.qualityScore
        );

      const riskScore =
        Number(input.riskScore);

      const evidencePaths =
        Array.isArray(
          input.evidencePaths
        )
          ? [
              ...new Set(
                input.evidencePaths
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

      if (
        !partnerId ||
        !inspectionId
      ) {
        throw new HttpsError(
          "invalid-argument",
          "Partner ID and inspection ID are required."
        );
      }

      if (
        ![
          "passed",
          "failed",
          "conditional",
        ].includes(
          result ?? ""
        )
      ) {
        throw new HttpsError(
          "invalid-argument",
          "Inspection result is invalid."
        );
      }

      if (
        !Number.isInteger(
          qualityScore
        ) ||
        qualityScore < 0 ||
        qualityScore > 100
      ) {
        throw new HttpsError(
          "invalid-argument",
          "Quality score must be an integer between 0 and 100."
        );
      }

      if (
        !Number.isInteger(
          riskScore
        ) ||
        riskScore < 0 ||
        riskScore > 100
      ) {
        throw new HttpsError(
          "invalid-argument",
          "Risk score must be an integer between 0 and 100."
        );
      }

      if (
        reportNote.length < 30 ||
        reportNote.length >
          5000
      ) {
        throw new HttpsError(
          "invalid-argument",
          "Inspection report must contain between 30 and 5000 characters."
        );
      }

      if (
        evidencePaths.length < 1 ||
        evidencePaths.length > 30
      ) {
        throw new HttpsError(
          "invalid-argument",
          "At least one inspection evidence file is required."
        );
      }

      const partnerRef =
        partnerReference(
          partnerId
        );

      const inspectionRef =
        firestore
          .collection(
            "servicePartnerInspections"
          )
          .doc(
            inspectionId
          );

      const partner =
        await firestore.runTransaction(
          async (
            transaction
          ) => {
            const [
              partnerSnapshot,
              inspectionSnapshot,
            ] = await Promise.all([
              transaction.get(
                partnerRef
              ),
              transaction.get(
                inspectionRef
              ),
            ]);

            if (
              !partnerSnapshot.exists
            ) {
              throw new HttpsError(
                "not-found",
                "Service partner was not found."
              );
            }

            if (
              !inspectionSnapshot.exists
            ) {
              throw new HttpsError(
                "not-found",
                "Service-partner inspection was not found."
              );
            }

            const current =
              partnerSnapshot.data() as ServicePartnerDocument;

            const inspection =
              inspectionSnapshot.data();

            if (
              inspection.partnerId !==
              partnerId
            ) {
              throw new HttpsError(
                "failed-precondition",
                "Inspection does not belong to the selected partner."
              );
            }

            if (
              inspection.status ===
              "completed"
            ) {
              throw new HttpsError(
                "already-exists",
                "Inspection has already been completed."
              );
            }

            const now =
              Timestamp.now();

            const verificationStatus =
              result === "passed"
                ? "verified"
                : result ===
                    "failed"
                  ? "failed"
                  : "documentsPending";

            const expiresAt =
              result === "passed"
                ? Timestamp.fromMillis(
                    now.toMillis() +
                      365 *
                        24 *
                        60 *
                        60 *
                        1000
                  )
                : current.verification
                    .expiresAt;

            const nextStatus =
              result === "passed"
                ? current.status ===
                  "pendingVerification"
                  ? "active"
                  : current.status
                : result ===
                    "failed"
                  ? "suspended"
                  : current.status;

            const updated: ServicePartnerDocument =
              {
                ...current,
                status: nextStatus,
                acceptingAssignments:
                  result === "failed"
                    ? false
                    : current.acceptingAssignments,
                performance: {
                  ...current.performance,
                  qualityScore,
                },
                verification: {
                  ...current.verification,
                  status:
                    verificationStatus,
                  reviewedAt: now,
                  reviewedBy:
                    actor.uid,
                  siteInspectionAt:
                    inspection.inspectionAt ??
                    now,
                  siteInspectionBy:
                    actor.uid,
                  riskScore,
                  failureReason:
                    result === "failed"
                      ? reportNote
                      : undefined,
                  expiresAt,
                },
                updatedAt: now,
              };

            transaction.update(
              inspectionRef,
              {
                status:
                  "completed",
                result,
                qualityScore,
                riskScore,
                reportNote,
                evidencePaths,
                completedBy:
                  actor.uid,
                completedAt: now,
                updatedAt: now,
              }
            );

            transaction.update(
              partnerRef,
              {
                status: nextStatus,
                acceptingAssignments:
                  updated.acceptingAssignments,
                "performance.qualityScore":
                  qualityScore,
                "verification.status":
                  verificationStatus,
                "verification.reviewedAt":
                  now,
                "verification.reviewedBy":
                  actor.uid,
                "verification.riskScore":
                  riskScore,
                "verification.failureReason":
                  result === "failed"
                    ? reportNote
                    : null,
                "verification.expiresAt":
                  expiresAt ?? null,
                lastInspectionResult:
                  result,
                lastInspectionReport:
                  reportNote,
                updatedAt: now,
              }
            );

            await createAuditLog(
              {
                actor,
                action:
                  "servicePartner.inspectionCompleted",
                entityType:
                  "partner",
                entityId:
                  partnerId,
                metadata: {
                  inspectionId,
                  result,
                  qualityScore,
                  riskScore,
                  evidenceCount:
                    evidencePaths.length,
                },
              },
              transaction
            );

            await createNotification(
              {
                userId:
                  current.applicantUserId,
                title:
                  "Inspection Completed",
                body:
                  result === "passed"
                    ? "Your service-partner site inspection was approved."
                    : result ===
                        "failed"
                      ? "Your service-partner inspection requires immediate attention."
                      : "Additional information is required after your site inspection.",
                type:
                  "servicePartnerInspectionCompleted",
                actionURL:
                  "/partner/verification",
                metadata: {
                  partnerId,
                  inspectionId,
                  result,
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
