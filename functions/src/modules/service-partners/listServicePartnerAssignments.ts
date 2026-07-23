import {
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";

import {
  firestore,
  requireAuthenticatedActor,
} from "./servicePartnerRepository";
import {
  hasPermission,
} from "./servicePartnerAuthorization";
import {
  serializeServicePartnerAssignment,
} from "./servicePartnerSerializers";
import type {
  ServicePartnerAssignmentDocument,
  ServicePartnerAssignmentPriority,
  ServicePartnerAssignmentSourceType,
  ServicePartnerAssignmentStatus,
} from "./servicePartnerTypes";

interface ListServicePartnerAssignmentsInput {
  readonly partnerId?: string;
  readonly customerId?: string;
  readonly studioId?: string;
  readonly sourceType?: ServicePartnerAssignmentSourceType;
  readonly sourceId?: string;
  readonly statuses?: readonly ServicePartnerAssignmentStatus[];
  readonly priorities?: readonly ServicePartnerAssignmentPriority[];
  readonly pageSize?: number;
  readonly cursorId?: string;
}

const activeStatuses =
  new Set<ServicePartnerAssignmentStatus>(
    [
      "assigned",
      "accepted",
      "declined",
      "scheduled",
      "inProgress",
      "completed",
      "cancelled",
    ]
  );

const validPriorities =
  new Set<ServicePartnerAssignmentPriority>(
    [
      "low",
      "normal",
      "high",
      "urgent",
    ]
  );

export const listServicePartnerAssignments =
  onCall(
    {
      region:
        "asia-south1",
      enforceAppCheck: true,
      cors: true,
      timeoutSeconds: 60,
      memory: "512MiB",
    },
    async (request) => {
      const actor =
        requireAuthenticatedActor(
          request
        );

      const input =
        (request.data ??
          {}) as ListServicePartnerAssignmentsInput;

      const privileged =
        hasPermission(
          actor,
          "servicePartners.readAssignments"
        ) ||
        hasPermission(
          actor,
          "servicePartners.manageAssignments"
        );

      const pageSize =
        Math.min(
          Math.max(
            Number.isInteger(
              input.pageSize
            )
              ? input.pageSize!
              : 20,
            1
          ),
          50
        );

      let query:
        FirebaseFirestore.Query =
        firestore
          .collection(
            "servicePartnerAssignments"
          )
          .orderBy(
            "responseDueAt",
            "asc"
          );

      if (
        input.partnerId?.trim()
      ) {
        if (!privileged) {
          const partnerSnapshot =
            await firestore
              .collection(
                "servicePartners"
              )
              .doc(
                input.partnerId.trim()
              )
              .get();

          const partnerOwner =
            partnerSnapshot.data()
              ?.applicantUserId;

          if (
            partnerOwner !==
            actor.uid
          ) {
            throw new HttpsError(
              "permission-denied",
              "You cannot access assignments for this partner."
            );
          }
        }

        query = query.where(
          "partnerId",
          "==",
          input.partnerId.trim()
        );
      } else if (
        input.customerId?.trim()
      ) {
        if (
          !privileged &&
          input.customerId.trim() !==
            actor.uid
        ) {
          throw new HttpsError(
            "permission-denied",
            "You cannot access assignments for another customer."
          );
        }

        query = query.where(
          "customerId",
          "==",
          input.customerId.trim()
        );
      } else if (
        input.studioId?.trim()
      ) {
        if (
          !privileged &&
          input.studioId.trim() !==
            actor.uid
        ) {
          throw new HttpsError(
            "permission-denied",
            "You cannot access assignments for another studio."
          );
        }

        query = query.where(
          "studioId",
          "==",
          input.studioId.trim()
        );
      } else if (!privileged) {
        query = query.where(
          "customerId",
          "==",
          actor.uid
        );
      }

      if (input.sourceType) {
        query = query.where(
          "sourceType",
          "==",
          input.sourceType
        );
      }

      if (
        input.sourceId?.trim()
      ) {
        query = query.where(
          "sourceId",
          "==",
          input.sourceId.trim()
        );
      }

      if (
        input.statuses?.length
      ) {
        if (
          input.statuses.some(
            (status) =>
              !activeStatuses.has(
                status
              )
          )
        ) {
          throw new HttpsError(
            "invalid-argument",
            "One or more assignment statuses are invalid."
          );
        }

        query = query.where(
          "status",
          "in",
          input.statuses.slice(
            0,
            10
          )
        );
      }

      if (
        input.priorities
          ?.length
      ) {
        if (
          input.priorities.some(
            (priority) =>
              !validPriorities.has(
                priority
              )
          )
        ) {
          throw new HttpsError(
            "invalid-argument",
            "One or more assignment priorities are invalid."
          );
        }

        query = query.where(
          "priority",
          "in",
          input.priorities.slice(
            0,
            10
          )
        );
      }

      if (
        input.cursorId?.trim()
      ) {
        const cursorSnapshot =
          await firestore
            .collection(
              "servicePartnerAssignments"
            )
            .doc(
              input.cursorId.trim()
            )
            .get();

        if (
          !cursorSnapshot.exists
        ) {
          throw new HttpsError(
            "invalid-argument",
            "Assignment cursor is invalid."
          );
        }

        query =
          query.startAfter(
            cursorSnapshot
          );
      }

      const snapshot =
        await query
          .limit(
            pageSize + 1
          )
          .get();

      const documents =
        snapshot.docs.slice(
          0,
          pageSize
        );

      return {
        assignments:
          documents.map(
            (document) =>
              serializeServicePartnerAssignment(
                document.id,
                document.data() as ServicePartnerAssignmentDocument
              )
          ),
        nextCursorId:
          snapshot.docs.length >
          pageSize
            ? documents.at(-1)
                ?.id ?? null
            : null,
        hasMore:
          snapshot.docs.length >
          pageSize,
      };
    }
  );
