import type {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
  DocumentData,
} from "firebase/firestore";

import type {
  Product,
  Studio,
  User,
  Order,
} from "@/types";

function createConverter<T extends DocumentData>(): FirestoreDataConverter<T> {
 return {
  toFirestore(model: WithFieldValue<T>): DocumentData {
    return {
      ...model,
    };

      },

      fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
      ): T {
        const data = snapshot.data(options);

        return {
          id: snapshot.id,
          ...data,
        } as T;
      },
    };
}

export const userConverter =
 createConverter<User>();

export const studioConverter =
 createConverter<Studio>();

export const productConverter =
 createConverter<Product>();

export const orderConverter =
  createConverter<Order>();
