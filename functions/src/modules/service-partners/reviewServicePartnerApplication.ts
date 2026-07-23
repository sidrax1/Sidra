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
  createSlug,
  formatSequence,
  firestore,
  nextSequenceNumber,
  normalizeLookupKey,
  partnerReference,
  requireAuthenticatedActor,
  requirePermission,
} from "./servicePartnerRepository";
import type {
  ServicePartnerApplicationDocument,
  ServicePartnerDocument,
} from "./servicePartnerTypes";
import {
  validateReviewApplicationInput,
} from "./servicePartnerValidation";

const reviewableStatuses =
  new Set([
    "submitted",
    "underReview",
    "additionalInformationRequired",
  ]);

function serializeTimestamp(
  value: Timestamp | undefined
): string | undefined {
  return value
    ? value
        .toDate()
        .toISOString()
    : undefined;
}

export const reviewServicePartnerApplication =
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
        "servicePartners.review"
      );

      const input =
        validateReviewApplicationInput(
          request.data
        );

      const applicationRef =
        applicationReference(
          input.applicationId
        );

      const result =
        await firestore.runTransaction(
          async (
            transaction
          ) => {
            const applicationSnapshot =
              await transaction.get(
                applicationRef
              );

            if (
              !applicationSnapshot.exists
            ) {
              throw new HttpsError(
                "not-found",
                "Service-partner application was not found."
              );
            }

            const application =
              applicationSnapshot.data() as ServicePartnerApplicationDocument;

            if (
              !reviewableStatuses.has(
                application.status
              )
            ) {
              throw new HttpsError(
                "failed-precondition",
                `Applications with status ${application.status} cannot be reviewed.`
              );
            }

            const reviewedAt =
              Timestamp.now();

            if (
              input.decision ===
              "requestInformation"
            ) {
              const updatedApplication: ServicePartnerApplicationDocument =
                {
                  ...application,
                  status:
                    "additionalInformationRequired",
                  reviewerId:
                    actor.uid,
                  reviewerNote:
                    input.reviewerNote,
                  reviewedAt,
                  updatedAt:
                    reviewedAt,
                };

              transaction.update(
                applicationRef,
                {
                  status:
                    updatedApplication.status,
                  reviewerId:
                    actor.uid,
                  reviewerNote:
                    input.reviewerNote,
                  reviewedAt,
                  updatedAt:
                    reviewedAt,
                }
              );

              await createAuditLog(
                {
                  actor,
                  action:
                    "servicePartnerApplication.informationRequested",
                  entityType:
                    "application",
                  entityId:
                    applicationRef.id,
                  metadata: {
                    riskScore:
                      input.riskScore,
                    reviewerNote:
                      input.reviewerNote,
                  },
                },
                transaction
              );

              await createNotification(
                {
                  userId:
                    application.applicantUserId,
                  title:
                    "Additional Information Required",
                  body: `More information is required for application ${application.applicationNumber}.`,
                  type:
                    "servicePartnerApplicationInformationRequired",
                  actionURL:
                    `/account/service-partner-applications/${applicationRef.id}`,
                  metadata: {
                    applicationId:
                      applicationRef.id,
                  },
                },
                transaction
              );

              return {
                application:
                  updatedApplication,
                partner:
                  undefined,
              };
            }

            if (
              input.decision ===
              "reject"
            ) {
              const updatedApplication: ServicePartnerApplicationDocument =
                {
                  ...application,
                  status:
                    "rejected",
                  reviewerId:
                    actor.uid,
                  reviewerNote:
                    input.reviewerNote,
                  reviewedAt,
                  updatedAt:
                    reviewedAt,
                };

              transaction.update(
                applicationRef,
                {
                  status:
                    "rejected",
                  reviewerId:
                    actor.uid,
                  reviewerNote:
                    input.reviewerNote,
                  reviewedAt,
                  updatedAt:
                    reviewedAt,
                }
              );

              await createAuditLog(
                {
                  actor,
                  action:
                    "servicePartnerApplication.rejected",
                  entityType:
                    "application",
                  entityId:
                    applicationRef.id,
                  metadata: {
                    riskScore:
                      input.riskScore,
                    reviewerNote:
                      input.reviewerNote,
                  },
                },
                transaction
              );

              await createNotification(
                {
                  userId:
                    application.applicantUserId,
                  title:
                    "Service Partner Application Update",
                  body: `Application ${application.applicationNumber} was not approved.`,
                  type:
                    "servicePartnerApplicationRejected",
                  actionURL:
                    `/account/service-partner-applications/${applicationRef.id}`,
                  metadata: {
                    applicationId:
                      applicationRef.id,
                  },
                },
                transaction
              );

              return {
                application:
                  updatedApplication,
                partner:
                  undefined,
              };
            }

            const existingPartnerQuery =
              firestore
                .collection(
                  "servicePartners"
                )
                .where(
                  "applicationId",
                  "==",
                  applicationRef.id
                )
                .limit(1);

            const existingPartnerSnapshot =
              await transaction.get(
                existingPartnerQuery
              );

            if (
              !existingPartnerSnapshot.empty
            ) {
              throw new HttpsError(
                "already-exists",
                "A service partner has already been created for this application."
              );
            }

            const partnerSequence =
              await nextSequenceNumber(
                transaction,
                "servicePartners"
              );

            const partnerNumber =
              formatSequence(
                "SP",
                partnerSequence
              );

            const partnerRef =
              partnerReference(
                firestore
                  .collection(
                    "servicePartners"
                  )
                  .doc().id
              );

            const baseSlug =
              createSlug(
                application.displayName,
                partnerNumber.toLowerCase()
              );

            const slug = `${baseSlug}-${partnerNumber
              .toLowerCase()
              .replace(
                /[^a-z0-9]/g,
                ""
              )}`;

            const partner: ServicePartnerDocument =
              {
                partnerNumber,
                legalName:
                  application.legalName,
                displayName:
                  application.displayName,
                slug,
                description:
                  application.description,
                partnerType:
                  application.partnerType,
                status:
                  "active",
                contact:
                  application.contact,
                registeredAddress:
                  application.registeredAddress,
                capabilityKeys:
                  application.capabilities,
                coverageStateKeys:
                  application.coverageStates.map(
                    normalizeLookupKey
                  ),
                coverageCityKeys: [
                  normalizeLookupKey(
                    application
                      .registeredAddress
                      .city
                  ),
                ],
                acceptingAssignments:
                  true,
                maximumConcurrentAssignments:
                  10,
                currentAssignmentCount:
                  0,
                performance: {
                  totalAssignments:
                    0,
                  completedAssignments:
                    0,
                  cancelledAssignments:
                    0,
                  activeAssignments:
                    0,
                  averageCompletionHours:
                    0,
                  firstResponseMinutes:
                    0,
                  customerRating:
                    0,
                  customerReviewCount:
                    0,
                  qualityScore:
                    100,
                  resolutionSuccessRate:
                    100,
                  repeatServiceRate:
                    0,
                  disputeCount:
                    0,
                },
                verification: {
                  status:
                    "verified",
                  submittedAt:
                    application.submittedAt,
                  reviewedAt,
                  reviewedBy:
                    actor.uid,
                  riskScore:
                    input.riskScore,
                  expiresAt:
                    Timestamp.fromMillis(
                      reviewedAt.toMillis() +
                        365 *
                          24 *
                          60 *
                          60 *
                          1000
                    ),
                },
                applicationId:
                  applicationRef.id,
                applicantUserId:
                  application.applicantUserId,
                activatedAt:
                  reviewedAt,
                createdAt:
                  reviewedAt,
                updatedAt:
                  reviewedAt,
              };

            const updatedApplication: ServicePartnerApplicationDocument =
              {
                ...application,
                status:
                  "approved",
                reviewerId:
                  actor.uid,
                reviewerNote:
                  input.reviewerNote,
                reviewedAt,
                updatedAt:
                  reviewedAt,
              };

            transaction.create(
              partnerRef,
              partner
            );

            transaction.update(
              applicationRef,
              {
                status:
                  "approved",
                reviewerId:
                  actor.uid,
                reviewerNote:
                  input.reviewerNote,
                reviewedAt,
                updatedAt:
                  reviewedAt,
                approvedPartnerId:
                  partnerRef.id,
              }
            );

            transaction.set(
              firestore
                .collection(
                  "users"
                )
                .doc(
                  application.applicantUserId
                ),
              {
                servicePartnerId:
                  partnerRef.id,
                servicePartnerStatus:
                  "active",
                roles:
                  FieldValue.arrayUnion(
                    "servicePartner"
                  ),
                updatedAt:
                  reviewedAt,
              },
              {
                merge: true,
              }
            );

            await createAuditLog(
              {
                actor,
                action:
                  "servicePartnerApplication.approved",
                entityType:
                  "application",
                entityId:
                  applicationRef.id,
                metadata: {
                  partnerId:
                    partnerRef.id,
                  partnerNumber,
                  riskScore:
                    input.riskScore,
                },
              },
              transaction
            );

            await createAuditLog(
              {
                actor,
                action:
                  "servicePartner.created",
                entityType:
                  "partner",
                entityId:
                  partnerRef.id,
                metadata: {
                  applicationId:
                    applicationRef.id,
                  partnerNumber,
                },
              },
              transaction
            );

            await createNotification(
              {
                userId:
                  application.applicantUserId,
                title:
                  "Service Partner Approved",
                body: `Your service-partner application has been approved. Partner number: ${partnerNumber}.`,
                type:
                  "servicePartnerApplicationApproved",
                actionURL:
                  `/partner`,
                metadata: {
                  applicationId:
                    applicationRef.id,
                  partnerId:
                    partnerRef.id,
                  partnerNumber,
                },
              },
              transaction
            );

            return {
              application:
                updatedApplication,
              partner: {
                id:
                  partnerRef.id,
                ...partner,
              },
            };
          }
        );

      return {
        application: {
          id:
            applicationRef.id,
          ...result.application,
          createdAt:
            serializeTimestamp(
              result.application
                .createdAt
            ),
          updatedAt:
            serializeTimestamp(
              result.application
                .updatedAt
            ),
          submittedAt:
            serializeTimestamp(
              result.application
                .submittedAt
            ),
          reviewedAt:
            serializeTimestamp(
              result.application
                .reviewedAt
            ),
        },
        partner: result.partner
          ? {
              ...result.partner,
              createdAt:
                serializeTimestamp(
                  result.partner
                    .createdAt
                ),
              updatedAt:
                serializeTimestamp(
                  result.partner
                    .updatedAt
                ),
              activatedAt:
                serializeTimestamp(
                  result.partner
                    .activatedAt
                ),
            }
          : undefined,
      };
    }
  );
