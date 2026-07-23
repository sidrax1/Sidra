import type { BaseEntity } from "@/types/common";

export interface SeoMetadata extends BaseEntity {
  readonly entityType:
    | "page"
    | "studio"
    | "product"
    | "category"
    | "collection"
    | "journal"
    | "campaign";
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
