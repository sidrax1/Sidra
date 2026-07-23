import {
  serverTimestamp,

  Timestamp,
  type FieldValue,
} from "firebase/firestore";

export type FirestoreTimestampValue =
 | Timestamp
 | FieldValue;

export interface FirestoreAuditTimestamps {
  createdAt: FirestoreTimestampValue;
  updatedAt: FirestoreTimestampValue;
}

export function createAuditTimestamps(): FirestoreAuditTimestamps {
 const timestamp = serverTimestamp();

    return {
      createdAt: timestamp,
      updatedAt: timestamp,
    };
}

export function createUpdateTimestamp(): {
  updatedAt: FieldValue;
}{
  return {
    updatedAt: serverTimestamp(),
  };
}

export function dateToFirestoreTimestamp(
  value: Date
): Timestamp {
  if (Number.isNaN(value.getTime())) {
    throw new TypeError(
      "A valid Date instance is required."
    );
  }

    return Timestamp.fromDate(value);
}

export function firestoreTimestampToDate(
 value: Timestamp | Date | string | number

): Date {
  if (value instanceof Timestamp) {
    return value.toDate();
  }

    if (value instanceof Date) {
      if (Number.isNaN(value.getTime())) {
        throw new TypeError(
          "Invalid Date instance."
        );
      }

        return new Date(value);
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      throw new TypeError(
        "Invalid timestamp value."
      );
    }

    return date;
}

export function firestoreTimestampToISOString(
  value: Timestamp | Date | string | number
): string {
  return firestoreTimestampToDate(value).toISOString();
}
