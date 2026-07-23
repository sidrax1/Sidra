import {
  doc,
  serverTimestamp,
  writeBatch,
  type DocumentData,
  type DocumentReference,
  type Firestore,
  type WithFieldValue,
} from "firebase/firestore";

import { getFirebaseFirestore } from "@/firebase/firestore";

const FIRESTORE_BATCH_LIMIT = 500;

export interface BatchSetOperation<T extends DocumentData> {
  type: "set";
  reference: DocumentReference<T>;
  data: WithFieldValue<T>;
  merge?: boolean;
}

export interface BatchUpdateOperation<T extends DocumentData> {
  type: "update";
  reference: DocumentReference<T>;
  data: Partial<T>;
}

export interface BatchDeleteOperation<T extends DocumentData> {
  type: "delete";
  reference: DocumentReference<T>;
}

export type BatchOperation<T extends DocumentData = DocumentData> =
 | BatchSetOperation<T>
 | BatchUpdateOperation<T>
 | BatchDeleteOperation<T>;

function splitIntoBatches<T>(
  items: readonly T[],
  size: number
): T[][] {
  const batches: T[][] = [];

    for (let index = 0; index < items.length; index += size) {
      batches.push(items.slice(index, index + size));
    }

    return batches;
}

async function commitOperations(
  firestore: Firestore,
  operations: readonly BatchOperation[]
): Promise<void> {

    const batch = writeBatch(firestore);

    for (const operation of operations) {
     if (operation.type === "set") {
       batch.set(
         operation.reference,
         {
           ...operation.data,
           updatedAt: serverTimestamp(),
         },
         {
           merge: operation.merge ?? false,
         }
       );
       continue;
     }

        if (operation.type === "update") {
          batch.update(operation.reference, {
            ...operation.data,
            updatedAt: serverTimestamp(),
          });
          continue;
        }

        batch.delete(operation.reference);
    }

    await batch.commit();
}

export async function executeBatchOperations(
  operations: readonly BatchOperation[]
): Promise<void> {
  if (operations.length === 0) {
    return;
  }

    const firestore = getFirebaseFirestore();
    const batches = splitIntoBatches(
      operations,
      FIRESTORE_BATCH_LIMIT
    );

    for (const operationsBatch of batches) {
      await commitOperations(
        firestore,
        operationsBatch
      );
    }
}

export function createBatchDocumentReference<T extends DocumentData>(
  collectionName: string,
  documentId?: string
): DocumentReference<T> {
  const firestore = getFirebaseFirestore();

    return documentId
     ? (doc(
         firestore,
         collectionName,
         documentId
       ) as DocumentReference<T>)
     : (doc(
         firestore,
         collectionName
       ) as DocumentReference<T>);
}
