import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { COLLECTIONS } from "@/constants/collections";
import { getFirebaseFirestore } from "@/firebase/firestore";
import type { Campaign } from "@/types/campaign";

const firestore = getFirebaseFirestore();

export async function getActiveCampaigns(
  maximumResults = 20
): Promise<Campaign[]> {
  const currentTime =
   new Date().toISOString();

    const snapshot = await getDocs(
      query(
        collection(
          firestore,
          COLLECTIONS.CAMPAIGNS
        ),
        where("status", "==", "active"),
        where(
          "startsAt",
          "<=",
          currentTime
        ),
        orderBy("startsAt", "desc"),
        limit(maximumResults)
      )
    );

    return snapshot.docs
     .map(
       (campaignDocument) =>
         ({
           id: campaignDocument.id,
           ...campaignDocument.data(),
         }) as Campaign
     )
     .filter(
       (campaign) =>
         campaign.endsAt >=
         currentTime
     );
}

export async function getCampaignBySlug(
  slug: string
): Promise<Campaign | null> {
  const snapshot = await getDocs(
   query(
     collection(
       firestore,
       COLLECTIONS.CAMPAIGNS
     ),
     where("slug", "==", slug),
     where("status", "==", "active"),
     limit(1)

   )
 );

 const campaignDocument =
  snapshot.docs.at(0);

 return campaignDocument
  ? ({
      id: campaignDocument.id,
      ...campaignDocument.data(),
    } as Campaign)
  : null;
}
