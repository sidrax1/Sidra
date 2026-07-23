import {
  collection,
  endAt,
  getDocs,
  limit,
  orderBy,
  query,
  startAt,
  where,
} from "firebase/firestore";

import { COLLECTIONS } from "@/constants/collections";
import { PAGINATION } from "@/constants/pagination";
import { getFirebaseFirestore } from "@/firebase/firestore";
import { normalizeSearchText } from "@/lib/search-normalization";
import type { Product } from "@/types/product";
import type { Studio } from "@/types/studio";

export interface SearchResults {
  readonly products: Product[];
  readonly studios: Studio[];
  readonly normalizedQuery: string;
}

const firestore = getFirebaseFirestore();

async function searchProducts(
  normalizedQuery: string,
  maximumResults: number
): Promise<Product[]> {
  const snapshot = await getDocs(

      query(
        collection(
          firestore,
          COLLECTIONS.PRODUCTS
        ),
        where("active", "==", true),
        orderBy("searchName"),
        startAt(normalizedQuery),
        endAt(`${normalizedQuery}\uf8ff`),
        limit(maximumResults)
      )
    );

    return snapshot.docs.map(
      (productDocument) =>
       ({
         id: productDocument.id,
         ...productDocument.data(),
       }) as Product
    );
}

async function searchStudios(
  normalizedQuery: string,
  maximumResults: number
): Promise<Studio[]> {
  const snapshot = await getDocs(
    query(
      collection(
        firestore,
        COLLECTIONS.STUDIOS
      ),
      where("active", "==", true),
      where("verified", "==", true),
      orderBy("searchName"),
      startAt(normalizedQuery),
      endAt(`${normalizedQuery}\uf8ff`),
      limit(maximumResults)
    )
  );

    return snapshot.docs.map(
     (studioDocument) =>
       ({

           id: studioDocument.id,
           ...studioDocument.data(),
         }) as Studio
    );
}

export async function searchSidra(
  searchQuery: string,
  maximumResults = PAGINATION.SEARCH_LIMIT
): Promise<SearchResults> {
  const normalizedQuery =
   normalizeSearchText(searchQuery);

    if (normalizedQuery.length < 2) {
      return {
        products: [],
        studios: [],
        normalizedQuery,
      };
    }

    const safeLimit = Math.min(
      Math.max(1, maximumResults),
      PAGINATION.MAX_LIMIT
    );

    const [
      products,
      studios,
    ] = await Promise.all([
      searchProducts(
        normalizedQuery,
        safeLimit
      ),
      searchStudios(
        normalizedQuery,
        safeLimit
      ),
    ]);

    return {
     products,
     studios,
     normalizedQuery,

 };
}
