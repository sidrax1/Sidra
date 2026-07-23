import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { COLLECTIONS } from "@/constants/collections";
import { getFirebaseFirestore } from "@/firebase/firestore";

export interface FaqItem {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
  readonly category: string;
  readonly order: number;
  readonly active: boolean;
}

export async function getActiveFaqItems(
  category?: string
): Promise<FaqItem[]> {
  const faqCollection = collection(
    getFirebaseFirestore(),
    COLLECTIONS.FAQ
  );

 const faqQuery = category
  ? query(
      faqCollection,
      where("active", "==", true),
      where("category", "==", category),
      orderBy("order", "asc")
    )
  : query(
      faqCollection,
      where("active", "==", true),

        orderBy("order", "asc")
      );

 const snapshot =
  await getDocs(faqQuery);

 return snapshot.docs.map(
   (documentSnapshot) => ({
     id: documentSnapshot.id,
     ...documentSnapshot.data(),
   }) as FaqItem
 );
}
