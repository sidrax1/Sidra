import type { BaseEntity } from "@/types/common";

export type MediaType =
 | "image"
 | "video"
 | "document";

export interface MediaAsset extends BaseEntity {
 fileName: string;
 originalFileName: string;
 storagePath: string;
 downloadURL: string;
 mimeType: string;
 type: MediaType;
 sizeBytes: number;
 width?: number;
 height?: number;
 durationSeconds?: number;

 altText?: string;
 ownerId: string;
 studioId?: string;
}
