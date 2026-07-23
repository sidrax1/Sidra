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
import type { StudioAnalytics } from "@/types/analytics";

interface TrackAnalyticsEventRequest {
  readonly eventName: string;
  readonly entityType?: string;
  readonly entityId?: string;

    readonly studioId?: string;
    readonly metadata?: Record<string, unknown>;
}

interface TrackAnalyticsEventResponse {
  readonly accepted: boolean;
}

const trackEventCallable =
 callableFunction<
  TrackAnalyticsEventRequest,
  TrackAnalyticsEventResponse
 >("trackAnalyticsEvent");

const firestore = getFirebaseFirestore();

export async function trackPlatformEvent(
  input: TrackAnalyticsEventRequest
): Promise<boolean> {
  const result =
    await trackEventCallable(input);

    return result.data.accepted;
}

export async function getStudioAnalytics(
  studioId: string,
  period:
   | "day"
   | "week"
   | "month"
   | "year"
   | "lifetime",
  maximumResults = 24
): Promise<StudioAnalytics[]> {
  const snapshot = await getDocs(
   query(
     collection(
       firestore,
       COLLECTIONS.ANALYTICS
     ),
     where("studioId", "==", studioId),
     where("period", "==", period),
     orderBy("periodStart", "desc"),

       limit(maximumResults)
   )
 );

 return snapshot.docs.map(
   (analyticsDocument) =>
    ({
      id: analyticsDocument.id,
      ...analyticsDocument.data(),
    }) as StudioAnalytics
 );
}
