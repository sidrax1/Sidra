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
import type {
  CmsPage,
  CmsSection,
} from "@/types/cms";

const firestore = getFirebaseFirestore();

export async function getCmsPage(
  pageId: string
): Promise<CmsPage | null> {
  const snapshot = await getDoc(
    doc(
      firestore,
      COLLECTIONS.CMS,
      pageId
    )
  );

 if (!snapshot.exists()) {
   return null;
 }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as CmsPage;
}

export async function getPublishedCmsPageBySlug(
  slug: string
): Promise<CmsPage | null> {
  const snapshot = await getDocs(
    query(
      collection(
        firestore,
        COLLECTIONS.CMS
      ),
      where("slug", "==", slug),
      where("status", "==", "published"),
      limit(1)
    )
  );

    const pageDocument =
     snapshot.docs.at(0);

    if (!pageDocument) {
      return null;
    }

    return {
      id: pageDocument.id,
      ...pageDocument.data(),
    } as CmsPage;
}

export async function getPublishedCmsPages(
  maximumResults = 50
): Promise<CmsPage[]> {
  const snapshot = await getDocs(
   query(
    collection(
      firestore,
      COLLECTIONS.CMS
    ),
    where("status", "==", "published"),

          orderBy("publishedAt", "desc"),
          limit(maximumResults)
      )
    );

    return snapshot.docs.map(
      (pageDocument) =>
       ({
         id: pageDocument.id,
         ...pageDocument.data(),
       }) as CmsPage
    );
}

export function getEnabledCmsSections(
  page: CmsPage
): CmsSection[] {
  return [...page.sections]
    .filter((section) => section.enabled)
    .sort(
      (leftSection, rightSection) =>
        leftSection.order -
        rightSection.order
    );
}
