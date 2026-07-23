import {
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";

import {
  applicationReference,
  createAuditLog,
  createNotification,
  formatSequence,
  firestore,
  nextSequenceNumber,
  requireAuthenticatedActor,
} from "./servicePartnerRepository";
import type {
  ServicePartnerApplicationDocument,
} from "./servicePartnerTypes";
import {
  validateCreateApplicationInput,
} from "./servicePartnerValidation";

export const createServicePartnerApplication =
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
        validateCreateApplicationInput(
          request.data
        );

      const duplicateQuery =
        await firestore
          .collection(
            "servicePartnerApplications"
          )
          .where(
            "applicantUserId",
            "==",
            actor.uid
          )
          .where(
            "status",
            "in",
            [
              "submitted",
              "underReview",
              "additionalInformationRequired",
              "approved",
            ]
          )
          .limit(1)
          .get();

      if (
        !duplicateQuery.empty
      ) {
        throw new HttpsError(
          "already-exists",
          "You already have an active service-partner application."
        );
      }

      const applicationReferenceValue =
        applicationReference(
          firestore
            .collection(
              "servicePartnerApplications"
            )
            .doc().id
        );

      const now =
        new Date();

      const result =
        await firestore.runTransaction(
          async (
            transaction
          ) => {
            const sequence =
              await nextSequenceNumber(
                transaction,
                "servicePartnerApplications"
              );

            const applicationNumber =
              formatSequence(
                "SPA",
                sequence
              );

            const application: ServicePartnerApplicationDocument =
              {
                applicationNumber,
                applicantUserId:
                  actor.uid,
                legalName:
                  input.legalName,
                displayName:
                  input.displayName,
                partnerType:
                  input.partnerType,
                description:
                  input.description,
                contact:
                  input.contact,
                registeredAddress:
                  input.registeredAddress,
                capabilities:
                  input.capabilities,
                coverageStates:
                  input.coverageStates,
                documentPaths:
                  input.documentPaths,
                status:
                  "submitted",
                submittedAt:
                  firestore
                    .Timestamp
                    ?.fromDate?.(
                      now
                    ) ??
                  undefined,
                createdAt:
                  firestore
                    .Timestamp
                    ?.fromDate?.(
                      now
                    ) ??
                  undefined,
                updatedAt:
                  firestore
                    .Timestamp
                    ?.fromDate?.(
                      now
                    ) ??
                  undefined,
              } as ServicePartnerApplicationDocument;

            transaction.create(
              applicationReferenceValue,
              application
            );

            await createAuditLog(
              {
                actor,
                action:
                  "servicePartnerApplication.created",
                entityType:
                  "application",
                entityId:
                  applicationReferenceValue.id,
                metadata: {
                  applicationNumber,
                  partnerType:
                    input.partnerType,
                  capabilityCount:
                    input.capabilities
                      .length,
                  documentCount:
                    input.documentPaths
                      .length,
                },
              },
              transaction
            );

            await createNotification(
              {
                userId:
                  actor.uid,
                title:
                  "Application Submitted",
                body: `Your service-partner application ${applicationNumber} has been submitted for verification.`,
                type:
                  "servicePartnerApplicationSubmitted",
                actionURL:
                  `/account/service-partner-applications/${applicationReferenceValue.id}`,
                metadata: {
                  applicationId:
                    applicationReferenceValue.id,
                  applicationNumber,
                },
              },
              transaction
            );

            return {
              application,
              applicationNumber,
            };
          }
        );

      return {
        application: {
          id:
            applicationReferenceValue.id,
          ...result.application,
          createdAt:
            now.toISOString(),
          updatedAt:
            now.toISOString(),
          submittedAt:
            now.toISOString(),
        },
      };
    }
  );
