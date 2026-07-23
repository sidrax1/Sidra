import {
  runTransaction,
  serverTimestamp,
  type DocumentData,
  type DocumentReference,
  type Firestore,
  type Transaction,
} from "firebase/firestore";

import { getFirebaseFirestore } from "@/firebase/firestore";

export interface TransactionContext {
 firestore: Firestore;

    transaction: Transaction;
}

export async function executeTransaction<T>(
  operation: (
    context: TransactionContext
  ) => Promise<T>
): Promise<T> {
  const firestore = getFirebaseFirestore();

    return runTransaction(
      firestore,
      async (transaction) =>
        operation({
          firestore,
          transaction,
        })
    );
}

export async function transactionallyUpdateDocument<
  T extends DocumentData,
>(
  reference: DocumentReference<T>,
  updateFactory: (
    currentData: T,
    transaction: Transaction
  ) => Partial<T> | Promise<Partial<T>>
): Promise<T> {
  return executeTransaction(
    async ({ transaction }) => {
      const snapshot = await transaction.get(reference);

      if (!snapshot.exists()) {
        throw new Error(
          `Document does not exist: ${reference.path}`
        );
      }

      const currentData = snapshot.data();

      const updates = await updateFactory(
       currentData,
       transaction

          );

          transaction.update(reference, {
            ...updates,
            updatedAt: serverTimestamp(),
          });

          return {
            ...currentData,
            ...updates,
          };
      }
    );
}

export async function transactionallyIncrementField<
  T extends DocumentData,
>(
  reference: DocumentReference<T>,
  fieldName: keyof T & string,
  incrementBy: number,
  minimumValue = 0
): Promise<number> {
  if (!Number.isFinite(incrementBy)) {
    throw new TypeError(
      "incrementBy must be a finite number."
    );
  }

    return executeTransaction(
     async ({ transaction }) => {
       const snapshot = await transaction.get(reference);

          if (!snapshot.exists()) {
            throw new Error(
              `Document does not exist: ${reference.path}`
            );
          }

          const currentValue = snapshot.get(fieldName);

          if (
            typeof currentValue !== "number" ||
            !Number.isFinite(currentValue)

       ){
         throw new TypeError(
           `${fieldName} must contain a finite number.`
         );
       }

       const nextValue = Math.max(
         minimumValue,
         currentValue + incrementBy
       );

       transaction.update(reference, {
         [fieldName]: nextValue,
         updatedAt: serverTimestamp(),
       });

       return nextValue;
   }
 );
}
