import type { BaseEntity } from "@/types/common";
import type { CmsDocumentStatus, CmsSeo } from "@/types/cms";

export interface JournalArticle extends BaseEntity {
  readonly title: string;
  readonly slug: string;
  readonly excerpt: string;
  readonly content: readonly Record<string, unknown>[];
  readonly coverImageURL: string;
  readonly authorId: string;
  readonly categoryIds: readonly string[];
  readonly tags: readonly string[];
  readonly status: CmsDocumentStatus;
  readonly seo: CmsSeo;
  readonly publishedAt?: string;
  readonly scheduledAt?: string;
  readonly readingTimeMinutes: number;
}
