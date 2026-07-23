import {
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";

import {
  firestore,
  partnerReference,
  requireAuthenticatedActor,
} from "../servicePartnerRepository";
import {
  hasPermission,
} from "../servicePartnerAuthorization";
import type {
  ServicePartnerDocument,
} from "../servicePartnerTypes";

import {
  ensureServicePartnerWallet,
  serializeServicePartnerWallet,
  servicePartnerWalletReference,
} from "./servicePartnerWalletRepository";

interface GetServicePartnerWalletInput {
  readonly partnerId?: string;
  readonly createIfMissing?: boolean;
}

export const getServicePartnerWallet =
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
    (request.data ??
      {}) as GetServicePartnerWalletInput;

   const privileged =
    hasPermission(
      actor,
      "servicePartners.readWallets"
    ) ||
    hasPermission(
      actor,
      "servicePartners.manageWallets"
    );

   let partnerId =
     input.partnerId?.trim();

let partner:
  | ServicePartnerDocument
  | undefined;

if (partnerId) {
  const partnerSnapshot =
    await partnerReference(
      partnerId
    ).get();

 if (
   !partnerSnapshot.exists
 ){
   throw new HttpsError(
      "not-found",
      "Service partner was not found."
   );
 }

 partner =
  partnerSnapshot.data() as ServicePartnerDocument;

  if (
    !privileged &&
    partner.applicantUserId !==
       actor.uid
  ){
    throw new HttpsError(
       "permission-denied",
       "You cannot access this service-partner wallet."
    );
  }
} else {
  const ownedPartnerSnapshot =
    await firestore
       .collection(
         "servicePartners"
       )
       .where(
         "applicantUserId",
         "==",
         actor.uid
       )
       .limit(1)

         .get();

    if (
      ownedPartnerSnapshot.empty
    ){
      if (privileged) {
         throw new HttpsError(
           "invalid-argument",
           "Partner ID is required for administrative wallet access."
         );
      }

        throw new HttpsError(
          "not-found",
          "No service-partner profile is associated with this account."
        );
    }

    const ownedDocument =
     ownedPartnerSnapshot.docs[0]!;

    partnerId =
     ownedDocument.id;

    partner =
     ownedDocument.data() as ServicePartnerDocument;
}

const walletReference =
 servicePartnerWalletReference(
   partnerId
 );

let walletSnapshot =
  await walletReference.get();

if (
  !walletSnapshot.exists &&
  input.createIfMissing !==
     false
){
  await firestore.runTransaction(
     async (transaction) => {
      await ensureServicePartnerWallet(

                    transaction,
                    {
                      partnerId,
                      partnerNumber:
                       partner!.partnerNumber,
                      applicantUserId:
                       partner!.applicantUserId,
                    }
                  );
              }
            );

            walletSnapshot =
             await walletReference.get();
        }

        if (
          !walletSnapshot.exists
        ){
          return {
             wallet: null,
          };
        }

        return {
          wallet:
           serializeServicePartnerWallet(
             walletSnapshot.id,
             walletSnapshot.data()!
           ),
        };
    }
  );
