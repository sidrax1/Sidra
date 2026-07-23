import {
  collection,
  doc,
  getDoc,
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
  SellerApplication,
  SellerApplicationStatus,
} from "@/types/seller-application";

export interface SubmitSellerApplicationRequest {
  readonly fullName: string;
  readonly studioName: string;
  readonly mobile: string;
  readonly city: string;
  readonly state: string;
  readonly instagramURL?: string;
  readonly experience: string;
  readonly categoryIds: readonly string[];
  readonly reasonToJoin: string;
  readonly expectedMonthlyCapacity: number;
  readonly portfolioStoragePaths: readonly string[];
}

interface SubmitSellerApplicationResponse {
  readonly application: SellerApplication;
}

interface ReviewSellerApplicationRequest {
  readonly applicationId: string;
  readonly decision:
   | "approve"
   | "reject"
   | "requestMoreInfo"
   | "hold";
  readonly reviewNotes?: string;
}

interface ReviewSellerApplicationResponse {
  readonly application: SellerApplication;
}

const submitApplicationCallable =
 callableFunction<
  SubmitSellerApplicationRequest,
  SubmitSellerApplicationResponse

    >("submitSellerApplication");

const reviewApplicationCallable =
 callableFunction<
  ReviewSellerApplicationRequest,
  ReviewSellerApplicationResponse
 >("reviewSellerApplication");

const firestore = getFirebaseFirestore();

export async function submitSellerApplication(
  input: SubmitSellerApplicationRequest
): Promise<SellerApplication> {
  const result =
    await submitApplicationCallable(
      input
    );

    return result.data.application;
}

export async function reviewSellerApplication(
  input: ReviewSellerApplicationRequest
): Promise<SellerApplication> {
  const result =
    await reviewApplicationCallable(
      input
    );

    return result.data.application;
}

export async function getSellerApplication(
  applicationId: string
): Promise<SellerApplication | null> {
  const snapshot = await getDoc(
    doc(
      firestore,
      COLLECTIONS.SELLER_APPLICATIONS,
      applicationId
    )
  );

    if (!snapshot.exists()) {

        return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as SellerApplication;
}

export async function getUserSellerApplication(
  applicantId: string
): Promise<SellerApplication | null> {
  const snapshot = await getDocs(
    query(
      collection(
        firestore,
        COLLECTIONS.SELLER_APPLICATIONS
      ),
      where(
        "applicantId",
        "==",
        applicantId
      ),
      orderBy("createdAt", "desc"),
      limit(1)
    )
  );

    const applicationDocument =
     snapshot.docs.at(0);

    return applicationDocument
     ? ({
         id: applicationDocument.id,
         ...applicationDocument.data(),
       } as SellerApplication)
     : null;
}

export async function getSellerApplicationsByStatus(
  status: SellerApplicationStatus,
  maximumResults = 50
): Promise<SellerApplication[]> {
  const snapshot = await getDocs(

   query(
     collection(
       firestore,
       COLLECTIONS.SELLER_APPLICATIONS
     ),
     where("status", "==", status),
     orderBy("createdAt", "desc"),
     limit(maximumResults)
   )
 );

 return snapshot.docs.map(
   (applicationDocument) =>
    ({
      id: applicationDocument.id,
      ...applicationDocument.data(),
    }) as SellerApplication
 );
}
