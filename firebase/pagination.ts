import type {
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";

export interface FirebasePaginationCursor<
  T extends DocumentData,
>{
  first: QueryDocumentSnapshot<T> | null;
  last: QueryDocumentSnapshot<T> | null;
}

export interface FirebasePaginationState<
 T extends DocumentData,
>{
 currentPage: number;
 pageSize: number;
 cursor: FirebasePaginationCursor<T>;
 hasPreviousPage: boolean;

    hasNextPage: boolean;
}

export function createInitialPaginationState<
  T extends DocumentData,
>(
  pageSize: number
): FirebasePaginationState<T> {
  if (
    !Number.isInteger(pageSize) ||
    pageSize < 1
  ){
    throw new RangeError(
       "pageSize must be a positive integer."
    );
  }

    return {
      currentPage: 1,
      pageSize,
      cursor: {
        first: null,
        last: null,
      },
      hasPreviousPage: false,
      hasNextPage: false,
    };
}

export function createPaginationState<
  T extends DocumentData,
>(
  currentPage: number,
  pageSize: number,
  documents: readonly QueryDocumentSnapshot<T>[],
  receivedFullPage: boolean
): FirebasePaginationState<T> {
  if (
    !Number.isInteger(currentPage) ||
    currentPage < 1
  ){
    throw new RangeError(
       "currentPage must be a positive integer."
    );

 }

 return {
   currentPage,
   pageSize,
   cursor: {
     first: documents.at(0) ?? null,
     last: documents.at(-1) ?? null,
   },
   hasPreviousPage: currentPage > 1,
   hasNextPage:
     documents.length > 0 &&
     receivedFullPage,
 };
}
