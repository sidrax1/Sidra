import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import { COLLECTIONS } from "@/constants/collections";
import { getFirebaseFirestore } from "@/firebase/firestore";
import type { RecentlyViewedItem } from "@/types/recently-viewed";

const firestore = getFirebaseFirestore();

export async function recordRecentlyViewed(
  userId: string,
  entityType:
   | "product"
   | "studio",
  entityId: string
): Promise<void> {
  const documentId =
   `${userId}_${entityType}_${entityId}`;

 await setDoc(

      doc(
        firestore,
        COLLECTIONS.RECENTLY_VIEWED,
        documentId
      ),
      {
        userId,
        entityType,
        entityId,
        viewedAt:
          serverTimestamp(),
        updatedAt:
          serverTimestamp(),
      },
      {
        merge: true,
      }
    );
}

export async function getRecentlyViewed(
  userId: string,
  maximumResults = 20
): Promise<RecentlyViewedItem[]> {
  const snapshot = await getDocs(
    query(
      collection(
        firestore,
        COLLECTIONS.RECENTLY_VIEWED
      ),
      where("userId", "==", userId),
      orderBy("viewedAt", "desc"),
      limit(maximumResults)
    )
  );

    return snapshot.docs.map(
      (recentDocument) =>
        ({
          id: recentDocument.id,
          ...recentDocument.data(),
        }) as RecentlyViewedItem
    );
}

export async function removeRecentlyViewed(
  itemId: string
): Promise<void> {
  await deleteDoc(
    doc(
      firestore,
      COLLECTIONS.RECENTLY_VIEWED,
      itemId
    )
  );
}
