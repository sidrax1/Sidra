import {
  Timestamp,
  type DocumentData,
} from "firebase/firestore";

function serializeValue(value: unknown): unknown {
 if (value instanceof Timestamp) {

        return value.toDate().toISOString();
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    if (Array.isArray(value)) {
      return value.map(serializeValue);
    }

    if (
      typeof value === "object" &&
      value !== null
    ){
      return Object.fromEntries(
         Object.entries(value).map(
           ([key, entry]) => [
             key,
             serializeValue(entry),
           ]
         )
      );
    }

    return value;
}

export function serializeFirestoreData<
  T extends DocumentData,
>(value: T): T {
  return serializeValue(value) as T;
}

export function serializeFirestoreList<
  T extends DocumentData,
>(items: readonly T[]): T[] {
  return items.map((item) =>
    serializeFirestoreData(item)
  );
}
