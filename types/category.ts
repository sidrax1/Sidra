import type { BaseEntity } from "@/types/common";

export interface Category extends BaseEntity {
 readonly name: string;

 readonly slug: string;

 readonly image?: string;

 readonly icon?: string;

 readonly description?: string;

 readonly featured: boolean;

 readonly order: number;
}
