import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { COLLECTIONS } from "@/constants/collections";
import { callableFunction } from "@/firebase/functions";
import { getFirebaseFirestore } from "@/firebase/firestore";
import type {
 CorporateLead,

  CorporateLeadStatus,
} from "@/types/corporate-lead";

interface SubmitCorporateLeadRequest {
  readonly companyName: string;
  readonly contactName: string;
  readonly email: string;
  readonly phone: string;
  readonly city: string;
  readonly requirement: string;
  readonly estimatedQuantity: number;
  readonly estimatedBudgetPaise?: number;
  readonly requiredBy?: string;
}

interface SubmitCorporateLeadResponse {
  readonly lead: CorporateLead;
}

interface UpdateCorporateLeadRequest {
  readonly leadId: string;
  readonly status?: CorporateLeadStatus;
  readonly assignedTo?: string;
  readonly notes?: string;
}

interface UpdateCorporateLeadResponse {
  readonly lead: CorporateLead;
}

const submitCorporateLeadCallable =
 callableFunction<
  SubmitCorporateLeadRequest,
  SubmitCorporateLeadResponse
 >("submitCorporateLead");

const updateCorporateLeadCallable =
 callableFunction<
  UpdateCorporateLeadRequest,
  UpdateCorporateLeadResponse
 >("updateCorporateLead");

export async function submitCorporateLead(
 input: SubmitCorporateLeadRequest

): Promise<CorporateLead> {
  const result =
   await submitCorporateLeadCallable(
     input
   );

    return result.data.lead;
}

export async function updateCorporateLead(
  input: UpdateCorporateLeadRequest
): Promise<CorporateLead> {
  const result =
    await updateCorporateLeadCallable(
      input
    );

    return result.data.lead;
}

export async function getCorporateLeads(
  status?: CorporateLeadStatus,
  maximumResults = 50
): Promise<CorporateLead[]> {
  const collectionReference =
   collection(
     getFirebaseFirestore(),
     COLLECTIONS.CORPORATE_LEADS
   );

    const leadsQuery = status
     ? query(
         collectionReference,
         where("status", "==", status),
         orderBy("createdAt", "desc"),
         limit(maximumResults)
       )
     : query(
         collectionReference,
         orderBy("createdAt", "desc"),
         limit(maximumResults)
       );

    const snapshot =

      await getDocs(leadsQuery);

 return snapshot.docs.map(
   (leadDocument) =>
     ({
       id: leadDocument.id,
       ...leadDocument.data(),
     }) as CorporateLead
 );
}
