import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { COLLECTIONS } from "@/constants/collections";
import { getFirebaseFirestore } from "@/firebase/firestore";
import type { Category } from "@/types/category";

export async function getActiveCategories(): Promise<Category[]> {
 const snapshot = await getDocs(
   query(
     collection(
       getFirebaseFirestore(),
       COLLECTIONS.PRODUCT_CATEGORIES
     ),
     where("active", "==", true),
     orderBy("order", "asc")
   )
 );

 return snapshot.docs.map(
   (document) =>
    ({
      id: document.id,
      ...document.data(),
    }) as Category
 );
}
