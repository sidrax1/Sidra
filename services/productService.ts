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
import { getFirebaseFirestore } from "@/firebase/firestore";
import type { Product } from "@/types/product";

const db = getFirebaseFirestore();

export async function getProductById(
  productId: string
): Promise<Product | null> {
  const snapshot = await getDoc(
    doc(db, COLLECTIONS.PRODUCTS, productId)
  );

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Product;
}

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  const snapshot = await getDocs(
   query(
     collection(db, COLLECTIONS.PRODUCTS),
     where("slug", "==", slug),
     where("active", "==", true),
     limit(1)

      )
    );

    const product = snapshot.docs[0];

    return product
     ? ({
         id: product.id,
         ...product.data(),
       } as Product)
     : null;
}

export async function getFeaturedProducts(
  maximumResults = 12
): Promise<Product[]> {
  const snapshot = await getDocs(
    query(
      collection(db, COLLECTIONS.PRODUCTS),
      where("active", "==", true),
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
       }) as Product
    );
}

export async function getStudioProducts(
  studioId: string,
  maximumResults = 24
): Promise<Product[]> {
  const snapshot = await getDocs(
   query(
     collection(db, COLLECTIONS.PRODUCTS),
     where("studioId", "==", studioId),
     where("active", "==", true),

       orderBy("updatedAt", "desc"),
       limit(maximumResults)
   )
 );

 return snapshot.docs.map(
   (document) =>
    ({
      id: document.id,
      ...document.data(),
    }) as Product
 );
}
