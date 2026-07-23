import type { BaseEntity } from "@/types/common";

export type CmsDocumentStatus =
 | "draft"
 | "scheduled"
 | "published"
 | "archived";

export interface CmsSeo {
  title: string;
  description: string;
  imageURL?: string;
  noIndex?: boolean;
}

export interface CmsSection {
  id: string;
  type: string;
  enabled: boolean;
  order: number;
  content: Record<string, unknown>;
}

export interface CmsPage extends BaseEntity {
  slug: string;
  title: string;
  status: CmsDocumentStatus;
  sections: CmsSection[];
  seo: CmsSeo;
  publishedAt?: string;
  scheduledAt?: string;
}
