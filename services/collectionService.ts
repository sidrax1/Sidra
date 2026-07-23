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
import type { Collection } from "@/types/collection";

export async function getFeaturedCollections(
  maximumResults = 8
): Promise<Collection[]> {
  const snapshot = await getDocs(
    query(
      collection(
        getFirebaseFirestore(),
        COLLECTIONS.PRODUCT_COLLECTIONS
      ),
      where("featured", "==", true),
      orderBy("updatedAt", "desc"),
      limit(maximumResults)
    )
  );

 return snapshot.docs.map(

   (document) =>
    ({
      id: document.id,
      ...document.data(),
    }) as Collection
 );
}
