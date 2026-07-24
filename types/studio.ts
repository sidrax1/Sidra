import type { BaseEntity, PostalAddress } from "./common";

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

 address?: PostalAddress;

 followers: number;

  productCount: number;
}
