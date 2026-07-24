import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
  type DocumentData,
  type DocumentReference,
  type FirestoreDataConverter,
  type PartialWithFieldValue,
  type SetOptions,
  type WithFieldValue,
} from "firebase/firestore";

import { getFirebaseFirestore } from "@/firebase/firestore";

export function createDocumentReference<T extends DocumentData>(
  collectionName: string,
  documentId: string,
  converter?: FirestoreDataConverter<T>
): DocumentReference<T> {
  const reference = doc(
   getFirebaseFirestore(),
   collectionName,
   documentId

    );

    return converter
     ? reference.withConverter(converter)
     : (reference as DocumentReference<T>);
}

export async function getDocumentByReference<T extends DocumentData>(
  reference: DocumentReference<T>
): Promise<T | null> {
  const snapshot = await getDoc(reference);

    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.data();
}

export async function createDocument<T extends DocumentData>(
  reference: DocumentReference<T>,
  data: WithFieldValue<T>,
  options?: SetOptions
): Promise<void> {
  const payload = {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  } as WithFieldValue<T>;

    if (options) {
      await setDoc(reference, payload, options);
      return;
    }

    await setDoc(reference, payload);
}

export async function replaceDocument<T extends DocumentData>(
  reference: DocumentReference<T>,
  data: WithFieldValue<T>
): Promise<void> {
  await setDoc(reference, {
   ...data,

      updatedAt: serverTimestamp(),
    } as WithFieldValue<T>);
}

export async function mergeDocument<T extends DocumentData>(
  reference: DocumentReference<T>,
  data: Partial<WithFieldValue<T>>
): Promise<void> {
  await setDoc(
    reference,
    {
      ...data,
      updatedAt: serverTimestamp(),
    } as PartialWithFieldValue<T>,
    {
      merge: true,
    }
  );
}

export async function updateDocument<T extends DocumentData>(
  reference: DocumentReference<T>,
  data: Partial<T>
): Promise<void> {
  await updateDoc(reference, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteDocument<T extends DocumentData>(
  reference: DocumentReference<T>
): Promise<void> {
  await deleteDoc(reference);
}
