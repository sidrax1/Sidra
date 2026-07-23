import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";

import { COLLECTIONS } from "@/constants/collections";
import { getFirebaseFirestore } from "@/firebase/firestore";
import type { Studio } from "@/types/studio";

const db = getFirebaseFirestore();

export async function getStudioById(
  studioId: string
): Promise<Studio | null> {
  const snapshot = await getDoc(
    doc(db, COLLECTIONS.STUDIOS, studioId)
  );

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Studio;
}

export async function getStudioBySlug(
  slug: string
): Promise<Studio | null> {
  const snapshot = await getDocs(

      query(
        collection(db, COLLECTIONS.STUDIOS),
        where("slug", "==", slug),
        where("active", "==", true),
        limit(1)
      )
    );

    const studio = snapshot.docs[0];

    return studio
     ? ({
         id: studio.id,
         ...studio.data(),
       } as Studio)
     : null;
}

export async function getActiveStudios(
  maximumResults = 24
): Promise<Studio[]> {
  const snapshot = await getDocs(
    query(
      collection(db, COLLECTIONS.STUDIOS),
      where("active", "==", true),
      where("verified", "==", true),
      limit(maximumResults)
    )
  );

    return snapshot.docs.map(
      (document) =>
       ({
         id: document.id,
         ...document.data(),
       }) as Studio
    );
}
