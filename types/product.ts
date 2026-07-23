import type { BaseEntity } from "./common";

export interface ProductImage {
 id: string;

 url: string;

 alt: string;

    width: number;

    height: number;
}

export interface ProductPrice {
 currency: "INR";

    amount: number;

    discountAmount?: number;

    finalAmount: number;
}

export interface Product extends BaseEntity {
 studioId: string;

    title: string;

    slug: string;

    description: string;

    categoryId: string;

    collectionId?: string;

    images: ProductImage[];

    price: ProductPrice;

    inventory: number;

    featured: boolean;

    active: boolean;

    rating: number;

    reviewCount: number;

    tags: string[];
}
