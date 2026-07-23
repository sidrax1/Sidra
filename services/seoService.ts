import {
  collection,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";

import { COLLECTIONS } from "@/constants/collections";
import { callableFunction } from "@/firebase/functions";
import { getFirebaseFirestore } from "@/firebase/firestore";
import type { SeoMetadata } from "@/types/seo";

interface SaveSeoMetadataRequest {
  readonly entityType: SeoMetadata["entityType"];
  readonly entityId: string;
  readonly canonicalPath: string;
  readonly title: string;
  readonly description: string;
  readonly keywords: readonly string[];
  readonly openGraphImageURL?: string;
  readonly noIndex: boolean;
  readonly noFollow: boolean;
  readonly structuredData?: Record<string, unknown>;
}

interface SaveSeoMetadataResponse {

    readonly seo: SeoMetadata;
}

const saveSeoMetadataCallable =
 callableFunction<
  SaveSeoMetadataRequest,
  SaveSeoMetadataResponse
 >("saveSeoMetadata");

export async function saveSeoMetadata(
  input: SaveSeoMetadataRequest
): Promise<SeoMetadata> {
  const result =
    await saveSeoMetadataCallable(
      input
    );

    return result.data.seo;
}

export async function getSeoMetadata(
  entityType: SeoMetadata["entityType"],
  entityId: string
): Promise<SeoMetadata | null> {
  const snapshot = await getDocs(
    query(
      collection(
        getFirebaseFirestore(),
        COLLECTIONS.SEO
      ),
      where(
        "entityType",
        "==",
        entityType
      ),
      where(
        "entityId",
        "==",
        entityId
      ),
      limit(1)
    )
  );

 const seoDocument =
  snapshot.docs.at(0);

 return seoDocument
  ? ({
      id: seoDocument.id,
      ...seoDocument.data(),
    } as SeoMetadata)
  : null;
}
