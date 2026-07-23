import {
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";

import {
  assignmentReference,
  partnerReference,
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
  ServicePartnerDocument,
} from "./servicePartnerTypes";

interface GetServicePartnerAssignmentInput {
  readonly assignmentId: string;
}

export const getServicePartnerAssignment =
  onCall(
    {
      region:
        "asia-south1",
      enforceAppCheck: true,
      cors: true,
      timeoutSeconds: 30,
      memory: "256MiB",
    },
    async (request) => {
      const actor =
        requireAuthenticatedActor(
          request
        );

      const input =
        request.data as Partial<GetServicePartnerAssignmentInput>;

      const assignmentId =
        typeof input.assignmentId ===
          "string"
          ? input.assignmentId.trim()
          : "";

      if (!assignmentId) {
        throw new HttpsError(
          "invalid-argument",
          "Assignment ID is required."
        );
      }

      const assignmentSnapshot =
        await assignmentReference(
          assignmentId
        ).get();

      if (
        !assignmentSnapshot.exists
      ) {
        throw new HttpsError(
          "not-found",
          "Service assignment was not found."
        );
      }

      const assignment =
        assignmentSnapshot.data() as ServicePartnerAssignmentDocument;

      const partnerSnapshot =
        await partnerReference(
          assignment.partnerId
        ).get();

      const partner =
        partnerSnapshot.exists
          ? (partnerSnapshot.data() as ServicePartnerDocument)
          : null;

      const authorised =
        actor.uid ===
          assignment.customerId ||
        actor.uid ===
          assignment.studioId ||
        actor.uid ===
          partner?.applicantUserId ||
        hasPermission(
          actor,
          "servicePartners.manageAssignments"
        ) ||
        hasPermission(
          actor,
          "servicePartners.readAssignments"
        );

      if (!authorised) {
        throw new HttpsError(
          "permission-denied",
          "You are not authorised to view this assignment."
        );
      }

      return {
        assignment:
          serializeServicePartnerAssignment(
            assignmentSnapshot.id,
            assignment
          ),
      };
    }
  );
