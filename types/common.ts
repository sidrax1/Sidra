/**
 * SIDRA Common Types
 */

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type ID = string;

export type ISODateString = string;

export type Timestamp = ISODateString;

export interface BaseEntity {
 id: ID;

    createdAt: Timestamp;

    updatedAt: Timestamp;

    createdBy?: ID;

    updatedBy?: ID;
}

export interface Pagination {
 page: number;

    limit: number;
}

export interface PaginationMeta {
 page: number;

    limit: number;

    totalItems: number;

    totalPages: number;

    hasNextPage: boolean;

    hasPreviousPage: boolean;
}

export interface ApiResponse<T> {
 success: boolean;

    data: T;

    message?: string;
}

export interface ApiError {
 success: false;

    code: string;

    message: string;
}

export interface SelectOption {
 label: string;

    value: string;
}

export interface Coordinates {
 latitude: number;

    longitude: number;
}

export interface PostalAddress {
 fullName: string;

    phone: string;

    addressLine1: string;

    addressLine2?: string;

    city: string;

    state: string;

    country: string;

    postalCode: string;

    landmark?: string;

  coordinates?: Coordinates;
}
