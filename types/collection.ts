import type { BaseEntity } from "@/types/common";

export interface Collection extends BaseEntity {
 readonly title: string;

 readonly slug: string;

 readonly coverImage: string;

 readonly description?: string;

 readonly featured: boolean;

 readonly productIds: readonly string[];
}
