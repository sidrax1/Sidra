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
import type { JournalArticle } from "@/types/journal";

const firestore = getFirebaseFirestore();

export async function getPublishedJournalArticles(
  maximumResults = 20
): Promise<JournalArticle[]> {
  const snapshot = await getDocs(
    query(
      collection(
        firestore,
        COLLECTIONS.JOURNAL
      ),
      where(
        "status",
        "==",
        "published"
      ),
      orderBy(
        "publishedAt",
        "desc"
      ),
      limit(maximumResults)
    )
  );

    return snapshot.docs.map(
      (articleDocument) =>
       ({
         id: articleDocument.id,
         ...articleDocument.data(),
       }) as JournalArticle
    );
}

export async function getJournalArticleBySlug(
  slug: string
): Promise<JournalArticle | null> {

 const snapshot = await getDocs(
   query(
     collection(
       firestore,
       COLLECTIONS.JOURNAL
     ),
     where(
       "slug",
       "==",
       slug
     ),
     where(
       "status",
       "==",
       "published"
     ),
     limit(1)
   )
 );

 const articleDocument =
  snapshot.docs.at(0);

 return articleDocument
  ? ({
      id: articleDocument.id,
      ...articleDocument.data(),
    } as JournalArticle)
  : null;
}
