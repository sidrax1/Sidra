import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { COLLECTIONS } from "@/constants/collections";
import { getFirebaseFirestore } from "@/firebase/firestore";

import type { Banner } from "@/types/banner";

export async function getActiveBanners(): Promise<Banner[]> {
 const currentTimestamp =
  new Date().toISOString();

 const snapshot = await getDocs(
   query(
     collection(
       getFirebaseFirestore(),
       COLLECTIONS.BANNERS
     ),
     where("active", "==", true),
     orderBy("priority", "asc")
   )
 );

 return snapshot.docs
  .map(
    (documentSnapshot) =>
      ({
        id: documentSnapshot.id,
        ...documentSnapshot.data(),
      }) as Banner
  )
  .filter((banner) => {
    const bannerData =
      banner as Banner & {
        startsAt?: string;
        endsAt?: string;
      };

       const started =
        !bannerData.startsAt ||
        bannerData.startsAt <= currentTimestamp;

       const notExpired =
        !bannerData.endsAt ||
        bannerData.endsAt >= currentTimestamp;

        return started && notExpired;
      });
}
