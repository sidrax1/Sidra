import {
  documentId,

  endBefore,
  getCountFromServer,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
  startAt,
  where,
  type CollectionReference,
  type DocumentData,
  type DocumentSnapshot,
  type FieldPath,
  type OrderByDirection,
  type Query,
  type QueryConstraint,
  type QueryDocumentSnapshot,
  type WhereFilterOp,
} from "firebase/firestore";

export interface QueryFilter {
  field: string | FieldPath;
  operator: WhereFilterOp;
  value: unknown;
}

export interface QueryOrder {
  field: string | FieldPath;
  direction?: OrderByDirection;
}

export interface QueryPageOptions<T extends DocumentData> {
  filters?: readonly QueryFilter[];
  orders?: readonly QueryOrder[];
  pageSize: number;
  startAfterDocument?: QueryDocumentSnapshot<T>;
  startAtDocument?: QueryDocumentSnapshot<T>;
  endBeforeDocument?: QueryDocumentSnapshot<T>;
  direction?: "forward" | "backward";
}

export interface QueryPageResult<T extends DocumentData> {
 items: T[];

    documents: QueryDocumentSnapshot<T>[];
    firstDocument: QueryDocumentSnapshot<T> | null;
    lastDocument: QueryDocumentSnapshot<T> | null;
    empty: boolean;
}

function buildQueryConstraints<T extends DocumentData>(
  options: QueryPageOptions<T>
): QueryConstraint[] {
  const constraints: QueryConstraint[] = [];

    for (const filter of options.filters ?? []) {
      constraints.push(
        where(
          filter.field,
          filter.operator,
          filter.value
        )
      );
    }

    for (const order of options.orders ?? []) {
      constraints.push(
        orderBy(
          order.field,
          order.direction ?? "asc"
        )
      );
    }

    if (options.startAfterDocument) {
      constraints.push(
        startAfter(options.startAfterDocument)
      );
    }

    if (options.startAtDocument) {
      constraints.push(
        startAt(options.startAtDocument)
      );
    }

    if (options.endBeforeDocument) {
      constraints.push(

          endBefore(options.endBeforeDocument)
        );
    }

    constraints.push(
      options.direction === "backward"
       ? limitToLast(options.pageSize)
       : limit(options.pageSize)
    );

    return constraints;
}

export function createPaginatedQuery<T extends DocumentData>(
  reference: CollectionReference<T>,
  options: QueryPageOptions<T>
): Query<T> {
  if (!Number.isInteger(options.pageSize) || options.pageSize < 1) {
    throw new RangeError("pageSize must be a positive integer.");
  }

    return query(
      reference,
      ...buildQueryConstraints(options)
    );
}

export async function executePaginatedQuery<T extends DocumentData>(
  reference: CollectionReference<T>,
  options: QueryPageOptions<T>
): Promise<QueryPageResult<T>> {
  const snapshot = await getDocs(
    createPaginatedQuery(reference, options)
  );

    const documents = snapshot.docs;

    return {
      items: documents.map((document) => document.data()),
      documents,
      firstDocument: documents.at(0) ?? null,
      lastDocument: documents.at(-1) ?? null,
      empty: snapshot.empty,
    };

}

export async function countDocuments<T extends DocumentData>(
  reference: CollectionReference<T>,
  filters: readonly QueryFilter[] = []
): Promise<number> {
  const constraints = filters.map((filter) =>
    where(
      filter.field,
      filter.operator,
      filter.value
    )
  );

    const aggregateSnapshot = await getCountFromServer(
      query(reference, ...constraints)
    );

    return aggregateSnapshot.data().count;
}

export function documentIdField(): FieldPath {
  return documentId();
}

export type FirebaseDocumentSnapshot<T extends DocumentData> =
  DocumentSnapshot<T>;
