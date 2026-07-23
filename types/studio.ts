import type { BaseEntity, Address } from "./common";

export interface Studio extends BaseEntity {
 ownerId: string;

 name: string;

 slug: string;

 description: string;

 logo: string;

 coverImage: string;

 verified: boolean;

 active: boolean;

 rating: number;

 reviewCount: number;

 address?: Address;

 followers: number;

  productCount: number;
}
