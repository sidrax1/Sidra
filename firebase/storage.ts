import {
  connectStorageEmulator,
  getStorage,
  type FirebaseStorage,
} from "firebase/storage";

import { firebaseApp } from "@/firebase/client";
import { logger } from "@/lib/logger";

let storage: FirebaseStorage | null = null;
let emulatorConnected = false;

function initializeFirebaseStorage(): FirebaseStorage {
 if (storage) {
   return storage;
 }

    storage = getStorage(firebaseApp);

    if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV === "development" &&
      process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true" &&
      !emulatorConnected
    ){
      connectStorageEmulator(storage, "127.0.0.1", 9199);

        emulatorConnected = true;

        logger.info("Connected to Firebase Storage Emulator.");
    }

    return storage;
}

export function getFirebaseStorage(): FirebaseStorage {
  return initializeFirebaseStorage();
}
