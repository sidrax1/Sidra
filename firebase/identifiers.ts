import {
  collection,
  doc,
} from "firebase/firestore";

import { getFirebaseFirestore } from "@/firebase/firestore";

export function createFirestoreDocumentId(
  collectionName: string
): string {
  const normalizedCollectionName =
   collectionName.trim();

    if (!normalizedCollectionName) {
      throw new Error(
        "collectionName is required."
      );
    }

    const reference = doc(
      collection(
        getFirebaseFirestore(),
        normalizedCollectionName
      )
    );

    return reference.id;
}

export function assertValidDocumentId(
  documentId: string
): string {
  const normalizedDocumentId =
   documentId.trim();

    if (!normalizedDocumentId) {
      throw new Error(
        "documentId is required."
      );
    }

 if (normalizedDocumentId.includes("/")) {
   throw new Error(
     "documentId cannot contain forward slashes."
   );
 }

 if (
   normalizedDocumentId === "." ||
   normalizedDocumentId === ".."
 ){
   throw new Error(
      "documentId is invalid."
   );
 }

 return normalizedDocumentId;
}
