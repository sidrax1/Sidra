import {
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";

import {
  applicationReference,
  requireAuthenticatedActor,
} from "./servicePartnerRepository";
import {
  requireMatchingUser,
} from "./servicePartnerAuthorization";
import {
  serializeServicePartnerApplication,
} from "./servicePartnerSerializers";
import type {
  ServicePartnerApplicationDocument,
} from "./servicePartnerTypes";

interface GetServicePartnerApplicationInput {
  readonly applicationId: string;
}

export const getServicePartnerApplication =
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
        request.data as Partial<GetServicePartnerApplicationInput>;

      const applicationId =
        typeof input.applicationId ===
          "string"
          ? input.applicationId.trim()
          : "";

      if (!applicationId) {
        throw new HttpsError(
          "invalid-argument",
          "Application ID is required."
        );
      }

      const snapshot =
        await applicationReference(
          applicationId
        ).get();

      if (!snapshot.exists) {
        throw new HttpsError(
          "not-found",
          "Service-partner application was not found."
        );
      }

      const application =
        snapshot.data() as ServicePartnerApplicationDocument;

      requireMatchingUser(
        actor,
        application.applicantUserId,
        "servicePartners.review"
      );

      return {
        application:
          serializeServicePartnerApplication(
            snapshot.id,
            application
          ),
      };
    }
  );
